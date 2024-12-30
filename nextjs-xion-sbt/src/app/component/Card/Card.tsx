import React from "react";

interface CardProps {
  id: number;
  owner: string;
  name: string;
  image: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ id, owner, name, image, description}) => {
  const idNum = Number(id);
  console.log("id", id)

  return (
    <div className="flex-1 max-w-xs h-[470px] transition-all relative">
      <div className="flex flex-col w-full h-full bg-white/5 shadow-lg backdrop-blur-md rounded-lg p-4">
        <img
          className="h-[230px] w-full object-cover rounded-lg mb-4"
          src={image}
          onClick={(e) => e.preventDefault()}
        />
        <div className="flex justify-between items-center text-white mb-2">
          <p></p>
          <span className="text-[10px] text-gray-400">SBT ID: {idNum}</span>
        </div>
        <div className="flex flex-col flex-1 space-y-2">
          <div>
            <span className="font-bold text-white">Name:</span>
            <p className="text-white">{name}</p>
          </div>
          <div>
            <span className="font-bold text-white">Owner:</span>
            <p className="text-white truncate">{owner}</p>
          </div>
          <div>
            <span className="font-bold text-white">Description:</span>
            <p className="text-white">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
