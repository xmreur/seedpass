import React, { useState, useRef, useEffect } from "react";

interface SeedInputProps {
  wordCount: 12 | 24;
  value: string; // full seed phrase
  onChange: (seed: string) => void;
}

export default function SeedInput({ wordCount, value, onChange }: SeedInputProps) {
  const wordsArray = value.trim().split(/\s+/);
  const [words, setWords] = useState<string[]>(() => {
    const arr = new Array(wordCount).fill("");
    wordsArray.forEach((w, i) => {
      if (i < wordCount) arr[i] = w;
    });
    return arr;
  });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const arr = new Array(wordCount).fill("");
    wordsArray.forEach((w, i) => {
      if (i < wordCount) arr[i] = w;
    });
    setWords(arr);
  }, [value, wordCount]);

  // Handle normal typing
  const handleChange = (index: number, val: string) => {
    const cleanVal = val.toLowerCase().replace(/[^a-z]/g, "");
    const newWords = [...words];
    newWords[index] = cleanVal;
    setWords(newWords);
    onChange(newWords.filter(Boolean).join(" "));
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && words[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ✅ Handle full-seed paste (attached to parent div)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const splitWords = paste
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase().replace(/[^a-z]/g, ""));

    if (splitWords.length === wordCount) {
      // full seed
      setWords(splitWords);
      onChange(splitWords.join(" "));
      inputsRef.current[wordCount - 1]?.focus();
    } else if (splitWords.length < wordCount) {
      // partial seed (still valid)
      const cleanWords = new Array(wordCount).fill("");
      for (let i = 0; i < splitWords.length; i++) {
        cleanWords[i] = splitWords[i];
      }
      setWords(cleanWords);
      onChange(cleanWords.filter(Boolean).join(" "));
      inputsRef.current[Math.min(splitWords.length - 1, wordCount - 1)]?.focus();
    }
  };

  return (
    <div
      className={`grid grid-cols-4 gap-3 max-w-xl mx-auto`}
      onPaste={handlePaste}
    >
      {Array.from({ length: wordCount }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={words[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          placeholder={`${i + 1}`}
          className="bg-gray-800 text-white rounded-md p-3 text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          maxLength={12}
        />
      ))}
    </div>
  );
}
