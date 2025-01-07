import React from "react";
import CardList from "../CardList/CardList";
import "../../App.css"

interface NFT {
  id: number;
  owner: string;
  name: string;
  description: string;
  image: string;
}

interface ExploreProps {
  nfts: NFT[] | null;
  isConnected: boolean;
  isLoading: boolean;
}

const Explore: React.FC<ExploreProps> = ({
  nfts,
  isConnected,
  isLoading,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full gradient-bg-welcome pt-[11vh]">
        {isConnected ? (
          isLoading ? (
            <div className="text-center">
              <p className="text-white text-xl">Loading...</p>
            </div>
          ) : (
            <CardList userNFTs={nfts}/>
          )
        ) : (
          <div className="text-center">
            <p className="text-white text-lg">Connect your wallet</p>
          </div>
        )}
      </div>
  );
};

export default Explore;
