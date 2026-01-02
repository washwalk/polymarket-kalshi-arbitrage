export const metadata = {
  title: "Secure Message",
  description: "This link contains an encrypted secret that will self-destruct after being read.",
  openGraph: {
    title: "🔒 Secure Encrypted Message",
    description: "Click to reveal and burn this secret.",
    images: [{ url: "/lock-preview.png" }],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}