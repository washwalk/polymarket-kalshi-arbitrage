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

export const experiments: Record<string, ExperimentConfig> = {};

// Core Tools SEO Config
export const coreToolsSEO: Record<string, ExperimentConfig['seo'] & { painSpecific?: string; leadMagnet?: string; keywords?: string[] }> = {};

export default experiments;