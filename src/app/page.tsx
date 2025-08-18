"use client";
import React, { useRef, useEffect, useState } from "react";

const EMOJIS = ["🔥", "😎", "💸", "✨", "🤑", "🚀", "🤙", "👑", "🥳", "💯"];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{expr: string, res: string}>>([]);
  const [dark, setDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCalculate(e as any);
      } else if (e.key === "Escape") {
        setInput("");
        setResult(null);
        setError(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Toggle between solid black and neon backgrounds
  useEffect(() => {
    if (dark) {
      document.body.style.background = "#000";
      document.body.style.backgroundImage = "none";
    } else {
      document.body.style.background = "#000";
      document.body.style.backgroundImage =
        "radial-gradient(circle at 20% 30%, #00ffe7 0%, transparent 60%)," +
        "radial-gradient(circle at 80% 70%, #ff00cc 0%, transparent 60%)," +
        "radial-gradient(circle at 50% 80%, #39ff14 0%, transparent 60%)," +
        "linear-gradient(135deg, #000 0%, #0f2027 60%, #222 100%)";
    }
  }, [dark]);

  // Parse Gen Z numbers (e.g. 2K, 1.5M, 3B)
  function parseGenZNumber(str: string): number {
    const match = str.trim().match(/^([\d,.]+)\s*([KMB])?$/i);
    if (!match) return NaN;
    let num = parseFloat(match[1].replace(/,/g, ""));
    const unit = match[2]?.toUpperCase();
    if (unit === "K") num *= 1_000;
    else if (unit === "M") num *= 1_000_000;
    else if (unit === "B") num *= 1_000_000_000;
    return num;
  }

  // Replace Gen Z numbers in expression with their numeric values
  function convertExpression(expr: string): string {
    return expr.replace(/([\d,.]+)\s*([KMB])/gi, (m, n, u) => {
      return parseGenZNumber(n + u).toString();
    });
  }

  // Handle calculation
  function handleCalculate(e: React.FormEvent | KeyboardEvent) {
    if (e.preventDefault) e.preventDefault();
    setError(null);
    try {
      const numericExpr = convertExpression(input);
      // eslint-disable-next-line no-eval
      const value = Function(`"use strict";return (${numericExpr})`)();
      if (isNaN(value)) throw new Error();
      setResult(value.toLocaleString());
      setHistory([{expr: input, res: value.toLocaleString()}, ...history].slice(0, 5));
    } catch {
      setResult(null);
      setError("Bruh, that's not a valid math vibe 😅");
    }
  }

  return (
    <div className={`font-sans min-h-screen flex flex-col items-center justify-center relative p-8 sm:p-20 overflow-hidden ${dark ? 'dark' : ''}`}>
      <div className="background-3d" />
      {/* Floating 3D shapes */}
      <div className="floating-shape" style={{top: '10%', left: '15%', width: 80, height: 80, background: 'linear-gradient(135deg,#43cea2,#185a9d)'}} />
      <div className="floating-shape" style={{top: '70%', left: '70%', width: 100, height: 100, background: 'linear-gradient(135deg,#ff758c,#ff7eb3)'}} />
      <div className="floating-shape" style={{top: '40%', left: '60%', width: 60, height: 60, background: 'linear-gradient(135deg,#6dd5ed,#2193b0)'}} />
      {/* Dark mode toggle */}
      <div className="dark-toggle" onClick={() => setDark(d => !d)} title="Toggle background mode">
        {dark ? "🖤" : "🟩"}
      </div>
      <main className="flex flex-col gap-10 items-center w-full max-w-md z-10 glass-card shadow-2xl">
  <h1 className="text-4xl font-bold mb-2 text-center website-title">gen Z calci</h1>
        <p className="text-lg text-white/80 mb-6 text-center">Calculate using Gen Z terms like <span className="font-bold">2K + 3K</span>, <span className="font-bold">1.5M - 500K</span>, etc.</p>
        <form className="w-full flex flex-col gap-4 items-center" onSubmit={handleCalculate}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter Gen Z expression (e.g. 2K + 3K)"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-md glass-card"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all btn-animated"
          >
            Calculate
          </button>
        </form>
        {error && <div className="error-msg">{error}</div>}
        <div className="mt-6 w-full text-center">
          {result !== null && (
            <div className="text-2xl font-bold text-white drop-shadow-lg glass-card inline-block px-6 py-3">
              {result}
              <span className="emoji">{EMOJIS[Math.floor(Math.random()*EMOJIS.length)]}</span>
            </div>
          )}
        </div>
        {history.length > 0 && (
          <div className="history-panel">
            <div className="font-bold mb-2">History</div>
            <ul>
              {history.map((h, i) => (
                <li key={i}>{h.expr} = <span className="font-mono">{h.res}</span></li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
