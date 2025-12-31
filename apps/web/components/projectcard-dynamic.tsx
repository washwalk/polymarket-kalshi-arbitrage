import { ArrowUpRight } from "lucide-react";
import { SocialProofBadges, BadgeData } from "@/lib/badges";

type Props = {
    title: string;
    description: string;
    href: string;
    slug: string;
    badge?: string;
    socialProofBadge?: BadgeData | null;
    isFeeler?: boolean;
};

export default function ProjectCardDynamic({ 
  title, 
  description, 
  href, 
  slug,
  badge, 
  socialProofBadge,
  isFeeler 
}: Props) {
    return (
        <a
        href={href}
        {...(isFeeler ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="group relative block rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900"
        >
        <div className="flex items-start justify-between mb-3">
        <h2 className="text-xl font-medium text-neutral-100 group-hover:text-white">
        {title}
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
        {/* Original badge (e.g., "EARLY ACCESS") */}
        {badge && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            {badge}
            </span>
        )}
        {/* Social proof badge (e.g., "TRENDING", "50+ USERS") */}
        {socialProofBadge && (
            <span className={SocialProofBadges.getBadgeClasses(socialProofBadge)}>
              {socialProofBadge.icon && <span>{socialProofBadge.icon}</span>}
              <span>{socialProofBadge.text}</span>
            </span>
        )}
        <ArrowUpRight className="h-5 w-5 text-neutral-600 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neutral-400" />
        </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
        {description}
        </p>
        </a>
    );
}