"use client";

import { ArrowUpRight } from "lucide-react";

type Props = {
    title: string;
    description: string;
    href: string;
    badge?: string;
    isFeeler?: boolean;
    toolSlug?: string;
};

export default function ProjectCard({ title, description, href, badge, isFeeler, toolSlug }: Props) {
    const handleClick = () => {
        if (isFeeler && toolSlug) {
            // Track click for feeler cards
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'click',
                    toolSlug
                })
            }).catch(console.error);
        }
    };
    return (
        <a
        href={href}
        {...(isFeeler ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        onClick={handleClick}
        className="group relative block rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900"
        >
        <div className="flex items-start justify-between">
        <h2 className="text-xl font-medium text-neutral-100 group-hover:text-white">
        {title}
        </h2>
        <div className="flex items-center gap-2">
        {badge && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            {badge}
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
