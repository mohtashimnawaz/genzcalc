"use client";
import React from "react";

export default function Home() {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<string | null>(null);

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
  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const numericExpr = convertExpression(input);
      // eslint-disable-next-line no-eval
      const value = Function(`"use strict";return (${numericExpr})`)();
      setResult(value.toLocaleString());
    } catch {
      setResult("Invalid expression");
    }
  }

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center relative p-8 sm:p-20 overflow-hidden">
      <div className="background-3d" />
      {/* Floating 3D shapes */}
      <div className="floating-shape" style={{top: '10%', left: '15%', width: 80, height: 80, background: 'linear-gradient(135deg,#43cea2,#185a9d)'}} />
      <div className="floating-shape" style={{top: '70%', left: '70%', width: 100, height: 100, background: 'linear-gradient(135deg,#ff758c,#ff7eb3)'}} />
      <div className="floating-shape" style={{top: '40%', left: '60%', width: 60, height: 60, background: 'linear-gradient(135deg,#6dd5ed,#2193b0)'}} />
      <main className="flex flex-col gap-10 items-center w-full max-w-md z-10 glass-card shadow-2xl">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2 text-center">gen Z calci</h1>
        <p className="text-lg text-white/80 mb-6 text-center">Calculate using Gen Z terms like <span className="font-bold">2K + 3K</span>, <span className="font-bold">1.5M - 500K</span>, etc.</p>
        <form className="w-full flex flex-col gap-4 items-center" onSubmit={handleCalculate}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter Gen Z expression (e.g. 2K + 3K)"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-md glass-card"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
          >
            Calculate
          </button>
        </form>
        <div className="mt-6 w-full text-center">
          {result !== null && (
            <div className="text-2xl font-bold text-white drop-shadow-lg glass-card inline-block px-6 py-3">{result}</div>
          )}
        </div>
      </main>
    </div>
  );
}
