import "./globals.css";

export const metadata = {
    title: "Diffraction",
    description: "Diffraction app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="min-h-screen text-neutral-200 antialiased">
            <main>{children}</main>
        </body>
        </html>
    );
}