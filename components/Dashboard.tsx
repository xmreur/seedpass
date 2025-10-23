// components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { derivePassword } from "../lib/crypto";
import { saveEntry, loadEntries, getDecryptedPassword, Entry } from "../lib/storage";

interface Props {
  seed: string;
  onLock: () => void;
}

export default function Dashboard({ seed, onLock }: Props) {
  const [site, setSite] = useState("");
  const [length, setLength] = useState(16);
  const [derived, setDerived] = useState("");
  const [username, setUsername] = useState("");

  const handleDerive = async () => {
    if (!site) return;
    const pwd = await derivePassword(seed, site, username, length);
    setDerived(pwd);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-black text-white font-sans p-8">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-wide">SeedPass</h2>
        <button
          onClick={onLock}
          className="bg-gray-800 hover:bg-gray-700 transition rounded-lg px-4 py-2 font-semibold"
        >
          Lock
        </button>
      </header>

      <section className="mb-8 p-6 min-h-[75vh] bg-gray-900 bg-opacity-90 rounded-2xl shadow-xl max-w-3xl mx-auto flex flex-col justify-center">
        <h3 className="text-5xl font-semibold mb-4 w-full text-center">Derive Password</h3>
        <input
          type="text"
          placeholder="example.com / Application Name"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="w-full mb-4 rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg"
        />
        <input 
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg"
        />
        <input
          type="number"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full mb-4 rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-lg"
        />
        <button
          onClick={handleDerive}
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition rounded-lg py-3 font-semibold"
        >
          Derive
        </button>
        {derived && (
          <pre className="mt-4 p-4 bg-gray-800 rounded-lg font-mono text-xl break-all">
            {derived}
          </pre>
        )}
      </section>

      
    </div>
  );
}
