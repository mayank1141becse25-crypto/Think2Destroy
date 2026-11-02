import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Globe, 
  Coins, 
  CheckCircle2, 
  Camera, 
  Edit3, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Leaf, 
  Truck, 
  Download, 
  Printer, 
  Sparkles, 
  Bell, 
  Save, 
  X,
  ExternalLink,
  ChevronRight,
  Sliders,
  PackageCheck,
  Check
} from 'lucide-react';
import { UserProfile, UserEcoBadge, WasteListing, PickupRequest } from '../types';
import { SUPPORTED_CURRENCIES, CurrencyInfo, CurrencyService } from '../utils/currency';
import { StorageService } from '../utils/storage';
import confetti from 'canvas-confetti';

interface ProfileSectionProps {
  currentCurrency: CurrencyInfo;
  onCurrencyChange: (currency: CurrencyInfo) => void;
  userListings?: WasteListing[];
  pickupRequests?: PickupRequest[];
  onNavigate?: (sectionId: string) => void;
  onOpenListingModal?: () => void;
  onOpenPickupModal?: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  currentCurrency,
  onCurrencyChange,
  userListings = [],
  pickupRequests = [],
  onNavigate = () => {},
  onOpenListingModal,
  onOpenPickupModal,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [badges] = useState<UserEcoBadge[]>(() => StorageService.getBadges());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'currency' | 'certificate' | 'badges'>('overview');
  const [certificatePrinted, setCertificatePrinted] = useState(false);

  // Compute dynamic stats
  const totalListedKg = userListings.reduce((sum, item) => {
    const mult = item.unit === 'tons' ? 1000 : 1;
    return sum + item.quantity * mult;
  }, 0);

  const totalPickupKg = pickupRequests.reduce(
    (sum, p) => (p.status !== 'Cancelled' ? sum + p.estimatedQuantityKg : sum),
    0
  );

