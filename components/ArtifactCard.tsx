import React from "react";

type Artifact = {
  id: string;
  name: string;
  wallet: string;
  price: number;
  tier: string;
  timestamp: string;
};

export default function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const tierColor =
    artifact.tier === "Class A" ? "border-yellow-500" :
    artifact.tier === "Class B" ? "border-sky-500" :
    "border-pink-500";

  return (
    <div className={`border-2 ${tierColor} rounded-lg p-4 mb-4 bg-gradient-to-br from-gray-50 to-white shadow-md relative`}>
      <div className="absolute top-2 right-2 text-sm font-bold text-gray-400">{artifact.tier}</div>
      <h2 className="font-serif text-lg mb-1">{artifact.name}</h2>
      <p className="text-sm">Owner: {artifact.wallet.slice(0,6)}...{artifact.wallet.slice(-4)}</p>
      <p className="text-sm">Price Paid: {artifact.price} ETH</p>
      <p className="text-xs mt-1">Registered: {artifact.timestamp}</p>
      <p className="text-xs text-gray-400">ID: {artifact.id}</p>
    </div>
  );
}