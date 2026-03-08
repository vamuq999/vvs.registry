"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

type Props = { onConnect: (address: string, provider: any) => void };

export default function WalletConnectButton({ onConnect }: Props) {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const provider = new WalletConnectProvider({
        rpc: { 1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID" },
      });

      await provider.enable();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      onConnect(addr, signer);
    } catch (err) {
      console.error(err);
      alert("Wallet connect failed");
    }
  };

  return (
    <button
      className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      onClick={connectWallet}
    >
      {address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
    </button>
  );
}