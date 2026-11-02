import React, { useState, useMemo } from 'react';
import {
  Flame,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
  Leaf,
  Plus,
  Zap,
  Hammer,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  X,
  FileCheck,
  Printer,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { WasteCategory, UpcycleBlueprint, CurrencyInfo } from '../types';
import { StorageService } from '../utils/storage';
import { CurrencyService } from '../utils/currency';

interface UpcycleLabSectionProps {
  currentCurrency?: CurrencyInfo;
}

export const UpcycleLabSection: React.FC<UpcycleLabSectionProps> = ({ currentCurrency }) => {
  const [blueprints, setBlueprints] = useState<UpcycleBlueprint[]>(() =>
    StorageService.getBlueprints()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeBlueprintModal, setActiveBlueprintModal] = useState<UpcycleBlueprint | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Upcycling ROI Interactive Simulator State
  const [simFeedstockKg, setSimFeedstockKg] = useState<number>(50);
  const [simSelectedBlueprintId, setSimSelectedBlueprintId] = useState<string>(
    blueprints[0]?.id || 'bp-1'
  );

  const selectedSimBlueprint = useMemo(() => {
    return blueprints.find((b) => b.id === simSelectedBlueprintId) || blueprints[0];
  }, [blueprints, simSelectedBlueprintId]);

  // Dynamic simulation values
  const simMetrics = useMemo(() => {
    if (!selectedSimBlueprint) {
      return {
        rawValueUSD: 0,
        upcycledValueUSD: 0,
        netMarginUSD: 0,
        co2AvoidedKg: 0,
        multiplier: 1,
      };
    }
    const rawValueUSD = simFeedstockKg * selectedSimBlueprint.rawCostPerKgUSD;
    const upcycledValueUSD = simFeedstockKg * selectedSimBlueprint.finishedValuePerKgUSD;
    const netMarginUSD = upcycledValueUSD - rawValueUSD;
    const co2AvoidedKg = Math.round(
      simFeedstockKg * 2.2 * (selectedSimBlueprint.co2ReductionPercent / 100)
    );

    return {
      rawValueUSD,
      upcycledValueUSD,
      netMarginUSD,
      co2AvoidedKg,
      multiplier: selectedSimBlueprint.valueMultiplier,
    };
  }, [selectedSimBlueprint, simFeedstockKg]);

  // Filtered blueprints
  const filteredBlueprints = useMemo(() => {
    return blueprints.filter((b) => {
      const matchCat =
        selectedCategory === 'All' || b.wasteCategory === selectedCategory;
      const matchDiff =
        selectedDifficulty === 'All' || b.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [blueprints, selectedCategory, selectedDifficulty]);

  // Form state for community blueprint submission
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitCategory, setSubmitCategory] = useState<WasteCategory>('Plastic');
  const [submitFeedstock, setSubmitFeedstock] = useState('');
  const [submitEndProduct, setSubmitEndProduct] = useState('');
  const [submitRawPrice, setSubmitRawPrice] = useState('0.50');
  const [submitFinishedPrice, setSubmitFinishedPrice] = useState('15.00');
  const [submitDifficulty, setSubmitDifficulty] = useState<'Beginner' | 'Intermediate' | 'Industrial Scale'>('Beginner');
  const [submitTools, setSubmitTools] = useState('Shredder, Heat Press, Gloves');
  const [submitDesc, setSubmitDesc] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState(false);

  const handleCreateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    const rawVal = parseFloat(submitRawPrice) || 0.5;
    const finVal = parseFloat(submitFinishedPrice) || 15.0;
    const mult = Number((finVal / (rawVal || 1)).toFixed(1));

    const newBp: UpcycleBlueprint = {
      id: `bp-custom-${Date.now()}`,
      title: submitTitle,
      wasteCategory: submitCategory,
      sourceFeedstock: submitFeedstock,
      endProduct: submitEndProduct,
      valueMultiplier: mult,
      rawCostPerKgUSD: rawVal,
      finishedValuePerKgUSD: finVal,
      difficulty: submitDifficulty,
      equipmentNeeded: submitTools.split(',').map((t) => t.trim()),
      steps: [
        { stage: 'Stage 1', title: 'Feedstock Collection & Inspection', desc: 'Pre-sort input batches to eliminate contamination.' },
        { stage: 'Stage 2', title: 'Preparation & Processing', desc: submitDesc || 'Prepare materials according to standard specifications.' },
        { stage: 'Stage 3', title: 'Thermal / Mechanical Shaping', desc: 'Transform materials into standard marketable units.' },
        { stage: 'Stage 4', title: 'Quality Assurance & Distribution', desc: 'Final packaging and commercial delivery to end users.' }
      ],
      co2ReductionPercent: 75,
      marketDemand: 'High',
      description: submitDesc,
      badge: 'Community Blueprint',
      colorGrad: 'from-emerald-600 to-teal-600',
      isCommunitySubmitted: true,
    };

    const updated = StorageService.addBlueprint(newBp);
    setBlueprints(updated);
    setSubmitSuccessMsg(true);
    setTimeout(() => {
      setSubmitSuccessMsg(false);
      setIsSubmitModalOpen(false);
      // Reset form
      setSubmitTitle('');
      setSubmitFeedstock('');
      setSubmitEndProduct('');
      setSubmitDesc('');
    }, 1500);
  };

  return (
    <section id="upcycle-lab" className="py-20 md:py-28 relative overflow-hidden bg-stone-50/60 dark:bg-stone-900/40 scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full glow-spot-emerald pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full glow-spot-amber pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200/80 dark:border-stone-800" data-aos="fade-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-amber-300/60 dark:border-amber-600/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Waste-to-Value Transformation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-white font-heading tracking-tight">
              Circular Upcycling Lab & Blueprints
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-2xl font-medium">
              Don't just dispose or bale your scrap — engineer it into high-margin circular commercial products. 
              Explore tested transformation blueprints with up to 230x value addition multipliers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Upcycle Blueprint</span>
            </button>
          </div>
        </div>

        {/* FEATURE HIGHLIGHT: Interactive Upcycling ROI & Margin Simulator */}
        <div className="mt-10 rounded-3xl glass-panel p-6 sm:p-8 border border-white/80 dark:border-stone-700/80 shadow-xl bg-gradient-to-br from-white/90 via-stone-50/70 to-emerald-50/40 dark:from-stone-900/90 dark:via-stone-900/70 dark:to-emerald-950/30" data-aos="fade-up" data-aos-delay="100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/80 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                <Sliders className="w-4 h-4" />
                <span>Interactive Value Multiplier Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-heading mt-1">
                Calculate Transformation Profit & Carbon Offset
              </h3>
            </div>

            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Live Pricing In {currentCurrency?.code || 'USD'}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Select Upcycling Blueprint Target:
                </label>
                <select
                  value={simSelectedBlueprintId}
                  onChange={(e) => setSimSelectedBlueprintId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-xs shadow-2xs focus:outline-none focus:border-emerald-500"
                >
                  {blueprints.map((bp) => (
                    <option key={bp.id} value={bp.id}>
                      {bp.title} ({bp.valueMultiplier}x Value Multiplier • {bp.wasteCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  <span>Feedstock Batch Quantity:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black text-sm">
                    {simFeedstockKg} Kilograms
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={simFeedstockKg}
                  onChange={(e) => setSimFeedstockKg(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 dark:bg-stone-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-semibold">
                  <span>5 kg (Micro-workshop)</span>
                  <span>100 kg (Commercial)</span>
                  <span>500 kg (Industrial Batch)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 text-xs space-y-1">
                <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Input: {selectedSimBlueprint?.sourceFeedstock}</span>
                </div>
                <div className="text-stone-500 dark:text-stone-400 text-[11px]">
                  Output product: <span className="font-bold text-stone-700 dark:text-stone-300">{selectedSimBlueprint?.endProduct}</span>
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl glass-panel bg-gradient-to-br from-emerald-600 via-teal-700 to-stone-900 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                    Transformation Economic Yield
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                    {simMetrics.multiplier}x Multiplier
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                    <div className="text-[11px] text-emerald-200 font-medium">Raw Scrap Lot Value</div>
                    <div className="text-xl sm:text-2xl font-black font-heading mt-0.5">
                      {CurrencyService.formatUSD(simMetrics.rawValueUSD, currentCurrency)}
                    </div>
                    <div className="text-[10px] text-emerald-300/80 font-mono mt-0.5">
                      ~{CurrencyService.formatUSD(selectedSimBlueprint.rawCostPerKgUSD, currentCurrency)}/kg
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/30">
                    <div className="text-[11px] text-emerald-200 font-medium">Upcycled Market Value</div>
                    <div className="text-xl sm:text-2xl font-black font-heading mt-0.5 text-emerald-300">
                      {CurrencyService.formatUSD(simMetrics.upcycledValueUSD, currentCurrency)}
                    </div>
                    <div className="text-[10px] text-emerald-300/80 font-mono mt-0.5">
                      ~{CurrencyService.formatUSD(selectedSimBlueprint.finishedValuePerKgUSD, currentCurrency)}/kg
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/25 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-emerald-200 font-semibold">Net Circular Value-Added:</div>
                    <div className="text-2xl font-black text-amber-300 font-heading">
                      +{CurrencyService.formatUSD(simMetrics.netMarginUSD, currentCurrency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-emerald-200 font-semibold">CO₂e Sequestered:</div>
                    <div className="text-sm font-black text-white font-heading">
                      ~{simMetrics.co2AvoidedKg.toLocaleString()} kg
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveBlueprintModal(selectedSimBlueprint)}
                  className="w-full py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Inspect Full Step-by-Step Blueprint & Equipment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint Catalog Filters */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mr-1">
              Category:
            </span>
            {['All', 'Plastic', 'Textile', 'Organic', 'E-waste', 'Paper', 'Metal'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Difficulty:
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Industrial Scale">Industrial Scale</option>
            </select>
          </div>
        </div>

        {/* Blueprints Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlueprints.map((bp, idx) => (
            <div
              key={bp.id}
              className="glass-panel rounded-3xl p-6 border border-white/80 dark:border-stone-700 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group bg-white/70 dark:bg-stone-800/70"
              data-aos="fade-up"
              data-aos-delay={idx * 80}
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-700">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200">
                    {bp.wasteCategory}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60">
                    {bp.valueMultiplier}x Value Add
                  </span>
                </div>

                <h4 className="text-lg font-black text-stone-900 dark:text-white font-heading mt-4 group-hover:text-emerald-600 transition-colors">
                  {bp.title}
                </h4>

                <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 font-medium line-clamp-2">
                  {bp.description}
                </p>

                {/* Economic Comparison Chips */}
                <div className="mt-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-700 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Scrap In</div>
                    <div className="text-xs font-black text-stone-800 dark:text-stone-200 font-heading">
                      {CurrencyService.formatUSD(bp.rawCostPerKgUSD, currentCurrency)}/kg
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">End Product</div>
                    <div className="text-xs font-black text-emerald-700 dark:text-emerald-300 font-heading">
                      {CurrencyService.formatUSD(bp.finishedValuePerKgUSD, currentCurrency)}/kg
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <Hammer className="w-3.5 h-3.5 text-stone-400" />
                    {bp.difficulty}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                    <Leaf className="w-3.5 h-3.5" />
                    {bp.co2ReductionPercent}% CO₂ cut
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-700">
                <button
                  onClick={() => setActiveBlueprintModal(bp)}
                  className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore 4-Stage Recipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BLUEPRINT DETAIL MODAL */}
        {activeBlueprintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    {activeBlueprintModal.wasteCategory} • {activeBlueprintModal.valueMultiplier}x Value Multiplier
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-heading mt-1">
                    {activeBlueprintModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveBlueprintModal(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Transformation Overview
                  </h4>
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400">Raw Input:</span>
                      <p className="font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                        {activeBlueprintModal.sourceFeedstock}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-400">Finished Product:</span>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {activeBlueprintModal.endProduct}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                    Step-by-Step Production Protocol
                  </h4>
                  <div className="space-y-3">
                    {activeBlueprintModal.steps.map((st, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 flex items-start gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-xs font-black text-stone-900 dark:text-white font-heading">
                            {st.title}
                          </div>
                          <div className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 font-medium leading-relaxed">
                            {st.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Required */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Required Tools & Processing Equipment
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeBlueprintModal.equipmentNeeded.map((eq, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700 flex items-center gap-1.5"
                      >
                        <Hammer className="w-3 h-3 text-emerald-600" />
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Blueprint Recipe</span>
                </button>
                <button
                  onClick={() => setActiveBlueprintModal(null)}
                  className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT COMMUNITY BLUEPRINT MODAL */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <h3 className="text-lg font-black text-stone-900 dark:text-white font-heading">
                  Submit Upcycling Blueprint
                </h3>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitSuccessMsg ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-white">
                    Blueprint Published to Lab!
                  </h4>
                  <p className="text-xs text-stone-500">
                    Your circular transformation blueprint is now stored and active in the catalog.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateBlueprint} className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Blueprint Title:
                    </label>
                    <input
                      required
                      type="text"
                      value={submitTitle}
                      onChange={(e) => setSubmitTitle(e.target.value)}
                      placeholder="e.g., Shredded HDPE Bottle Tops into Terrazzo Coasters"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Feedstock Category:
                      </label>
                      <select
                        value={submitCategory}
                        onChange={(e) => setSubmitCategory(e.target.value as WasteCategory)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      >
                        <option value="Plastic">Plastic</option>
                        <option value="Textile">Textile</option>
                        <option value="Organic">Organic</option>
                        <option value="E-waste">E-waste</option>
                        <option value="Paper">Paper</option>
                        <option value="Metal">Metal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Skill Level:
                      </label>
                      <select
                        value={submitDifficulty}
                        onChange={(e) => setSubmitDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Industrial Scale">Industrial Scale</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Source Waste Feedstock:
                      </label>
                      <input
                        required
                        type="text"
                        value={submitFeedstock}
                        onChange={(e) => setSubmitFeedstock(e.target.value)}
                        placeholder="e.g. Milk jugs, bottle caps"
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Finished End Product:
                      </label>
                      <input
                        required
                        type="text"
                        value={submitEndProduct}
                        onChange={(e) => setSubmitEndProduct(e.target.value)}
                        placeholder="e.g. Molded desk pots, coasters"
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Est. Raw Cost / kg ($):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={submitRawPrice}
                        onChange={(e) => setSubmitRawPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Est. Finished Value / kg ($):
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={submitFinishedPrice}
                        onChange={(e) => setSubmitFinishedPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Tools & Equipment (comma-separated):
                    </label>
                    <input
                      type="text"
                      value={submitTools}
                      onChange={(e) => setSubmitTools(e.target.value)}
                      placeholder="e.g. Granulator, Panini press, Silicone mold"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Transformation Description / Recipe:
                    </label>
                    <textarea
                      rows={3}
                      value={submitDesc}
                      onChange={(e) => setSubmitDesc(e.target.value)}
                      placeholder="Briefly explain the process and key tips..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
                    >
                      Publish Blueprint
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
