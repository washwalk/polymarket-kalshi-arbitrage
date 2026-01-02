"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { importKey, decryptText } from "@/features/burner/lib/crypto";

export default function ReadPage() {
  const params = useParams();
  const id = params.id as string;
    const [secret, setSecret] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [error, setError] = useState("");

    async function revealSecret() {
        try {
            const keyB64 = window.location.hash.slice(1);
            if (!keyB64) throw new Error("Decryption key missing from URL.");

            const res = await fetch(`/api/secret/${params.id}`);
            if (!res.ok) throw new Error("This secret has already been burned or expired.");

            const { iv, data } = await res.json();
            const key = await importKey(keyB64);
            const decrypted = await decryptText(data, iv, key);

            setSecret(decrypted);
            setRevealed(true);
        } catch (e: any) {
            setError(e.message);
        }
    }

    return (
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        {!revealed ? (
            <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">Ready to reveal secret?</h1>
            <p className="text-gray-600 dark:text-neutral-400">Once opened, this link will be destroyed forever.</p>
            {error ? <p className="text-red-400 bg-red-400/10 p-4 rounded-lg">{error}</p> : (
                <button onClick={revealSecret} className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-neutral-200 transition">
                Reveal Secret
                </button>
            )}
            </div>
        ) : (
            <div className="text-left space-y-4 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
            <span className="text-xs text-red-500 font-bold uppercase tracking-widest italic">This secret has been destroyed.</span>
            </div>
            <pre className="p-6 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-xl overflow-x-auto font-mono text-emerald-400">
            {secret}
            </pre>
            </div>
        )}
        </main>
    );
}