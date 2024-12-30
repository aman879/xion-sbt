"use client";
import React, { useEffect, useState } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import Navbar from "@/app/component/Navbar/Navbar";
import "./App.css";
import address from "./contract/info.json";
import jws from "./contract/key.json";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PinataSDK } from 'pinata-web3';
import Home from "./component/Home/Home";
import Mint from "./component/Mint/Mint";
import Explore from "./component/Explore/Explore";
const pinata = new PinataSDK({
  pinataJwt: jws.jws,
  pinataGateway: "beige-sophisticated-baboon-74.mypinata.cloud",
});

const contractAddress = address.address;

interface NFT {
  id: number;
  owner: string;
  name: string;
  description: string;
  image: string;
}

interface ResponseData {
  name: string,
  description: string,
  image: string,
}

export default function Page() {
  const [route, setRoute] = useState("home");
  const [isMinting, setIsMinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFT [] | null>(null);
  const [shouldFetchNfts, setShouldFetchNfts] = useState(true);

  const {
    isConnected,
  } = useAbstraxionAccount();
  const {data: account} = useAbstraxionAccount();
  
  const [, setShow] = useModal();
  const {client} = useAbstraxionSigningClient();

  useEffect(() => {
    async function getAllNfts() {
      if (isConnected && account?.bech32Address && shouldFetchNfts && client) {
        try {
          setIsLoading(true);
          const totalCount = Number(
            await client?.queryContractSmart(contractAddress, {
              get_sbt_counter: {},
            })
          );
          const nftDataArray: NFT[] = [];
          for (let i = 0; i < totalCount; i++) {
            const nftRes = await client?.queryContractSmart(contractAddress, {
              get_sbt: { id: i },
            });
            const nftResFil = nftRes.Ok;
            const response = await pinata.gateways.get(
              `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${nftResFil.uri}`
            );
            const data = response.data as ResponseData | Blob;

            if (data instanceof Blob) {
              toast.error("Received Blob instead of expected JSON data.");
              return;
            }
  
            const nftData = {
              id: nftResFil.sbt_id,
              owner: nftResFil.owner,
              name: data.name,
              description: data.description,
              image: data.image,
            };
            nftDataArray.push(nftData);
          }
          console.log(nftDataArray)
          setNfts(nftDataArray);
        } catch (e) {
          toast.error("Error fetching SBTs", {
            pauseOnHover: false,
            position: "top-center",
          });
          console.error(e);
        } finally {
          setIsLoading(false);
          setShouldFetchNfts(false);
        }
      }
    }
  
    getAllNfts();
  }, [isConnected, account?.bech32Address, shouldFetchNfts, client, contractAddress]);
  

  const onRouteChange = (route: string) => {
    setRoute(route);
  };

  const uploadToPinata = async (file: File, name: string, description: string): Promise<string> => {
    if (!file) {
      throw new Error("File is required");
    }

    try {
      toast.info("Uploading video to IPFS", {
        position:"top-center"
      })
      const uploadImage = await pinata.upload.file(file);
      const metadata = await pinata.upload.json({
        name: name,
        description: description,
        image: `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`,
      });

      return metadata.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      toast.error("Minting SBT failed.", {
        position: "top-center",
        pauseOnHover: false,
      });
      throw new Error("Upload to Pinata failed.");
    }
  };

  const mintNFT = async (_uri:string) => {
    if(!account || !isConnected) return;

    try {
      setIsMinting(true); 
      
      const msg = {
          mint_sbt: {
          uri: _uri,
        },
      };

      const mintResult = await client?.execute(
        account.bech32Address,
        contractAddress,
        msg,
        {
          amount: [{amount: "1", denom: "uxion"}],
          gas: "500000",
          granter: "xion130p0mzev8cys7flwwcam3ktu4pjel7ymak5w788eelqx8kqh5apsfqdk4e",
        },
        "",
        []
      );

      console.log(mintResult?.transactionHash)
      
      const result = await client?.queryContractSmart(contractAddress, {
        get_sbt: {id: 0},
      });
      console.log(result)
      toast.success(`SBT minted successfully ${mintResult?.transactionHash}`, {
        position: "top-center"
      });
      setShouldFetchNfts(true);
      onRouteChange("home");
    } catch (e) {
      console.log("error", e);
      toast.error(`Error minting SBT: ${e}`, {
        position: "top-center"
      });
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className="gradient-bg-welcome h-screen w-screen">
          <Navbar
            onRouteChange={onRouteChange}
            setShow={setShow}
            address={account.bech32Address}
            Abstraxion={Abstraxion}
            />
          {
            route == "home" ? (
              <Home onRouteChange={onRouteChange}/>
            ) : route == "explore" ? (
              <Explore nfts={nfts} isConnected={isConnected} isLoading={isLoading}/>
            )
             : route == "mint" ? (
              <Mint uploadToPinata={uploadToPinata} mintNFT={mintNFT} isMinting={isMinting}/>
            ) : (
              <>Cannot find page</>
            )
          }
        </div>
      </div>
    </div>
  );
}
