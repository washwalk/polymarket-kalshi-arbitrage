"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton to avoid SSR hydration issues
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

export default function Header() {
    const pathname = usePathname();

    // Automatically determines the label based on the current URL
    const getPageLabel = () => {
        if (pathname.startsWith("/arbitrage")) return "Arbitrage";
        return "Dashboard"; // Fallback for homepage
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-neutral-900 bg-white/50 dark:bg-black/50 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* WODAH Logo (The Home Link) */}
                <div className="flex items-center gap-3 group">
                    <Link href="/" className="font-bold tracking-tighter text-2xl text-black dark:text-white group-hover:text-emerald-500 transition-colors">
                        WODAH
                    </Link>

                    <div className="h-4 w-[1px] bg-gray-300 dark:bg-neutral-800" />

                    {/* Dynamic Label */}
                    <span className="text-xs font-mono text-gray-500 dark:text-neutral-500 uppercase tracking-widest mt-1">
                        {getPageLabel()}
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex gap-6 text-sm font-medium items-center">
                    {/* This button handles the Solflare connection automatically */}
                    <WalletMultiButton />
                </nav>
            </div>
        </header>
    );
}
