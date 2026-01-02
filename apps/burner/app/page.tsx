"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Zap, ShieldCheck, Fingerprint, AlertTriangle } from "lucide-react";
import { generateKey, exportKey, encryptText } from "@/features/burner/lib/crypto";
import { coreToolsSEO } from "@/experiments.config";

export default function Home() {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (text.length === 0) setStrength(0);
    else if (text.length < 12) setStrength(30);
    else if (text.length < 50) setStrength(65);
    else setStrength(100);
  }, [text]);

  async function handleCreate() {
    if (!text) return;
    setIsEncrypting(true);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const key = await generateKey();
      const exportedKey = await exportKey(key);
      const encrypted = await encryptText(text, key);
      const res = await fetch("/api/secret", { method: "POST", body: JSON.stringify(encrypted) });
      const { id } = await res.json();
      const url = `${window.location.origin}/s/${id}#${exportedKey}`;
      setLink(url);
      navigator.clipboard.writeText(url);
    } finally {
      setIsEncrypting(false);
    }
  }

  const burnerSEO = coreToolsSEO['burner'];

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 w-full">
      <div className="flex flex-col gap-12">

        {/* PAS: Problem Section */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">Security Risk Alert</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Stop Leaving a Trail When You Share Secrets
          </h1>

          {/* Specific Pain */}
          <div className="p-6 bg-neutral-900/50 border-l-4 border-red-500 rounded-r-xl">
            <p className="text-lg text-neutral-300 leading-relaxed">
              {burnerSEO.painSpecific}
            </p>
          </div>

          <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
            <Fingerprint className="w-4 h-4 text-emerald-500" />
            AES-256 Client-Side Encryption
          </p>
        </div>

        {/* Input Area */}
        <div className="relative group">
          <textarea
            className="w-full min-h-[300px] p-6 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 text-emerald-500 focus:border-emerald-500/50 outline-none transition-all font-mono text-sm resize-none shadow-2xl"
            placeholder="Paste your password, API key, or sensitive message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isEncrypting || !!link}
          />

          <AnimatePresence>
            {isEncrypting && (
              <>
                <motion.div
                  initial={{ top: 0 }} animate={{ top: "100%" }} transition={{ duration: 1, repeat: Infinity }}
                  className="absolute left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                  <div className="text-emerald-500 font-mono animate-pulse tracking-widest text-xs">ENCRYPTING_DATA...</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Action & Strength */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
             <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 px-1">
                <span>Payload Complexity</span>
                <span>{strength}%</span>
             </div>
             <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${strength}%` }} className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
             </div>
          </div>

          {!link ? (
            <button
              onClick={handleCreate}
              disabled={!text || isEncrypting}
              className="py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              Create Burn-After-Reading Link
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
               <span className="text-emerald-500 text-sm font-bold tracking-tight flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Link Copied to Clipboard
               </span>
               <button onClick={() => {setLink(""); setText("");}} className="text-xs text-neutral-500 hover:text-white underline">New Secret</button>
            </motion.div>
          )}
        </div>

        {/* Social Proof / Trust Signals */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-900/30 rounded-lg border border-neutral-800">
            <div className="text-2xl font-bold text-white mb-1">1 Read</div>
            <div className="text-sm text-neutral-400">Then destroyed forever</div>
          </div>
          <div className="p-4 bg-neutral-900/30 rounded-lg border border-neutral-800">
            <div className="text-2xl font-bold text-white mb-1">24 Hours</div>
            <div className="text-sm text-neutral-400">Max lifetime if unread</div>
          </div>
          <div className="p-4 bg-neutral-900/30 rounded-lg border border-neutral-800">
            <div className="text-2xl font-bold text-white mb-1">Zero</div>
            <div className="text-sm text-neutral-400">Server-side storage</div>
          </div>
        </div>
      </div>
    </main>
  );
}