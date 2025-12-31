import "./globals.css";
import Header from "@/components/header";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
    title: {
        default: "Wodah Burner",
        template: "%s | Wodah",
    },
    description: "A small lab for simple, focused tools.",
    openGraph: {
        title: "Wodah Burner",
        description: "Send end-to-end encrypted secrets that self-destruct.",
        url: "https://wodah.com",
        siteName: "Wodah",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://wodah.com/og-burner.png",
                width: 1200,
                height: 630,
                alt: "Wodah Burner Security Preview",
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
        <Header />
        <main>{children}</main>
        </body>
        </html>
    );
}
