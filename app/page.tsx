"use client";
import React, { useState } from "react";
import UnlockScreen from "../components/UnlockScreen";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [seed, setSeed] = useState<string | null>(null);

  return seed === null ? (
    <UnlockScreen onUnlock={setSeed} />
  ) : (
    <Dashboard seed={seed} onLock={() => setSeed(null)} />
  );
}
