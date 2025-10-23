import { encrypt, decrypt, deriveKeyFromSeed } from "./crypto";

const STORAGE_KEY = "seedpass-entries";

export interface Entry {
  site: string;
  username: string;
  ciphertext: string; // base64
  iv: string; // base64
}

export async function saveEntry(seed: string, site: string, username: string, password: string) {
  const key = await deriveKeyFromSeed(seed);
  const { ciphertext, iv } = await encrypt(key, password);

  const entry: Entry = {
    site,
    username,
    ciphertext: btoa(String.fromCharCode(...ciphertext)),
    iv: btoa(String.fromCharCode(...iv)),
  };

  const entries = loadEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getDecryptedPassword(seed: string, site: string): Promise<string | null> {
  const entries = loadEntries();
  const entry = entries.find(e => e.site === site);
  if (!entry) return null;

  const key = await deriveKeyFromSeed(seed);
  const ciphertext = Uint8Array.from(atob(entry.ciphertext), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(entry.iv), c => c.charCodeAt(0));

  try {
    return await decrypt(key, ciphertext, iv);
  } catch {
    return null;
  }
}

