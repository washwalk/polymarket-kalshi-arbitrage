import { Shield, Zap, BarChart3, Lock, Users, Award } from "lucide-react";
import ToolGrid from "@/components/ToolGrid";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">Trusted by Traders</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Predict. <span className="text-emerald-500">Arbitrage.</span> Win.
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Professional tools for prediction market arbitrage and whale tracking.
            Real-time signals, secure encryption, and data-driven insights.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Tools</h2>
            <p className="text-gray-400 text-lg">Cutting-edge tools for prediction market traders</p>
          </div>
          <ToolGrid />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Serious Traders</h2>
            <p className="text-gray-400 text-lg">Enterprise-grade tools with consumer simplicity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Arbitrage</h3>
              <p className="text-gray-400">Instant signals between Polymarket and Kalshi with live position tracking</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">Whale Intelligence</h3>
              <p className="text-gray-400">Track top positions and conviction scores from market makers</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold">Secure & Private</h3>
              <p className="text-gray-400">Client-side encryption and zero server-side data storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by the Community</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
              <div className="text-3xl font-bold text-emerald-500 mb-2">10K+</div>
              <div className="text-gray-400">Signals Processed</div>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
              <div className="text-3xl font-bold text-blue-500 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
              <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
              <div className="text-gray-400">Data Breaches</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              End-to-End Encrypted
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Open Source
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">WODAH</div>
          <p className="text-gray-400 mb-6">Empowering prediction market traders with cutting-edge tools</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/arb" className="text-gray-400 hover:text-white transition-colors">Arbitrage</a>
            <a href="/whales" className="text-gray-400 hover:text-white transition-colors">Whales</a>
            <a href="/burner" className="text-gray-400 hover:text-white transition-colors">Burner</a>
            <a href="/clik" className="text-gray-400 hover:text-white transition-colors">Clik</a>
          </div>
          <div className="text-xs text-gray-500 mt-8">
            © 2026 Wodah. Built with ❤️ for the crypto community.
          </div>
        </div>
      </footer>
    </div>
  );
}