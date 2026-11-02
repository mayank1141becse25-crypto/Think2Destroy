import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  DollarSign, 
  Leaf, 
  TreePine, 
  Zap, 
  Droplet, 
  Layers, 
  ArrowRight, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { WasteCategory } from '../types';
import { 
  calculateValuation, 
  WASTE_RATES_DATA, 
  formatCurrency 
} from '../utils/calculator';
import { CurrencyInfo, CurrencyService } from '../utils/currency';

interface CalculatorSectionProps {
  onListFromCalculator?: (category: WasteCategory, subType: string, quantity: number, pricePerUnit: number) => void;
  currentCurrency: CurrencyInfo;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  onListFromCalculator,
  currentCurrency,
}) => {

  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('Plastic');
  const [selectedSubTypeId, setSelectedSubTypeId] = useState<string>('pet_bottles');
  const [quantityKg, setQuantityKg] = useState<number>(75);

  const categories: WasteCategory[] = [
    'Plastic',
    'Paper',
    'Metal',
    'E-waste',
    'Organic',
    'Textile',
  ];

  // Available subtypes for active category
  const availableSubTypes = useMemo(() => {
    return WASTE_RATES_DATA[selectedCategory] || [];
  }, [selectedCategory]);

  // Handle category switch
  const handleCategoryChange = (cat: WasteCategory) => {
    setSelectedCategory(cat);
    const subTypes = WASTE_RATES_DATA[cat];
    if (subTypes && subTypes.length > 0) {
      setSelectedSubTypeId(subTypes[0].id);
    }
  };

  // Perform dynamic calculation
  const metrics = useMemo(() => {
    return calculateValuation(selectedCategory, selectedSubTypeId, quantityKg);
  }, [selectedCategory, selectedSubTypeId, quantityKg]);

  const currentOption = useMemo(() => {
    return availableSubTypes.find((opt) => opt.id === selectedSubTypeId) || availableSubTypes[0];
  }, [availableSubTypes, selectedSubTypeId]);

  const handleReset = () => {
    setSelectedCategory('Plastic');
    setSelectedSubTypeId('pet_bottles');
    setQuantityKg(75);
  };

  const handleQuickPreset = (qty: number) => {
    setQuantityKg(qty);
  };

  return (
    <section id="calculator" className="py-16 md:py-24 bg-[#F5F3EC]/70 scroll-mt-20 border-y border-stone-200/70 relative overflow-hidden">
      {/* Radiant ambient backdrop spots */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] glow-spot-emerald -z-10 pointer-events-none rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] glow-spot-amber -z-10 pointer-events-none rounded-full blur-3xl opacity-50" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs border border-emerald-300/50">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Waste Valuation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading tracking-tight">
            Waste Value & Eco-Impact Calculator
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
            Estimate the market value of your recyclable scrap and measure the tangible carbon, 
            water, and energy savings diverted from municipal landfills.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Controls with Glass Panel */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-lg space-y-6">
            
            {/* Category Selector Tabs with Jewel Colors */}
            <div>
              <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-2.5">
                1. Select Waste Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  let activeGradient = 'bg-stone-900 text-white';
                  if (cat === 'Plastic') activeGradient = 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25';
                  else if (cat === 'Paper') activeGradient = 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/25';
                  else if (cat === 'Metal') activeGradient = 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25';
                  else if (cat === 'E-waste') activeGradient = 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/25';
                  else if (cat === 'Organic') activeGradient = 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25';
                  else if (cat === 'Textile') activeGradient = 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25';

                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `${activeGradient} shadow-sm scale-102`
                          : 'bg-white/80 text-stone-700 hover:text-stone-900 hover:bg-white border border-stone-200/60 shadow-2xs'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Type Selector */}
            <div>
              <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider mb-2.5">
                2. Material Grade / Stream
              </label>
              <div className="space-y-2">
                {availableSubTypes.map((sub) => (
                  <label
                    key={sub.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      selectedSubTypeId === sub.id
                        ? 'border-emerald-400 bg-white/95 shadow-sm ring-2 ring-emerald-400/20'
                        : 'border-stone-200/80 hover:border-emerald-300 bg-white/60 hover:bg-white/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="wasteSubType"
                      checked={selectedSubTypeId === sub.id}
                      onChange={() => setSelectedSubTypeId(sub.id)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{sub.name}</span>
                        <span className="font-extrabold text-emerald-700 font-heading">
                          {CurrencyService.formatUSD(sub.minRate, currentCurrency)} - {CurrencyService.formatUSD(sub.maxRate, currentCurrency)} / kg
                        </span>
                      </div>

                      <p className="text-stone-500 mt-0.5 leading-relaxed">{sub.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity Controls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                  3. Enter Quantity (Kilograms)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-xl font-heading shadow-2xs border border-emerald-300/40">
                    {quantityKg.toLocaleString()} kg
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">
                    ({(quantityKg / 1000).toFixed(2)} metric tons)
                  </span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200/80 rounded-lg"
                aria-label="Quantity in kilograms slider"
              />

              {/* Numeric Input & Presets */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">Custom input:</span>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-right shadow-2xs"
                  />
                  <span className="text-xs text-stone-600 font-bold">kg</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[10, 50, 150, 500].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleQuickPreset(preset)}
                      className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                        quantityKg === preset
                          ? 'bg-stone-900 text-white shadow-2xs'
                          : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white border border-stone-200/60 shadow-2xs'
                      }`}
                    >
                      {preset} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions inside Left Panel */}
            <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>Real-time benchmark calculation</span>
              </div>
            </div>
          </div>

          {/* Right: Valuation Results & Environmental ROI */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Earnings Card with Glass-Emerald Frosted Surface */}
            <div className="glass-emerald text-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(6,78,59,0.35)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between text-xs text-emerald-200 uppercase tracking-wider font-extrabold">
                  <span>Estimated Recyclable Value</span>
                  <span className="bg-emerald-600/50 px-3 py-0.5 rounded-full text-[10px] border border-emerald-400/40 shadow-2xs">
                    Indicative Benchmark
                  </span>
                </div>

                {/* Big Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight font-heading text-amber-300 drop-shadow-sm">
                    {CurrencyService.formatUSD(metrics.estimatedAvgPrice, currentCurrency)}
                  </div>
                  <div className="text-emerald-100 text-xs sm:text-sm font-medium">
                    (Range: {CurrencyService.formatUSD(metrics.estimatedMinPrice, currentCurrency)} – {CurrencyService.formatUSD(metrics.estimatedMaxPrice, currentCurrency)})
                  </div>
                </div>

                <p className="mt-2 text-xs text-emerald-100/90 leading-relaxed font-medium">
                  Based on <strong>{metrics.quantityKg} kg</strong> of{' '}
                  <span className="text-white font-bold">{metrics.subType}</span> at current wholesale scrap buyer aggregation rates.
                </p>

                {/* Benchmark Rate details */}
                <div className="mt-6 pt-5 border-t border-emerald-500/30 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-emerald-200/80 font-medium">Benchmark Scrap Rate ({currentCurrency.code})</span>
                    <div className="font-black text-sm text-white mt-0.5">
                      {CurrencyService.formatUSD(currentOption?.minRate || 0, currentCurrency)} - {CurrencyService.formatUSD(currentOption?.maxRate || 0, currentCurrency)} / kg
                    </div>
                  </div>

                  <div>
                    <span className="text-emerald-200/80 font-medium">Market Liquidity</span>
                    <div className="font-black text-sm text-white mt-0.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      High Turnover Stream
                    </div>
                  </div>
                </div>

                {/* Direct Shortcut to Marketplace */}
                {onListFromCalculator && (
                  <button
                    onClick={() =>
                      onListFromCalculator(
                        selectedCategory,
                        currentOption?.name || selectedCategory,
                        quantityKg,
                        metrics.estimatedAvgPrice / (quantityKg || 1)
                      )
                    }
                    className="mt-6 w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>List this {quantityKg} kg in Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Environmental Benefits Card with Glass Panel */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
              <div className="flex items-center gap-2.5 text-stone-900 font-extrabold text-sm sm:text-base mb-4 font-heading">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-2xs">
                  <Leaf className="w-4 h-4" />
                </div>
                <span>Audited Environmental Offset Breakdown</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* CO2 Emissions */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold mb-1">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>CO₂e Avoided</span>
                  </div>
                  <div className="text-xl font-black text-emerald-900 font-heading">
                    {metrics.co2SavedKg.toLocaleString()} kg
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                    Landfill methane & virgin production offset
                  </p>
                </div>

                {/* Energy Saved */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-900 text-xs font-bold mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Clean Energy Saved</span>
                  </div>
                  <div className="text-xl font-black text-amber-900 font-heading">
                    {metrics.energySavedKwh.toLocaleString()} kWh
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                    Equivalent to ~{Math.round(metrics.energySavedKwh / 1.5)} days home power
                  </p>
                </div>

                {/* Water Conserved */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border border-cyan-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-cyan-900 text-xs font-bold mb-1">
                    <Droplet className="w-4 h-4 text-cyan-600" />
                    <span>Water Conserved</span>
                  </div>
                  <div className="text-xl font-black text-cyan-900 font-heading">
                    {metrics.waterSavedLiters.toLocaleString()} L
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                    Diverted from industrial virgin processing
                  </p>
                </div>

                {/* Landfill Diverted */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 to-indigo-50/80 border border-purple-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 text-purple-900 text-xs font-bold mb-1">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>Landfill Diverted</span>
                  </div>
                  <div className="text-xl font-black text-purple-900 font-heading">
                    {metrics.landfillVolumeDivertedM3} m³
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                    Municipal compaction space preserved
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-5 p-3.5 rounded-2xl bg-white/80 border border-stone-200/80 flex items-start gap-2.5 text-[11px] text-stone-500 leading-relaxed">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Illustrative Benchmark Notice:</strong> Stated rates represent industry aggregators’ 
                  median regional buying prices and ecological life cycle assessment (LCA) coefficients. 
                  Actual transactions depend on moisture, contamination degree, volume baling, and buyer delivery terms.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

