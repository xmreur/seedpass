import React, { useState } from "react";
import SeedInput from "./SeedInput";
import { generateSeed, validateSeed } from "../lib/crypto";
import { Copy } from "lucide-react";

interface Props {
  onUnlock: (seed: string) => void;
}

export default function UnlockScreen({ onUnlock }: Props) {
  const [seed, setSeed] = useState("");
  const [wordCount, setWordCount] = useState<24 | 12>(24);

  const handleGenerate = () => {
    const newSeed = generateSeed(wordCount);
    setSeed(newSeed);
  };

  const handleUnlock = () => {
    if (!seed.trim()) {
      alert("Please enter your seed phrase");
      return;
    }
    if (!validateSeed(seed.trim())) {
      alert("Invalid seed phrase");
      return;
    }
    onUnlock(seed.trim());
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seed);
      alert("Seed phrase copied to clipboard!");
    } catch {
      alert("Failed to copy seed phrase");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4">
      <div className="bg-gray-900 relative bg-opacity-90 rounded-2xl shadow-xl p-8 max-w-2xl w-full text-white font-sans">
        <h1 className="text-3xl font-semibold mb-6 text-center tracking-wide">
          SeedPass
        </h1>

        {/* Word count toggle */}
        <div className="flex justify-center mb-4 space-x-4">
          {[24, 12].map((count) => (
            <button
              key={count}
              onClick={() => setWordCount(count as 24 | 12)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                wordCount === count
                  ? "bg-indigo-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {count} words
            </button>
          ))}
        </div>

        <SeedInput wordCount={wordCount} value={seed} onChange={setSeed} />

        <div className="flex justify-between space-x-4 mt-6">
          <button
            onClick={handleUnlock}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 transition rounded-lg py-3 font-semibold tracking-wide shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            Unlock Wallet
          </button>
          <button
            onClick={handleGenerate}
            className="flex-1 bg-gray-700 hover:bg-gray-600 transition rounded-lg py-3 font-semibold tracking-wide shadow-md focus:outline-none focus:ring-4 focus:ring-gray-600"
          >
            Generate New Seed
          </button>
          <button
            onClick={copyToClipboard}
            style={{ top: 15, right: 15 }}
            className="rounded-lg absolute font-semibold tracking-wide shadow-md focus:outline-none focus:ring-4"
            disabled={!seed.trim()}
          >
            <Copy className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
