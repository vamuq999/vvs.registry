"use client";

import React, { useState } from "react";
import { ethers } from "ethers";

type Artifact = {
  id: string;
  name: string;
  wallet: string;
  price: number;
  tier: string;
  timestamp: string;
};

type Props = {
  onAdd: (artifact: Artifact) => void;
  signer: any;
  walletAddress: string;
};

export default function RegisterForm({ onAdd, signer, walletAddress }: Props) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("0.01");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tier) return;

    try {
      const tx = await signer.sendTransaction({
        to: walletAddress, // can be your own account or treasury
        value: ethers.utils.parseEther(tier),
      });
      await tx.wait();

      const artifact: Artifact = {
        id: Date.now().toString(),
        name,
        wallet: walletAddress,
        price: parseFloat(tier),
        tier: tier === "0.01" ? "Class A" : tier === "0.05" ? "Class B" : "Class C",
        timestamp: new Date().toLocaleString(),
      };

      onAdd(artifact);
      setName("");
      setTier("0.01");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input
        className="border p-2 rounded"
        placeholder="Artifact name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={tier}
        onChange={(e) => setTier(e.target.value)}
      >
        <option value="0.01">Class A – 0.01 ETH</option>
        <option value="0.05">Class B – 0.05 ETH</option>
        <option value="0.1">Class C – 0.1 ETH</option>
      </select>
      <button className="bg-blue-600 text-white p-2 rounded" type="submit">
        Register Artifact
      </button>
    </form>
  );
}