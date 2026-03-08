"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

// @ts-ignore
declare global {
  interface Window {
    ethers: any;
    WalletConnectProvider: any;
    html2canvas: any;
    jsPDF: any;
  }
}

type Artifact = {
  id: string;
  name: string;
  wallet: string;
  price: number;
  tier: string;
  timestamp: string;
};

export default function Page() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState<any>(null);

  // Load artifacts from localStorage and add dummy if empty
  useEffect(() => {
    const stored = localStorage.getItem("vvsArtifacts");
    if (stored) setArtifacts(JSON.parse(stored));
    else {
      const dummy: Artifact = {
        id: "dummy001",
        name: "First Artifact",
        wallet: "0x1234...ABCD",
        price: 0.01,
        tier: "Class A",
        timestamp: new Date().toLocaleString(),
      };
      setArtifacts([dummy]);
    }
  }, []);

  const connectWallet = async () => {
    try {
      const provider = new window.WalletConnectProvider({
        rpc: { 1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID" },
      });
      await provider.enable();
      const web3Provider = new window.ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const addr = await signer.getAddress();
      setWalletAddress(addr);
      setSigner(signer);
    } catch (err) {
      console.error(err);
      alert("Wallet connect failed");
    }
  };

  const registerArtifact = async (name: string, tierEth: string) => {
    if (!name || !tierEth || !signer) return;
    try {
      const tx = await signer.sendTransaction({
        to: walletAddress, // your treasury wallet
        value: window.ethers.utils.parseEther(tierEth),
      });
      await tx.wait();

      const artifact: Artifact = {
        id: Date.now().toString(),
        name,
        wallet: walletAddress,
        price: parseFloat(tierEth),
        tier:
          tierEth === "0.01"
            ? "Class A"
            : tierEth === "0.05"
            ? "Class B"
            : "Class C",
        timestamp: new Date().toLocaleString(),
      };

      const updated = [artifact, ...artifacts];
      setArtifacts(updated);
      localStorage.setItem("vvsArtifacts", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const exportPNG = async () => {
    const element = document.getElementById("registry");
    if (!element) return;
    const canvas = await window.html2canvas(element);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "VVS_Registry.png";
    link.click();
  };

  const exportPDF = async () => {
    const element = document.getElementById("registry");
    if (!element) return;
    const canvas = await window.html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new window.jsPDF.jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("VVS_Registry.pdf");
  };

  return (
    <>
      {/* CDNs */}
      <Script src="https://cdn.jsdelivr.net/npm/ethers@6.9.0/dist/ethers.umd.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.8/dist/umd/index.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js" />

      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">VVS Registry</h1>

        {/* Wallet Connect */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mb-4 w-full"
          onClick={connectWallet}
        >
          {walletAddress
            ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>

        {/* Register Form */}
        {signer && walletAddress && (
          <div className="mb-6 flex flex-col gap-2">
            <input
              id="artifactName"
              className="border p-2 rounded"
              placeholder="Artifact name"
            />
            <select id="tierSelect" className="border p-2 rounded" defaultValue="0.01">
              <option value="0.01">Class A – 0.01 ETH</option>
              <option value="0.05">Class B – 0.05 ETH</option>
              <option value="0.1">Class C – 0.1 ETH</option>
            </select>
            <button
              className="bg-blue-600 text-white p-2 rounded"
              onClick={() => {
                const nameInput = (document.getElementById(
                  "artifactName"
                ) as HTMLInputElement).value;
                const tierInput = (document.getElementById(
                  "tierSelect"
                ) as HTMLSelectElement).value;
                registerArtifact(nameInput, tierInput);
              }}
            >
              Register Artifact
            </button>
          </div>
        )}

        {/* Export Buttons */}
        {artifacts.length > 0 && (
          <div className="flex gap-2 mb-4">
            <button className="bg-gray-700 text-white p-2 rounded w-1/2" onClick={exportPNG}>
              Export PNG
            </button>
            <button className="bg-gray-700 text-white p-2 rounded w-1/2" onClick={exportPDF}>
              Export PDF
            </button>
          </div>
        )}

        {/* Artifact Registry */}
        <div id="registry">
          {artifacts.map((artifact) => {
            const tierColor =
              artifact.tier === "Class A"
                ? "border-yellow-500"
                : artifact.tier === "Class B"
                ? "border-sky-500"
                : "border-pink-500";

            return (
              <div
                key={artifact.id}
                className={`border-2 ${tierColor} rounded-lg p-4 mb-4 bg-gradient-to-br from-gray-50 to-white shadow-md relative`}
              >
                <div className="absolute top-2 right-2 text-sm font-bold text-gray-400">
                  {artifact.tier}
                </div>
                <h2 className="font-serif text-lg mb-1">{artifact.name}</h2>
                <p className="text-sm">
                  Owner: {artifact.wallet.slice(0, 6)}...{artifact.wallet.slice(-4)}
                </p>
                <p className="text-sm">Price Paid: {artifact.price} ETH</p>
                <p className="text-xs mt-1">Registered: {artifact.timestamp}</p>
                <p className="text-xs text-gray-400">ID: {artifact.id}</p>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}