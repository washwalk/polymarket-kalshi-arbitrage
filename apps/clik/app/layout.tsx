export const metadata = {
  title: "Clik - Free Online Metronome",
  description: "A minimalist, keyboard-driven metronome for musicians. Adjustable BPM, tap tempo, and precision timing for practice and rhythm training.",
  keywords: ["metronome", "music", "tempo", "rhythm", "practice", "musicians", "BPM"],
  openGraph: {
    title: "Clik - Free Online Metronome",
    description: "Minimalist metronome with adjustable BPM. Perfect for musicians practicing timing and groove. Keyboard controls included.",
    url: "https://wodah.com/clik",
    siteName: "Wodah",
    images: [
      {
        url: "https://wodah.com/clik-og.png",
        width: 1200,
        height: 630,
        alt: "Clik Metronome - Wodah Lab Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clik - Free Online Metronome",
    description: "Minimalist metronome for musicians. Adjustable BPM, tap tempo, keyboard controls.",
    images: ["https://wodah.com/clik-og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}