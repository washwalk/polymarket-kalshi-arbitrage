import "./globals.css";
import Header from "@/components/header";
import { SolanaProvider } from "@/components/SolanaProvider";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
    title: {
        default: "Whale Watcher | Wodah - Track Large Prediction Market Positions",
        template: "%s | Wodah",
    },
    description: "Monitor top whale positions on Polymarket and Kalshi. Track conviction scores, position sizes, and market movements in real-time.",
    keywords: "whale tracking, prediction markets, large positions, Polymarket, Kalshi",
    openGraph: {
        title: "Whale Watcher - Wodah",
        description: "Track $100k+ positions and whale movements.",
        url: "https://wodah.com/whales",
        siteName: "Wodah",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://wodah.com/og-whales.png",
                width: 1200,
                height: 630,
                alt: "Whale Watcher - Wodah",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${mono.variable}`}>
        <body className="min-h-screen text-neutral-200 antialiased font-sans">
            <SolanaProvider>
                <Header />
                <main>{children}</main>
            </SolanaProvider>
        </body>
        </html>
    );
}