  const totalDivertedKg = totalListedKg + totalPickupKg;
  const estimatedCo2Kg = Math.round(totalDivertedKg * 1.85);
  const activePickups = pickupRequests.filter(
    (p) => p.status === 'Scheduled' || p.status === 'Crew Assigned'
  ).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveProfile(editForm);
    setProfile(editForm);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSelectCurrency = (curr: CurrencyInfo) => {
    onCurrencyChange(curr);
    const updatedProfile = { ...profile, preferredCurrency: curr.code };
    setProfile(updatedProfile);
    StorageService.saveProfile(updatedProfile);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#059669', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  };

  const handlePrintCertificate = () => {
    setCertificatePrinted(true);
    window.print();
    setTimeout(() => setCertificatePrinted(false), 2000);
  };

  return (
    <section id="profile" className="py-20 md:py-28 relative overflow-hidden bg-stone-50/70 scroll-mt-20">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full glow-spot-emerald pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full glow-spot-cyan pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full glow-spot-purple pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-300/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Eco-Identity & Preferences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 font-heading tracking-tight">
              Member Profile & Localization
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl font-medium">
              Manage your personal credentials, country currency preferences, verified eco-credentials, 
              and download your official circular impact certificate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-xl glass-panel border border-white/80 text-xs font-bold text-stone-800 hover:bg-white shadow-sm cursor-pointer flex items-center gap-2 transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => setActiveTab('currency')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20 cursor-pointer flex items-center gap-2 transition-all active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>{currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol})</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and localization preferences successfully saved to local storage!</span>
          </div>
        )}

        {/* User Identity Showcase Card */}
        <div className="mt-8 glass-panel p-6 sm:p-9 rounded-3xl border border-white/80 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-400/80 shadow-md ring-4 ring-white/60"
                />
                <button
                  onClick={() => setIsEditing(true)}
                  aria-label="Change profile photo"
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-stone-900 text-white shadow-md hover:bg-emerald-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
                    {profile.name}
                  </h3>
                  {profile.verifiedStatus && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-900 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-1 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified KYC Supplier
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-1 rounded-full shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {profile.ecoLevel}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-stone-600 max-w-xl font-medium leading-relaxed">
                  {profile.bio}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-stone-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{profile.city}, {profile.country}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Member since {profile.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferred Currency & Quick Actions Box */}
            <div className="w-full lg:w-auto p-4 rounded-2xl bg-white/70 border border-stone-200/80 shadow-sm shrink-0 flex items-center justify-between lg:flex-col lg:items-end gap-3">
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Active Price Currency
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl">{currentCurrency.flag}</span>
                  <span className="text-lg font-black text-stone-900 font-heading">
                    {currentCurrency.code} ({currentCurrency.symbol})
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Rate: 1 USD = {currentCurrency.rate} {currentCurrency.code}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('currency')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer transition-colors"
              >
                Change Country / Currency
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-stone-200/80 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'currency'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Country & Currency ({currentCurrency.code})</span>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'badges'
                ? 'bg-stone-900 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Eco Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'certificate'
                ? 'bg-stone-900 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span>Audit Impact Certificate</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* 4 Performance Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md bg-gradient-to-br from-cyan-50/60 via-white/70 to-blue-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Feedstock Diverted</span>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-stone-900 font-heading">
                  {totalDivertedKg.toLocaleString()} <span className="text-sm font-bold text-stone-400">kg</span>
                </div>
                <p className="text-[11px] text-cyan-700 font-semibold mt-1">
                  Preserved from municipal landfill
                </p>
              </div>

              <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md bg-gradient-to-br from-emerald-50/70 via-white/70 to-teal-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">CO₂e Emissions Avoided</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-800 font-heading">
                  {estimatedCo2Kg.toLocaleString()} <span className="text-sm font-bold text-stone-400">kg</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  ~{(estimatedCo2Kg / 1000).toFixed(2)} metric tons avoided
                </p>
              </div>

              <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md bg-gradient-to-br from-amber-50/60 via-white/70 to-orange-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Pickup Dispatches</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-stone-900 font-heading">
                  {activePickups} <span className="text-sm font-bold text-stone-400">orders</span>
                </div>
                <p className="text-[11px] text-amber-800 font-semibold mt-1">
                  {pickupRequests.length} lifetime collections booked
                </p>
              </div>

              <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md bg-gradient-to-br from-purple-50/60 via-white/70 to-indigo-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Marketplace Listings</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-purple-950 font-heading">
                  {userListings.length} <span className="text-sm font-bold text-stone-400">active</span>
                </div>
                <p className="text-[11px] text-purple-700 font-semibold mt-1">
                  Ready for industrial buyers
                </p>
              </div>
            </div>

            {/* Quick Link Navigation Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => onNavigate('marketplace')}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/80 shadow-md cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Coins className="w-5 h-5 text-emerald-700" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
                <h4 className="font-black text-stone-900 text-base font-heading">Manage Marketplace Listings</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Create new scrap commodity listings, update asking prices, or mark lots as sold.
                </p>
              </div>

              <div 
                onClick={() => onNavigate('locator')}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/80 shadow-md cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5 text-cyan-700" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
                <h4 className="font-black text-stone-900 text-base font-heading">Book Collection Pickup</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Dispatch doorstep collection crews or locate regional drop-off recovery centers.
                </p>
              </div>

              <div 
                onClick={() => onNavigate('calculator')}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/80 shadow-md cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Sliders className="w-5 h-5 text-amber-700" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
                <h4 className="font-black text-stone-900 text-base font-heading">Waste Value Calculator</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Calculate estimated scrap earnings in {currentCurrency.code} ({currentCurrency.symbol}) for all 6 streams.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COUNTRY & CURRENCY LOCALIZATION (USER'S DIRECT REQUEST) */}
        {activeTab === 'currency' && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                    Select Your Country & Local Currency
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Choose your country below. All prices in the Waste Marketplace, dynamic Waste Value Calculator, and Dashboard will automatically recalculate in your local currency.
                  </p>
                </div>
              </div>

              {/* Supported Currencies Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SUPPORTED_CURRENCIES.map((curr) => {
                  const isSelected = currentCurrency.code === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => handleSelectCurrency(curr)}
                      className={`p-4.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/40 shadow-md'
                          : 'border-stone-200/90 bg-white/70 hover:bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{curr.flag}</span>
                        <div>
                          <div className="font-black text-stone-900 text-sm font-heading flex items-center gap-1.5">
                            <span>{curr.code}</span>
                            <span className="text-emerald-700 font-mono font-bold">({curr.symbol})</span>
                          </div>
                          <div className="text-xs text-stone-600 font-medium">
                            {curr.country}
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            Rate: 1 USD = {curr.rate} {curr.code}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Bar */}
              <div className="mt-6 p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentCurrency.flag}</span>
                  <div>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      Currently Applied Across Website:
                    </span>
                    <div className="text-sm font-bold">
                      {currentCurrency.name} ({currentCurrency.country}) • Symbol: {currentCurrency.symbol}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-300 bg-stone-800/80 px-4 py-2 rounded-xl border border-stone-700 font-mono">
                  Example: 100 kg Copper = {CurrencyService.formatUSD(790, currentCurrency)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ECO BADGES & ACHIEVEMENTS */}
        {activeTab === 'badges' && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                    Verified Circular Achievements
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Gamified milestones awarded for segregation precision, avoided carbon tonnage, and certified trades.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shadow-2xs">
                  {badges.filter((b) => b.unlocked).length} / {badges.length} Badges Unlocked
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      badge.unlocked
                        ? 'glass-panel bg-white/80 border-emerald-200/90 shadow-md'
                        : 'bg-stone-100/50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm ${
                        badge.unlocked
                          ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}>
                        <Award className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        badge.unlocked
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-500'
                      }`}>
                        {badge.unlocked ? 'Unlocked' : 'In Progress'}
                      </span>
                    </div>

                    <h4 className="font-black text-stone-900 text-base font-heading">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                      {badge.description}
                    </p>

                    {badge.unlocked && badge.unlockedAt && (
                      <div className="mt-3 pt-3 border-t border-stone-200/60 text-[10px] text-stone-400 font-semibold">
                        Awarded on {new Date(badge.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDITED IMPACT CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/80 shadow-2xl bg-gradient-to-b from-white/95 to-emerald-50/30 max-w-4xl mx-auto">
              
              {/* Certificate Border Frame */}
              <div className="border-4 border-double border-emerald-700/40 p-6 sm:p-10 rounded-2xl relative bg-white/90 shadow-inner">
                
                {/* Header with Seal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-700/20">
                      <Leaf className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-stone-900 font-heading tracking-tight">
                        Waste2Wealth Circular Ledger
                      </h4>
                      <p className="text-xs text-stone-500 font-mono">
                        Global Standard for Audited Resource Divergence (GS-ARD)
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Audit Serial</div>
                    <div className="text-xs font-mono font-bold text-emerald-800">
                      W2W-CERT-2026-{(totalDivertedKg * 7).toString().padStart(6, '0')}
                    </div>
                  </div>
                </div>

                {/* Certificate Core Statement */}
                <div className="py-8 text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    Official Environmental Offset Certificate
                  </span>
                  <h3 className="text-xl sm:text-3xl font-serif italic text-stone-800 font-bold">
                    This certifies that
                  </h3>
                  <div className="text-2xl sm:text-4xl font-black text-stone-900 font-heading underline decoration-emerald-500 decoration-wavy">
                    {profile.name}
                  </div>
                  <p className="max-w-xl mx-auto text-xs sm:text-sm text-stone-600 leading-relaxed font-medium pt-2">
                    Has successfully diverted post-consumer recyclables and secondary industrial feedstock from municipal landfills, directly advancing United Nations Sustainable Development Goals SDG 12 (Responsible Consumption) and SDG 13 (Climate Action).
                  </p>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-center p-2">
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Feedstock Diverted</div>
                    <div className="text-lg font-black text-stone-900 font-heading">{totalDivertedKg} kg</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-[10px] text-stone-400 uppercase font-bold">CO₂e Avoided</div>
                    <div className="text-lg font-black text-emerald-700 font-heading">{estimatedCo2Kg} kg</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Member Level</div>
                    <div className="text-xs font-black text-amber-700 mt-1">{profile.ecoLevel}</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Verification Date</div>
                    <div className="text-xs font-mono font-bold text-stone-700 mt-1">
                      {new Date().toISOString().split('T')[0]}
                    </div>
                  </div>
                </div>

                {/* Signature and Verification Footer */}
                <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Cryptographically verified on the Waste2Wealth circular ledger.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintCertificate}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF Export</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="glass-panel bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-lg sm:text-xl font-black text-stone-900 font-heading">
                Edit Member Profile & Preferences
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name / Legal Entity
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Bio / Organization Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={editForm.avatarUrl}
                  onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
