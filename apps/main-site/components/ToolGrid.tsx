// apps/main-site/components/ToolGrid.tsx
const tools = [
  { name: 'Arb Tracker', path: '/arb', desc: 'Real-time spread detection', icon: '📈', status: 'Live' },
  { name: 'Whale Watcher', path: '/whales', desc: 'Track $100k+ positions', icon: '🐋', status: 'Beta' },
  { name: 'Burner', path: '/burner', desc: 'Secure trade execution', icon: '🔥', status: 'New' },
  { name: 'Clik', path: '/clik', desc: 'Precision timing tools', icon: '⏰', status: 'Live' },
];

export default function ToolGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {tools.map((tool) => (
        <a key={tool.path} href={tool.path} className="group relative bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-blue-500 transition-all">
          <div className="text-3xl mb-4">{tool.icon}</div>
          <h3 className="text-white font-bold text-lg">{tool.name}</h3>
          <p className="text-zinc-400 text-sm mt-1">{tool.desc}</p>
          <span className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            {tool.status}
          </span>
        </a>
      ))}
    </div>
  );
}