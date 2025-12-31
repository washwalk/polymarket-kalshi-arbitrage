import "./globals.css";
import Header from "@/components/header";
import { SolanaProvider } from "@/components/SolanaProvider";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
    title: {
        default: "Polymarket Kalshi Arbitrage",
        template: "%s | Wodah Arbitrage",
    },
    description: "Real-time arbitrage signals between Polymarket and Kalshi prediction markets.",
    openGraph: {
        title: "Polymarket Kalshi Arbitrage Dashboard",
        description: "Real-time arbitrage signals between Polymarket and Kalshi prediction markets.",
        url: "https://wodah.com",
        siteName: "Wodah Arbitrage",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://wodah.com/og-burner.png", // TODO: Update to arbitrage-specific image
                width: 1200,
                height: 630,
                alt: "Polymarket Kalshi Arbitrage Dashboard",
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
