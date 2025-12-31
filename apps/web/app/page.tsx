import ProjectCardDynamic from "@/components/projectcard-dynamic";
import experiments from "@/experiments.config";
import { ToolAnalytics } from "@/lib/tool-analytics";
import { SocialProofBadges, BadgeData } from "@/lib/badges";
import AnalyticsTracker from "@/components/analytics-tracker";

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Refresh every 5 minutes

interface ToolWithMetrics {
  slug: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  socialProofBadge?: BadgeData | null;
  isFeeler?: boolean;
  tier: 'STAR' | 'ACTIVE' | 'TESTING' | 'ARCHIVE';
  conversions: number;
  conversionRate: number;
}

async function getToolsWithMetrics(): Promise<ToolWithMetrics[]> {
  // Core tools (always shown, but sorted by performance)
  const coreTools = [
    {
      slug: 'diffraction',
      title: 'Diffraction Visualiser',
      description: 'An interactive visual tool for exploring diffraction patterns.',
      href: '/diffraction'
    },
    {
      slug: 'clik',
      title: 'Clik',
      description: 'A free, minimal metronome app.',
      href: '/clik'
    },
    {
      slug: 'burner',
      title: 'Burner',
      description: 'Zero-knowledge encrypted secrets that self-destruct.',
      href: '/burner'
    }
  ];

  // Lab experiments from config
  const labTools = Object.values(experiments).map(exp => ({
    slug: exp.slug,
    title: exp.title,
    description: exp.description,
    href: `/lab/${exp.slug}`,
    badge: exp.badge,
    isFeeler: true
  }));

  const allTools = [...coreTools, ...labTools];
  const toolSlugs = allTools.map(t => t.slug);

  // Fetch metrics for all tools
  const metricsArray = await ToolAnalytics.getAllToolMetrics(toolSlugs);
  const metricsMap = new Map(metricsArray.map(m => [m.slug, m]));

  // Determine tier for each tool
  const toolsWithTiers = await Promise.all(
    allTools.map(async (tool) => {
      const metrics = metricsMap.get(tool.slug);
      const tier = await ToolAnalytics.getPerformanceTier(tool.slug);
      const socialProofBadge = await SocialProofBadges.getBadge(tool.slug);

      return {
        ...tool,
        tier,
        conversions: metrics?.conversions || 0,
        conversionRate: metrics?.conversionRate || 0,
        socialProofBadge
      };
    })
  );

  // Separate by tier
  const stars = toolsWithTiers.filter(t => t.tier === 'STAR');
  const active = toolsWithTiers.filter(t => t.tier === 'ACTIVE');
  const testing = toolsWithTiers.filter(t => t.tier === 'TESTING');
  // Archives don't show on homepage

  // Sort within each tier by conversions
  const sortByConversions = (a: ToolWithMetrics, b: ToolWithMetrics) =>
    b.conversions - a.conversions;

  return [
    ...stars.sort(sortByConversions),
    ...active.sort(sortByConversions),
    ...testing.sort(sortByConversions)
  ];
}

export default async function HomePage() {
  const tools = await getToolsWithMetrics();

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <AnalyticsTracker />
      <div className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">
          Wodah
        </h1>
        <p className="mt-3 max-w-xl text-neutral-400">
          A small lab for simple, focused tools.
        </p>
      </div>

      {/* Star Tools - Large Featured Cards */}
      {tools.some(t => t.tier === 'STAR') && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-500">
              Most Popular
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {tools
              .filter(t => t.tier === 'STAR')
              .map(tool => (
                <ProjectCardDynamic
                  key={tool.slug}
                  title={tool.title}
                  description={tool.description}
                  href={tool.href}
                  slug={tool.slug}
                  badge={tool.badge}
                  socialProofBadge={tool.socialProofBadge}
                  isFeeler={tool.isFeeler}
                />
              ))}
          </div>
        </div>
      )}

      {/* Active + Testing Tools - Standard Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {tools
          .filter(t => t.tier !== 'STAR')
          .map(tool => (
                <ProjectCardDynamic
                  key={tool.slug}
                  title={tool.title}
                  description={tool.description}
                  href={tool.href}
                  slug={tool.slug}
                  badge={tool.badge}
                  socialProofBadge={tool.socialProofBadge}
                  isFeeler={tool.isFeeler}
                />
          ))}
      </div>

      {/* Optional: Link to archived tools */}
      <div className="mt-12 text-center">
        <a
          href="/lab/archive"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition"
        >
          View experimental tools →
        </a>
      </div>
    </section>
  );
}
