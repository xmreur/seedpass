export async function deriveKeyFromSeed(seed: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(seed),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("seedpass-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(key: CryptoKey, plaintext: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.buffer
  );
  return {
    ciphertext: new Uint8Array(ciphertext),
    iv,
  };
}

export async function decrypt(key: CryptoKey, ciphertext: Uint8Array, iv: Uint8Array) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
    key,
    ciphertext.buffer as ArrayBuffer
  );
  return new TextDecoder().decode(decrypted);
}

export async function derivePassword(
  seed: string,
  site: string,
  username: string,
  length = 16
): Promise<string> {
  const charset =
    "abcdefghijklmnopqrstuvwxyz" + // 26 lowercase
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + // 26 uppercase
    "0123456789" + // 10 digits
    "!@#$%^&*-_=+;:.?"; // special chars

  const enc = new TextEncoder();
  let bytesNeeded = length;
  let collectedBytes = new Uint8Array(0);

  let counter = 0;
  while (collectedBytes.length < bytesNeeded) {
    const data = enc.encode(seed + site + username + counter);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashBytes = new Uint8Array(hashBuffer);
    // Concatenate new bytes
    const newBytes = new Uint8Array(collectedBytes.length + hashBytes.length);
    newBytes.set(collectedBytes);
    newBytes.set(hashBytes, collectedBytes.length);
    collectedBytes = newBytes;
    counter++;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[collectedBytes[i] % charset.length];
  }
  return password;
}


import * as bip39 from "bip39";

export function generateSeed(words = 12): string {
  const bits = (words / 3) * 32;
  return bip39.generateMnemonic(bits);
}

export function validateSeed(seed: string): boolean {
  return bip39.validateMnemonic(seed);
}

