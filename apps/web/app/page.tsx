'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Whale Watcher
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-3xl mx-auto">
            Track institutional traders and arbitrage opportunities across Polymarket and Kalshi.
            Real-time position monitoring and automated profit alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/arbitrage"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View Arbitrage Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Arbitrage</h3>
            <p className="text-zinc-300">
              Monitor price discrepancies between Polymarket and Kalshi markets with live profit calculations and automated signals.
            </p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">Whale Tracking</h3>
            <p className="text-zinc-300">
              Follow institutional traders' positions, conviction levels, and market influence across prediction markets.
            </p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">Live Data Streaming</h3>
            <p className="text-zinc-300">
              WebSocket-powered real-time updates ensure you never miss profitable opportunities or whale movements.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Monitoring Markets Now
          </h2>
          <p className="text-zinc-300 mb-8">
            Join traders using advanced analytics to capture arbitrage profits and track whale behavior.
          </p>
          <Link
            href="/arbitrage"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Access Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
