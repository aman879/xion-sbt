import React from "react";
import Card from "../Card/Card";

interface NFT {
  id: number;
  owner: string;
  name: string;
  description: string;
  image: string;
}

interface CardListProps {
  userNFTs: NFT[] | null;
}

const CardList: React.FC<CardListProps> = ({ userNFTs}) => {
  const cardComponents = userNFTs?.map((nft) => (
    <Card
      key={nft.id}
      id={nft.id}
      owner={nft.owner}
      name={nft.name}
      description={nft.description}
      image={nft.image}
    />
  ));

  return (
    <div>
      {userNFTs?.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center pb-5">{cardComponents}</div>
      )}
    </div>
  );
};

export default CardList;
