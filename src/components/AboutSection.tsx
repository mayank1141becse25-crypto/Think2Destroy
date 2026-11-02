import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Globe2, 
  Target, 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  XCircle,
  Lightbulb
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden bg-stone-50/70 scroll-mt-20">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full glow-spot-emerald pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full glow-spot-cyan pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-300/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mission & Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 font-heading tracking-tight">
            About Waste2Wealth
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed font-medium">
            We are building the digital infrastructure for the circular economy. 
            By converting post-consumer scrap and industrial discards from an environmental liability 
            into audited, high-purity secondary feedstock, we eliminate what society once termed "waste".
          </p>
        </div>

        {/* 4-Step Process Transformation Pipeline */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/80">
              The 4-Step Closed-Loop Pipeline
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-heading mt-3">
              How Material Flow Unlocks Value
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/80 shadow-md relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center font-heading text-lg mb-4 shadow-md shadow-emerald-700/20">
                01
              </div>
              <h4 className="font-black text-stone-900 text-lg font-heading">
                Source Segregation
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-medium">
                Households, campuses, and factories separate clean polymers, fibers, metals, and organics, 
                preventing contamination at source.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/80 shadow-md relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-black flex items-center justify-center font-heading text-lg mb-4 shadow-md shadow-cyan-600/20">
                02
              </div>
              <h4 className="font-black text-stone-900 text-lg font-heading">
                Dynamic Valuation
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-medium">
                Our algorithmic rate engine appraises material scrap against live secondary 
                commodity benchmark prices and carbon savings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/80 shadow-md relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black flex items-center justify-center font-heading text-lg mb-4 shadow-md shadow-amber-600/20">
                03
              </div>
              <h4 className="font-black text-stone-900 text-lg font-heading">
                Logistics & Escrow
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-medium">
                Connect directly with certified industrial aggregators or dispatch scheduled doorstep collection 
                with our traceable network.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/80 shadow-md relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black flex items-center justify-center font-heading text-lg mb-4 shadow-md shadow-purple-600/20">
                04
              </div>
              <h4 className="font-black text-stone-900 text-lg font-heading">
                Circular Remanufacture
              </h4>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-medium">
                Audited secondary raw materials replace virgin petrochemicals, mined ores, and felled timber 
                in commercial production.
              </p>
            </div>
          </div>
        </div>

        {/* Linear vs Circular Economy Comparison Table */}
        <div className="glass-panel rounded-3xl border border-white/80 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
              Linear Economy vs. Circular Economy
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 font-medium">
              Why our economic paradigm shift is critical for planetary boundaries and industrial supply security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Linear Model */}
            <div className="p-6 sm:p-7 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4">
              <div className="flex items-center gap-2.5 text-rose-950 font-black text-sm sm:text-base font-heading">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>The Traditional Linear Model (Take – Make – Dump)</span>
              </div>
              <ul className="space-y-3 text-xs text-stone-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none">✕</span>
                  <span>Extracts virgin finite resources (crude oil, raw ores, pristine old-growth forests).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none">✕</span>
                  <span>Single-use packaging and unrepairable electronics destined for overflowing landfills.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none">✕</span>
                  <span>Massive methane emissions from organic rot and non-biodegradable microplastic runoff.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-sm leading-none">✕</span>
                  <span>Waste represents a total write-off of embedded energy and financial capital.</span>
                </li>
              </ul>
            </div>

            {/* Circular Model */}
            <div className="p-6 sm:p-7 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-950 font-black text-sm sm:text-base font-heading">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>The Waste2Wealth Model (Audit – Value – Regenerate)</span>
              </div>
              <ul className="space-y-3 text-xs text-emerald-950 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-sm leading-none">✓</span>
                  <span>Retains technical polymers and biological nutrients circulating at highest industrial utility.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-sm leading-none">✓</span>
                  <span>Reduces manufacturing power demand by up to 95% (e.g. secondary aluminum remelt).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-sm leading-none">✓</span>
                  <span>Monetizes household, institutional, and commercial discards with transparent earnings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold text-sm leading-none">✓</span>
                  <span>Directly drives United Nations Sustainable Development Goals (SDG 12 & SDG 13).</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
