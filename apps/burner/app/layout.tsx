import { coreToolsSEO } from '@/experiments.config';

const burnerSEO = coreToolsSEO['burner'];

export const metadata = {
  title: burnerSEO.title,
  description: burnerSEO.description,
  keywords: burnerSEO.keywords?.join(', '),
  openGraph: {
    title: burnerSEO.title,
    description: burnerSEO.painSpecific || burnerSEO.description,
    url: "https://wodah.com/burner",
    siteName: "Wodah",
    images: [
      {
        url: `https://wodah.com/api/og?slug=burner&theme=${burnerSEO.ogImageTheme || 'dark'}`,
        width: 1200,
        height: 630,
        alt: "Burner - Encrypted self-destructing messages",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: burnerSEO.title,
    description: burnerSEO.description,
    images: [`https://wodah.com/api/og?slug=burner&theme=${burnerSEO.ogImageTheme || 'dark'}`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}