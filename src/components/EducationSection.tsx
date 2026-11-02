import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  Leaf, 
  Recycle, 
  TrendingUp, 
  X,
  Package,
  FileText,
  Shield,
  Cpu,
  Shirt,
  Info
} from 'lucide-react';
import { CATEGORY_EDUCATION_DATA } from '../utils/seedData';
import { CategoryDetail, WasteCategory } from '../types';

export const EducationSection: React.FC = () => {
  const [selectedDetail, setSelectedDetail] = useState<CategoryDetail | null>(null);

  const getCategoryIcon = (category: WasteCategory) => {
    switch (category) {
      case 'Plastic':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
            <Package className="w-6 h-6" />
          </div>
        );
      case 'Paper':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-600/20">
            <FileText className="w-6 h-6" />
          </div>
        );
      case 'Metal':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-slate-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Shield className="w-6 h-6" />
          </div>
        );
      case 'E-waste':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <Cpu className="w-6 h-6" />
          </div>
        );
      case 'Organic':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Leaf className="w-6 h-6" />
          </div>
        );
      case 'Textile':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-600/20">
            <Shirt className="w-6 h-6" />
          </div>
        );
    }
  };

  const getCategoryTheme = (category: WasteCategory) => {
    switch (category) {
      case 'Plastic':
        return {
          tag: 'bg-cyan-100/90 text-cyan-900 border border-cyan-300/80',
        };
      case 'Paper':
        return {
          tag: 'bg-amber-100/90 text-amber-900 border border-amber-300/80',
        };
      case 'Metal':
        return {
          tag: 'bg-indigo-100/90 text-indigo-900 border border-indigo-300/80',
        };
      case 'E-waste':
        return {
          tag: 'bg-purple-100/90 text-purple-900 border border-purple-300/80',
        };
      case 'Organic':
        return {
          tag: 'bg-emerald-100/90 text-emerald-900 border border-emerald-300/80',
        };
      case 'Textile':
        return {
          tag: 'bg-rose-100/90 text-rose-900 border border-rose-300/80',
        };
    }
  };

  return (
    <section id="education" className="py-20 md:py-28 relative overflow-hidden bg-stone-100/50 scroll-mt-20 border-b border-stone-200/80">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full glow-spot-cyan pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full glow-spot-emerald pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full glow-spot-amber pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-300/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Waste-To-Value Transformation Science</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 font-heading tracking-tight">
            The Circular Knowledge Hub
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed font-medium">
            Discover the industrial science of how segregated scrap materials are remanufactured 
            into high-value commercial commodities, replacing virgin finite resource mining.
          </p>
        </div>

        {/* 6 Category Educational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_EDUCATION_DATA.map((cat) => {
            const theme = getCategoryTheme(cat.id);
            return (
              <div
                key={cat.id}
                className="glass-panel glass-panel-hover rounded-3xl border border-white/80 p-6 sm:p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    {getCategoryIcon(cat.id)}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${theme.tag}`}>
                      {cat.marketDemand} Demand
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-emerald-800 italic">
                    "{cat.tagline}"
                  </p>

                  <p className="mt-3 text-xs text-stone-600 leading-relaxed font-medium">
                    {cat.description}
                  </p>

                  {/* High Value End Products List */}
                  <div className="mt-5 pt-4 border-t border-stone-200/70 space-y-2.5">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Upcycled into High-Value Commodities:
                    </div>
                    <ul className="space-y-2 text-xs text-stone-800 font-medium">
                      {cat.valuableProducts.slice(0, 3).map((prod, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                          </div>
                          <span className="leading-tight">{prod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Interactive Learn More Button */}
                <div className="mt-6 pt-4 border-t border-stone-200/70 flex items-center justify-between">
                  <div className="text-[11px] text-stone-600 font-bold">
                    Offset: <strong className="text-emerald-800">{(cat.co2PerTon / 1000).toFixed(1)}t CO₂/ton</strong>
                  </div>
                  <button
                    onClick={() => setSelectedDetail(cat)}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-stone-900 hover:text-emerald-700 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-xl border border-stone-200/90 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Playbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* DETAILED INTERACTIVE CATEGORY MODAL */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  {getCategoryIcon(selectedDetail.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-stone-900 font-heading">
                      {selectedDetail.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-700">
                      {selectedDetail.economicValueRating}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Industrial Circular Lifecycle & Upcycling Playbook
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetail(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-5 text-xs sm:text-sm">
              
              {/* Industrial Transformation Process */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Recycle className="w-4 h-4 text-emerald-600" />
                  Industrial Conversion & Refinement Pipeline
                </h4>
                <p className="text-stone-700 leading-relaxed text-xs">
                  {selectedDetail.conversionProcess}
                </p>
              </div>

              {/* High-Value Derivatives */}
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                  High-Value Remanufactured Outputs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDetail.valuableProducts.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-stone-200 flex items-center gap-2.5 shadow-2xs text-xs text-stone-800 font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Do's & Don'ts Segregation Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Preparation Best Practices */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Preparation Best Practices
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {selectedDetail.preparationTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Contaminants to Avoid */}
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                  <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Contamination Hazards (Avoid)
                  </h5>
                  <ul className="space-y-1.5 text-xs text-rose-950">
                    {selectedDetail.donts.map((dont, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{dont}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Environmental Savings Stats */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    Lifecycle Climate Impact
                  </div>
                  <div className="text-lg font-bold font-heading">
                    Saves ~{selectedDetail.co2PerTon.toLocaleString()} kg CO₂e per metric ton
                  </div>
                  <div className="text-[11px] text-stone-300">
                    Displaces virgin fossil fuel extraction and avoids landfill methane generation.
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shrink-0"
                >
                  Close Guide
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
