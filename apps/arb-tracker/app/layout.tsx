import "./globals.css";
import Header from "@/components/header";
import { SolanaProvider } from "@/components/SolanaProvider";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
    title: {
        default: "Arbitrage Tracker | Wodah - Real-Time Spread Detection",
        template: "%s | Wodah",
    },
    description: "Track live arbitrage opportunities between Polymarket and Kalshi. Get alerts on price spreads, ROI calculations, and whale movements.",
    keywords: "prediction markets, arbitrage, Polymarket, Kalshi, trading signals",
    openGraph: {
        title: "Arbitrage Tracker - Wodah",
        description: "Real-time spread detection for prediction market arbitrage.",
        url: "https://wodah.com/arb",
        siteName: "Wodah",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://wodah.com/og-arb.png",
                width: 1200,
                height: 630,
                alt: "Arbitrage Tracker - Wodah",
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
