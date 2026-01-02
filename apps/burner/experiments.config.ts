export interface ExperimentConfig {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  hook: string;
  pain: string;
  painSpecific?: string; // NEW: Hyper-specific pain statement for PAS copy
  solutions: string[];
  socialProof: string;
  ctaMode: 'email_only' | 'price_anchor_email' | 'pre_payment';
  priceAnchor?: string;
  earlyAdopterOffer?: string;
  prePaymentAmount?: number;
  currency?: string;
  leadMagnet?: string; // NEW: What you give in exchange for email
  status?: 'active' | 'archived'; // Add this
  seoKeywords?: string[]; // Add this
  seo: {
    title: string;
    description: string;
    ogImageTheme?: 'dark' | 'light' | 'emerald';
  };
}

export const experiments: Record<string, ExperimentConfig> = {
  'live-music': {
    slug: 'live-music',
    status: 'active',
    title: 'GigRadar',
    description: 'A unified feed of every live performance in your area.',
    badge: 'NEW',
    hook: 'Stop missing great local gigs.',
    pain: 'Live music info is scattered across Facebook, venue sites, and clunky apps. Finding a show tonight shouldn\'t be a part-time job.',
    solutions: [
      'Every venue in your city in one feed',
      'Filter by genre (Jazz, Rock, Electronic)',
      'Alerts for your favorite local bands'
    ],
    socialProof: 'Join 140+ music lovers in the pilot.',
    ctaMode: 'price_anchor_email',
    priceAnchor: 'Free for fans',
    seoKeywords: ['live music tonight', 'concerts near me', 'local gigs', 'bands playing tonight'],
    seo: {
      title: 'GigRadar | Find Live Music Near You Tonight',
      description: 'The cleanest way to find local gigs and live performances without the noise of social media.',
      ogImageTheme: 'emerald'
    }
  },
  'clik-pro': {
    slug: 'clik-pro',
    status: 'active',
    title: 'Clik Pro',
    description: 'Cloud-sync your metronome setlists and samples.',
    badge: 'EARLY ACCESS',
    hook: 'Tired of losing your metronome settings between devices?',
    pain: 'Practice sessions get interrupted when you can\'t quickly recall your custom BPMs, time signatures, and sample patterns across your phone, tablet, and computer.',
    painSpecific: 'You\'re in the middle of band practice. You grab your tablet instead of your phone. Your custom 7/8 time signature with that specific sample you spent 20 minutes setting up? Gone. You waste 10 minutes recreating it while everyone waits.',
    leadMagnet: 'Free PDF: "The 5-Minute Polyrhythm Practice Routine"',
    solutions: [
      'Sync all your metronome configurations to the cloud',
      'Access your custom samples and setlists anywhere',
      'Seamlessly switch between devices without setup'
    ],
    socialProof: 'Built by the creator of Clik',
    ctaMode: 'pre_payment',
    priceAnchor: '£12/year',
    earlyAdopterOffer: '50% off',
    prePaymentAmount: 5,
    currency: 'gbp',
    seoKeywords: ['metronome pro', 'rhythm trainer', 'polyrhythm tool'],
    seo: {
      title: 'Clik Pro | Cloud-Sync Your Metronome Settings',
      description: 'Stop losing metronome settings across devices with cloud-synced tempo configurations',
      ogImageTheme: 'dark'
    }
  }
};

// Core Tools SEO Config (for Burner, Clik, etc.)
export const coreToolsSEO: Record<string, ExperimentConfig['seo'] & { painSpecific?: string; leadMagnet?: string; keywords?: string[] }> = {
  'burner': {
    title: 'Burner - Self-Destructing Encrypted Secrets',
    description: 'Share sensitive information securely with self-destructing encrypted links that burn after one read',
    ogImageTheme: 'dark',
    painSpecific: 'Sending passwords over Slack leaves a permanent, searchable trail. Anyone with access to your workspace history can find them. Burner destroys the secret after one read—no trace, no risk.',
    leadMagnet: 'Free Security Checklist: "How to Share Secrets Without Leaving a Trail"',
    keywords: [
      'self destructing message',
      'encrypted secret sharing',
      'one time secret link',
      'secure password sharing tool',
      'zero knowledge encryption',
      'burn after reading'
    ]
  },
  'clik': {
    title: 'Clik - Free Online Metronome',
    description: 'Free, minimal metronome for musicians practicing timing and rhythm with keyboard controls',
    ogImageTheme: 'emerald',
    painSpecific: 'Most metronome apps are cluttered with features you never use. Clik gives you one thing: a reliable click. Keyboard shortcuts, tap tempo, and nothing else.',
    leadMagnet: undefined,
    keywords: [
      'online metronome free',
      'web metronome app',
      'practice metronome musicians',
      'BPM counter online',
      'rhythm trainer free',
      'keyboard metronome'
    ]
  }
};

export default experiments;