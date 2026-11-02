import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import {
  ArrowLeft,
  ShoppingBag,
  Calculator,
  Compass,
  BarChart3,
  BookOpen,
  Info,
  Mail,
  User,
  Plus,
  Truck,
  Flame,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Zap,
  Leaf
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { MarketplaceSection } from './components/MarketplaceSection';
import { CalculatorSection } from './components/CalculatorSection';
import { UpcycleLabSection } from './components/UpcycleLabSection';
import { RecyclingLocatorSection } from './components/RecyclingLocatorSection';
import { DashboardSection } from './components/DashboardSection';
import { ProfileSection } from './components/ProfileSection';
import { EducationSection } from './components/EducationSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { WasteListing, PickupRequest, WasteCategory, CurrencyInfo } from './types';
import { StorageService } from './utils/storage';
import { CurrencyService } from './utils/currency';
import { ThemeService, ThemeMode } from './utils/theme';
import { db } from './services/db';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Active section derived reactively from URL path (e.g. '/marketplace' -> 'marketplace')
  const activeSection = location.pathname.replace(/^\//, '') || 'home';

  const [listings, setListings] = useState<WasteListing[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Currency & Theme state
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyInfo>(() =>
    CurrencyService.getSelectedCurrency()
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() =>
    ThemeService.applyInitialTheme()
  );

  // Initialize AOS and stored data
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-cubic',
    });

    const storedListings = StorageService.getListings();
    const storedPickups = StorageService.getPickups();
    setListings(storedListings);
    setPickups(storedPickups);

    // Subscribe to DB changes across the application
    const unsubscribe = db.subscribe(() => {
      setListings(StorageService.getListings());
      setPickups(StorageService.getPickups());
    });
    return () => unsubscribe();
  }, []);

  // Refresh AOS on view or theme change
  useEffect(() => {
    AOS.refresh();
  }, [activeSection, currentTheme, isSidebarCollapsed]);

  // Navigate to designated view with URL routing & instant scroll-to-top
  const handleNavigate = (sectionId: string) => {
    const targetPath = sectionId === 'home' ? '/' : `/${sectionId}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCurrencyChange = (newCurrency: CurrencyInfo) => {
    CurrencyService.setSelectedCurrency(newCurrency);
    setCurrentCurrency(newCurrency);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    ThemeService.setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  // Marketplace Handlers
  const handleAddListing = (newListing: WasteListing) => {
    const updated = StorageService.addListing(newListing);
    setListings(updated);
  };

  const handleDeleteListing = (id: string) => {
    const updated = StorageService.deleteListing(id);
    setListings(updated);
  };

  const handleToggleListingStatus = (id: string) => {
    const updated = StorageService.toggleListingStatus(id);
    setListings(updated);
  };

  // Pickup Handlers
  const handleAddPickup = (newPickup: PickupRequest) => {
    const updated = StorageService.addPickup(newPickup);
    setPickups(updated);
  };

  const handleCancelPickup = (id: string) => {
    const updated = StorageService.cancelPickup(id);
    setPickups(updated);
  };

  const handleDeletePickup = (id: string) => {
    const updated = StorageService.deletePickup(id);
    setPickups(updated);
  };

  // Calculator -> Marketplace shortcut
  const handleListFromCalculator = (
    _category: WasteCategory,
    _subType: string,
    _quantity: number,
    _pricePerUnit: number
  ) => {
    setIsListingModalOpen(true);
    handleNavigate('marketplace');
  };

  const userCreatedListings = listings.filter((l) => l.isUserCreated);

  // Meta info for each section when loaded independently
  const sectionMeta: Record<string, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
    marketplace: {
      title: 'Waste Marketplace & Trading Desk',
      subtitle: 'Verified secondary scrap feedstock trade exchange with live pricing & contact channels',
      icon: ShoppingBag,
    },
    calculator: {
      title: 'Scrap Valuation & Yield Calculator',
      subtitle: 'Dynamic market price appraisal across 6 industrial & post-consumer waste streams',
      icon: Calculator,
    },
    'upcycle-lab': {
      title: 'Circular Upcycling Lab',
      subtitle: 'High-value repurposing blueprints, industrial transformation specs, and DIY guides',
      icon: Flame,
    },
    locator: {
      title: 'Recycling Centers & Doorstep Pickup',
      subtitle: 'Geo-mapped authorized collection hubs with on-demand logistics dispatch',
      icon: Compass,
    },
    dashboard: {
      title: 'My Trading Portfolio & Analytics',
      subtitle: 'Track your material diversion, earnings, active marketplace lots, and scheduled pickups',
      icon: BarChart3,
    },
    profile: {
      title: 'Eco Passport & Digital KYC',
      subtitle: 'Circular identity verification, environmental impact badges, and tier level achievements',
      icon: ShieldCheck,
    },
    education: {
      title: 'Circular Economy Knowledge Hub',
      subtitle: 'Zero-waste playbooks, regulatory compliance frameworks, and recycling science guides',
      icon: BookOpen,
    },
    about: {
      title: 'About Waste2Wealth & ESG Mission',
      subtitle: 'Our verified circular infrastructure model, partner ecosystem, and carbon offset tracking',
      icon: Info,
    },
    contact: {
      title: 'Support & Circular Help Desk',
      subtitle: 'Get in touch with enterprise specialists, logistics coordinators, and platform engineers',
      icon: Mail,
    },
  };

  const currentMeta = sectionMeta[activeSection];

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-emerald-200 selection:text-emerald-950 transition-colors duration-300">
      {/* Professional Responsive Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenListingModal={() => setIsListingModalOpen(true)}
        onOpenPickupModal={() => setIsPickupModalOpen(true)}
        userListingsCount={userCreatedListings.length}
        userPickupsCount={pickups.length}
        currentCurrency={currentCurrency}
        onCurrencyChange={handleCurrencyChange}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Workspace with Dynamic Left Margin for Sidebar */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 pt-16 lg:pt-0 ${
          isSidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-72'
        }`}
      >
        {/* Dedicated View Header & Breadcrumb Bar (Rendered when viewing any dedicated feature page) */}
        {activeSection !== 'home' && currentMeta && (
          <header className="sticky top-0 lg:top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all cursor-pointer border border-stone-200/80 dark:border-stone-700 group"
                title="Return to Platform Hub Overview"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-emerald-600" />
                <span>Hub Overview</span>
              </button>

              <div className="h-4 w-px bg-stone-200 dark:bg-stone-700 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  {React.createElement(currentMeta.icon, { className: 'w-4 h-4' })}
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-black text-stone-900 dark:text-white font-heading leading-tight">
                    {currentMeta.title}
                  </h1>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden md:block truncate max-w-md">
                    {currentMeta.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons on View Header */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setIsListingModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Listing</span>
              </button>
              <button
                onClick={() => setIsPickupModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold border border-stone-200/80 dark:border-stone-700 transition-all cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-teal-600" />
                <span>Book Pickup</span>
              </button>
            </div>
          </header>
        )}

        <main className="flex-1">
          {/* VIEW 1: HOME PLATFORM OVERVIEW (Hero + Comprehensive Circular Feature Gateway) */}
          {activeSection === 'home' && (
            <div>
              <Hero
                onNavigate={handleNavigate}
                onOpenListingModal={() => setIsListingModalOpen(true)}
                onOpenPickupModal={() => setIsPickupModalOpen(true)}
                currentCurrency={currentCurrency}
              />

              {/* Dedicated Feature Gateway (Loads each designated feature independently on click) */}
              <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200/80 dark:border-stone-800">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dedicated View Architecture with URL Routing</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-heading">
                      Select a Circular Feature to Launch
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                      Each designated tool runs in its own dedicated workspace with bookmarkable URL routing and seamless data persistence.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-semibold">Live System:</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-300/60">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Circular Hub Online
                    </span>
                  </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: Marketplace */}
                  <div
                    onClick={() => handleNavigate('marketplace')}
                    className="p-6 rounded-3xl glass-panel glass-panel-hover border border-stone-200/90 dark:border-stone-800 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60">
                          {listings.length} Lots Available
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading group-hover:text-emerald-600 transition-colors">
                        Waste Marketplace
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                        Trade verified secondary materials (Plastics, Metals, E-waste, Textiles, Paper, Organics). Direct buyer-seller chat and trade settlement.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <span>Launch Marketplace</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Calculator */}
                  <div
                    onClick={() => handleNavigate('calculator')}
                    className="p-6 rounded-3xl glass-panel glass-panel-hover border border-stone-200/90 dark:border-stone-800 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-600/30 group-hover:scale-105 transition-transform">
                          <Calculator className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/60">
                          Dynamic Rates
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading group-hover:text-amber-600 transition-colors">
                        Scrap Value Calculator
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                        Instant scrap valuation based on weight, purity, and live secondary market rates in {currentCurrency.code} ({currentCurrency.symbol}).
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                      <span>Calculate Scrap Value</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Upcycling Lab */}
                  <div
                    onClick={() => handleNavigate('upcycle-lab')}
                    className="p-6 rounded-3xl glass-panel glass-panel-hover border border-stone-200/90 dark:border-stone-800 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
                          <Flame className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300/60">
                          Interactive Lab
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading group-hover:text-rose-600 transition-colors">
                        Circular Upcycle Lab
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                        Step-by-step blueprints to transform low-grade discards into high-value artisan, acoustic, and industrial end products.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
                      <span>Explore Upcycle Blueprints</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 4: Recycling Centers & Pickup */}
                  <div
                    onClick={() => handleNavigate('locator')}
                    className="p-6 rounded-3xl glass-panel glass-panel-hover border border-stone-200/90 dark:border-stone-800 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30 group-hover:scale-105 transition-transform">
                          <Compass className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-300/60">
                          Geo-Verified
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading group-hover:text-teal-600 transition-colors">
                        Recycling Centers & Pickups
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                        Find authorized drop-off depots nearby or book certified doorstep collection with automated route and weight tracking.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                      <span>Find Centers & Book</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 5: My Portfolio */}
                  <div
                    onClick={() => handleNavigate('dashboard')}
                    className="p-6 rounded-3xl glass-panel glass-panel-hover border border-stone-200/90 dark:border-stone-800 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                          <BarChart3 className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-300/60">
                          {pickups.length} Pickups
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading group-hover:text-indigo-600 transition-colors">
                        Trading Portfolio & Analytics
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                        Monitor your diversion tonnage, scrap earnings history, active lot statuses, and carbon offset credentials.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400">
                      <span>View My Portfolio</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 6: Eco Passport */}
                  <div
                    onClick={() => handleNavigate('profile')}
                    className="p-6 rounded-3xl glass-panel glass-panel-hover border border-stone-200/90 dark:border-stone-800 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-300/60">
                          Tier 3 Verified
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading group-hover:text-purple-600 transition-colors">
                        Eco Passport & KYC Identity
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                        Tamper-evident circular trading passport, ESG verification certifications, notification rules, and KYC profile.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400">
                      <span>Open Eco Passport</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* VIEW 2: WASTE MARKETPLACE */}
          {activeSection === 'marketplace' && (
            <MarketplaceSection
              listings={listings}
              onAddListing={handleAddListing}
              onDeleteListing={handleDeleteListing}
              onToggleStatus={handleToggleListingStatus}
              isCreateModalOpen={isListingModalOpen}
              setIsCreateModalOpen={setIsListingModalOpen}
              currentCurrency={currentCurrency}
            />
          )}

          {/* VIEW 3: VALUE CALCULATOR */}
          {activeSection === 'calculator' && (
            <CalculatorSection
              onListFromCalculator={handleListFromCalculator}
              currentCurrency={currentCurrency}
            />
          )}

          {/* VIEW 4: CIRCULAR UPCYCLING LAB */}
          {activeSection === 'upcycle-lab' && (
            <UpcycleLabSection currentCurrency={currentCurrency} />
          )}

          {/* VIEW 5: RECYCLING LOCATOR & ON-DEMAND PICKUP */}
          {activeSection === 'locator' && (
            <RecyclingLocatorSection
              onAddPickupRequest={handleAddPickup}
              isPickupModalOpen={isPickupModalOpen}
              setIsPickupModalOpen={setIsPickupModalOpen}
            />
          )}

          {/* VIEW 6: USER PORTFOLIO & DASHBOARD */}
          {activeSection === 'dashboard' && (
            <DashboardSection
              userListings={userCreatedListings}
              pickupRequests={pickups}
              onDeleteListing={handleDeleteListing}
              onToggleListingStatus={handleToggleListingStatus}
              onCancelPickup={handleCancelPickup}
              onDeletePickup={handleDeletePickup}
              onOpenCreateListing={() => setIsListingModalOpen(true)}
              onOpenCreatePickup={() => {
                setIsPickupModalOpen(true);
                handleNavigate('locator');
              }}
              currentCurrency={currentCurrency}
            />
          )}

          {/* VIEW 7: ECO PASSPORT & PROFILE */}
          {activeSection === 'profile' && (
            <ProfileSection
              currentCurrency={currentCurrency}
              onCurrencyChange={handleCurrencyChange}
              userListings={userCreatedListings}
              pickupRequests={pickups}
              onNavigate={handleNavigate}
              onOpenListingModal={() => setIsListingModalOpen(true)}
              onOpenPickupModal={() => setIsPickupModalOpen(true)}
            />
          )}

          {/* VIEW 8: CIRCULAR EDUCATION */}
          {activeSection === 'education' && <EducationSection />}

          {/* VIEW 9: ABOUT & ESG IMPACT */}
          {activeSection === 'about' && <AboutSection />}

          {/* VIEW 10: CONTACT & SUPPORT */}
          {activeSection === 'contact' && <ContactSection />}
        </main>

        {/* Global Footer (Rendered across all views with navigation triggers) */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
