import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Leaf, 
  ShieldCheck, 
  Layers, 
  Coins, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { CurrencyInfo } from '../types';
import { CurrencyService } from '../utils/currency';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenListingModal: () => void;
  onOpenPickupModal: () => void;
  currentCurrency?: CurrencyInfo;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenListingModal,
  onOpenPickupModal,
  currentCurrency,
}) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F8F6F0] to-[#FBFBF9] border-b border-stone-200/60">
      {/* Radiant ambient backdrop spots for glassmorphism */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] glow-spot-emerald -z-10 pointer-events-none rounded-full blur-2xl" />
      <div className="absolute top-20 right-10 w-[550px] h-[550px] glow-spot-cyan -z-10 pointer-events-none rounded-full blur-2xl" />
      <div className="absolute -bottom-20 left-1/3 w-[600px] h-[400px] glow-spot-amber -z-10 pointer-events-none rounded-full blur-3xl opacity-60" />
      
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left" data-aos="fade-up" data-aos-duration="800">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-emerald-800 text-xs font-bold tracking-wide shadow-xs border border-emerald-300/40">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent">
                Next-Gen Circular Economy Infrastructure
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 font-heading leading-[1.12]">
              Turn Discarded Waste into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                Valuable Circular Capital
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Waste2Wealth connects waste sellers, recycling aggregators, and circular manufacturers. 
              Price your scrap dynamically, trade verified recyclable feedstock, schedule local pickups, 
              and cut municipal landfill emissions in real time.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('marketplace')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/35 transition-all duration-200 cursor-pointer"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('calculator')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-stone-800 glass-panel hover:bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-500" />
                <span>Estimate Waste Value</span>
              </button>

              <button
                onClick={onOpenPickupModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-teal-900 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 border border-teal-200/80 transition-all cursor-pointer shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Request Pickup</span>
              </button>
            </div>

            {/* Key trust bullets */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-stone-600 font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Listing Fees</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span>Verified Collection Centers</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Audited Carbon Offsets</span>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive Glass Visual Card */}
          <div className="lg:col-span-5 relative" data-aos="fade-left" data-aos-duration="900" data-aos-delay="150">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl glass-panel p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/80">
              
              <div className="flex items-center justify-between pb-5 border-b border-stone-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-stone-900 font-heading">Live Circular Flow</h2>
                    <p className="text-xs text-stone-500">Real-time secondary feedstock</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-800 border border-emerald-300/60 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Trading
                </span>
              </div>

              {/* Feed items */}
              <div className="py-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-2xs flex items-center justify-between hover:border-cyan-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                      PET
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Sorted Clean PET Flakes</div>
                      <div className="text-[11px] text-stone-500">450 kg • Seattle Hub</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-cyan-700 font-heading">
                      {CurrencyService.formatUSD(216, currentCurrency)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-medium">
                      ~{CurrencyService.formatUSD(0.48, currentCurrency)}/kg
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-2xs flex items-center justify-between hover:border-amber-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                      Cu
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Stripped Copper Wiring</div>
                      <div className="text-[11px] text-stone-500">85 kg • Chicago Depot</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-amber-700 font-heading">
                      {CurrencyService.formatUSD(671.50, currentCurrency)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-medium">
                      ~{CurrencyService.formatUSD(7.90, currentCurrency)}/kg
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-2xs flex items-center justify-between hover:border-purple-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                      PCB
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Telecom Motherboards</div>
                      <div className="text-[11px] text-stone-500">65 kg • SF Tech Hub</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-purple-700 font-heading">
                      {CurrencyService.formatUSD(812.50, currentCurrency)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-medium">
                      ~{CurrencyService.formatUSD(12.50, currentCurrency)}/kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action inside visual */}
              <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-700">Estimated Total Impact</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 rounded-xl border border-emerald-300/60 shadow-2xs">
                  +3,480 kg CO₂e Offset
                </span>
              </div>
            </div>

            {/* Floating floating mini-badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 glass-panel p-3.5 rounded-2xl shadow-xl border border-white/80 items-center gap-3 animate-bounce-slight">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-stone-900 font-heading">100% Traceable Chain</p>
                <p className="text-[10px] text-stone-500 font-medium">Digital circular ledger</p>
              </div>
            </div>
          </div>

        </div>

        {/* Global Impact Summary Ticker with Glass Panels & Radiant Colors */}
        <div className="mt-14 pt-8 border-t border-stone-200/60 grid grid-cols-2 md:grid-cols-4 gap-5 text-center" data-aos="fade-up" data-aos-delay="200">
          <div className="p-4 rounded-3xl glass-panel glass-panel-hover border border-white/80">
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-heading">
              18,450+
            </div>
            <div className="text-xs font-bold text-stone-600 mt-1">
              Kilograms Waste Recycled
            </div>
          </div>

          <div className="p-4 rounded-3xl glass-panel glass-panel-hover border border-white/80">
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 font-heading">
              {CurrencyService.formatUSD(42800, currentCurrency)}+
            </div>
            <div className="text-xs font-bold text-stone-600 mt-1">
              Circular Economic Value
            </div>
          </div>

          <div className="p-4 rounded-3xl glass-panel glass-panel-hover border border-white/80">
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 font-heading">
              34.2 Tons
            </div>
            <div className="text-xs font-bold text-stone-600 mt-1">
              CO₂ Emissions Prevented
            </div>
          </div>

          <div className="p-4 rounded-3xl glass-panel glass-panel-hover border border-white/80">
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-heading">
              98.2%
            </div>
            <div className="text-xs font-bold text-stone-600 mt-1">
              Material Diversion Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
