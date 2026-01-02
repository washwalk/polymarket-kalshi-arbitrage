import "./globals.css";
import Header from "@/components/header";
import { SolanaProvider } from "@/components/SolanaProvider";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
    title: {
        default: "Wodah - Prediction Market Tools",
        template: "%s | Wodah",
    },
    description: "Professional arbitrage tracking, whale monitoring, and secure tools for prediction markets. Real-time signals between Polymarket and Kalshi.",
    openGraph: {
        title: "Wodah - Prediction Market Tools",
        description: "Professional arbitrage tracking, whale monitoring, and secure tools for prediction markets.",
        url: "https://wodah.com",
        siteName: "Wodah",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://wodah.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "Wodah - Prediction Market Tools",
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
