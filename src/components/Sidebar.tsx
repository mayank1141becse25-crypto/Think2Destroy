import React, { useState, useEffect, useRef } from 'react';
import {
  Recycle,
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
  Globe,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Check,
  Flame,
  Award,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  ShieldCheck,
  Grid,
  Search
} from 'lucide-react';
import { CurrencyInfo } from '../types';
import { SUPPORTED_CURRENCIES } from '../utils/currency';
import { ThemeMode } from '../utils/theme';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenListingModal: () => void;
  onOpenPickupModal: () => void;
  userListingsCount: number;
  userPickupsCount: number;
  currentCurrency: CurrencyInfo;
  onCurrencyChange: (currency: CurrencyInfo) => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavGroup {
  groupTitle: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeVariant?: 'emerald' | 'amber' | 'blue' | 'purple';
    tooltip?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  onOpenListingModal,
  onOpenPickupModal,
  userListingsCount,
  userPickupsCount,
  currentCurrency,
  onCurrencyChange,
  currentTheme,
  onThemeChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close currency dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Professional semantic navigation groups
  const navigationGroups: NavGroup[] = [
    {
      groupTitle: 'Core Workspace',
      items: [
        { id: 'home', label: 'Platform Hub', icon: Grid, tooltip: 'Overview & quick access launchpad' },
        { 
          id: 'marketplace', 
          label: 'Waste Marketplace', 
          icon: ShoppingBag, 
          badge: userListingsCount > 0 ? `${userListingsCount} lots` : 'Live',
          badgeVariant: userListingsCount > 0 ? 'emerald' : 'blue',
          tooltip: 'Secondary material trade exchange' 
        },
        { id: 'calculator', label: 'Value Calculator', icon: Calculator, tooltip: 'Real-time scrap price appraisal' },
      ],
    },
    {
      groupTitle: 'Circular Labs & Logistics',
      items: [
        { 
          id: 'upcycle-lab', 
          label: 'Upcycle Blueprints', 
          icon: Flame, 
          badge: 'PRO', 
          badgeVariant: 'amber',
          tooltip: 'Industrial repurposing & DIY lab' 
        },
        { 
          id: 'locator', 
          label: 'Recycling Centers', 
          icon: Compass, 
          tooltip: 'Drop-off depots & on-demand pickup' 
        },
      ],
    },
    {
      groupTitle: 'Impact & Account',
      items: [
        { 
          id: 'dashboard', 
          label: 'My Portfolio', 
          icon: BarChart3, 
          badge: userPickupsCount > 0 ? `${userPickupsCount} orders` : undefined,
          badgeVariant: 'emerald',
          tooltip: 'Trading volume & carbon offset analytics' 
        },
        { 
          id: 'profile', 
          label: 'Eco Passport & KYC', 
          icon: ShieldCheck, 
          badge: 'KYC', 
          badgeVariant: 'purple',
          tooltip: 'Digital circular identity & credentials' 
        },
        { id: 'education', label: 'Circular Knowledge', icon: BookOpen, tooltip: 'Guides, policies & zero-waste methodology' },
      ],
    },
    {
      groupTitle: 'Company',
      items: [
        { id: 'about', label: 'About & Impact', icon: Info, tooltip: 'Mission, verification & ESG metrics' },
        { id: 'contact', label: 'Support & Inquiries', icon: Mail, tooltip: 'Help desk & corporate partnerships' },
      ],
    },
  ];

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const themeOptions: { id: ThemeMode; label: string; icon: string; dotColor: string }[] = [
    { id: 'emerald', label: 'Emerald', icon: '🌿', dotColor: 'bg-emerald-500' },
    { id: 'midnight', label: 'Midnight', icon: '🌙', dotColor: 'bg-indigo-500' },
    { id: 'ocean', label: 'Ocean', icon: '🌊', dotColor: 'bg-cyan-500' },
    { id: 'solar', label: 'Solar', icon: '☀️', dotColor: 'bg-amber-500' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top App Bar (Slim, Glassmorphic, High-Tech) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-40 px-4 glass-panel bg-white/95 dark:bg-stone-900/95 border-b border-stone-200/90 dark:border-stone-800 flex items-center justify-between backdrop-blur-2xl shadow-xs">
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Recycle className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-base font-black text-stone-900 dark:text-white font-heading leading-tight tracking-tight flex items-center gap-1.5">
              <span>Waste<span className="text-emerald-600 dark:text-emerald-400">2</span>Wealth</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold border border-emerald-300/60">
                PRO
              </span>
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold tracking-wide">
              Circular Economy Network
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Currency Badge on Mobile Header */}
          <button
            onClick={() => {
              setMobileOpen(true);
              setCurrencyDropdownOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/90 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 shadow-2xs"
            title="Change Currency"
          >
            <span>{currentCurrency.flag}</span>
            <span className="font-mono">{currentCurrency.code}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/25 transition-all cursor-pointer"
            aria-label="Toggle navigation sidebar"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Primary Sidebar Container (Desktop Fixed Left + Mobile Slide-Over Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white/95 dark:bg-stone-900/95 border-r border-stone-200/90 dark:border-stone-800 backdrop-blur-2xl transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          mobileOpen
            ? 'translate-x-0 w-[310px]'
            : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsed ? 'lg:w-[76px]' : 'lg:w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-3 cursor-pointer text-left overflow-hidden focus:outline-none ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="Go to Platform Hub"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 shrink-0 ring-2 ring-emerald-500/20">
              <Recycle className="w-5 h-5 animate-spin-slow" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-stone-900 dark:text-white font-heading leading-tight tracking-tight">
                    Waste<span className="text-emerald-600 dark:text-emerald-400">2</span>Wealth
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Circular Trading OS</span>
                </div>
              </div>
            )}
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-emerald-600" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Buttons in Sidebar */}
        <div className={`p-3.5 border-b border-stone-200/80 dark:border-stone-800 shrink-0 ${isCollapsed ? 'px-2' : ''}`}>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenListingModal();
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-700/25 active:scale-95 transition-all cursor-pointer ${
                isCollapsed ? 'px-2' : ''
              }`}
              title="Post Waste Lot for Sale"
            >
              <Plus className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="tracking-tight font-heading">Post Waste Lot</span>}
            </button>

            <button
              onClick={() => {
                onOpenPickupModal();
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100/90 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200/90 dark:border-stone-700 active:scale-95 transition-all cursor-pointer ${
                isCollapsed ? 'px-2' : ''
              }`}
              title="Schedule Doorstep Pickup"
            >
              <Truck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              {!isCollapsed && <span className="tracking-tight">Book Pickup</span>}
            </button>
          </div>
        </div>

        {/* Categorized Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
          {navigationGroups.map((group, groupIndex) => (
            <div key={group.groupTitle} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  {group.groupTitle}
                </div>
              )}
              {isCollapsed && groupIndex > 0 && (
                <div className="my-2 border-t border-stone-200/60 dark:border-stone-800" />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                const badgeStyles = {
                  emerald: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/60',
                  amber: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/60',
                  blue: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300/60 dark:border-blue-700/60',
                  purple: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300/60 dark:border-purple-700/60',
                };
                const badgeVariant = item.badgeVariant || 'emerald';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left group relative ${
                      isActive
                        ? 'bg-emerald-500/12 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-500/25 shadow-xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/80 dark:hover:bg-stone-800/60 border border-transparent'
                    } ${isCollapsed ? 'justify-center px-2 py-3' : ''}`}
                    title={item.tooltip || item.label}
                  >
                    {/* Active vertical accent pill on left edge */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-stone-500 dark:text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                      }`}
                    />

                    {!isCollapsed && (
                      <span className="flex-1 truncate tracking-tight">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${
                          badgeStyles[badgeVariant]
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Subtle active right chevron for desktop */}
                    {!isCollapsed && isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Global Controls & Account Footer in Sidebar */}
        <div className="p-3 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/60 shrink-0 space-y-2.5">
          {/* Country / Currency Selector */}
          <div className="relative" ref={currencyRef}>
            {!isCollapsed ? (
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/90 dark:border-stone-700 shadow-2xs hover:border-emerald-500/50 transition-all text-xs cursor-pointer group"
                title="Change Price Currency"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base leading-none">{currentCurrency.flag}</span>
                  <div className="text-left truncate">
                    <span className="font-bold text-stone-900 dark:text-white font-mono">
                      {currentCurrency.code}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono ml-1 font-bold">
                      ({currentCurrency.symbol})
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 shrink-0 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="w-full flex items-center justify-center p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm shadow-2xs cursor-pointer hover:border-emerald-500/50"
                title={`Currency: ${currentCurrency.code} (${currentCurrency.symbol})`}
              >
                <span>{currentCurrency.flag}</span>
              </button>
            )}

            {/* Currency Dropdown Popover */}
            {currencyDropdownOpen && (
              <div
                className={`absolute bottom-full mb-2 w-72 glass-panel bg-white/98 dark:bg-stone-900/98 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl p-2.5 z-50 max-h-80 overflow-hidden flex flex-col backdrop-blur-2xl ${
                  isCollapsed ? 'left-0' : 'left-0 right-0'
                }`}
              >
                <div className="px-2 pb-2 text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-emerald-600" />
                    Select Global Currency
                  </span>
                  <span className="text-emerald-600 font-bold">{SUPPORTED_CURRENCIES.length} listed</span>
                </div>

                <div className="pt-2 pb-1 px-1">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={currencySearch}
                      onChange={(e) => setCurrencySearch(e.target.value)}
                      placeholder="Search country or code..."
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto max-h-56 divide-y divide-stone-100/60 dark:divide-stone-800/60 scrollbar-thin mt-1">
                  {filteredCurrencies.map((curr) => {
                    const isSelected = currentCurrency.code === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => {
                          onCurrencyChange(curr);
                          setCurrencyDropdownOpen(false);
                          setCurrencySearch('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-emerald-500/15 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100/80 dark:hover:bg-stone-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg leading-none">{curr.flag}</span>
                          <div>
                            <div className="font-bold text-stone-900 dark:text-white">
                              {curr.code} <span className="text-emerald-600 font-mono">({curr.symbol})</span>
                            </div>
                            <div className="text-[10px] text-stone-400 truncate max-w-[145px]">{curr.country}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher in Sidebar */}
          {!isCollapsed ? (
            <div>
              <div className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5 px-1 flex items-center justify-between">
                <span>Color Accent</span>
                <span className="capitalize text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                  {currentTheme}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-xl border border-stone-200/90 dark:border-stone-700">
                {themeOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onThemeChange(t.id)}
                    className={`flex items-center justify-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentTheme === t.id
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs border border-stone-200/90 dark:border-stone-700'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                    title={`${t.label} Theme`}
                  >
                    <span>{t.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const nextTheme: Record<ThemeMode, ThemeMode> = {
                    emerald: 'midnight',
                    midnight: 'ocean',
                    ocean: 'solar',
                    solar: 'emerald',
                  };
                  onThemeChange(nextTheme[currentTheme]);
                }}
                className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm shadow-2xs cursor-pointer hover:border-emerald-500/50"
                title={`Theme: ${currentTheme} (Click to toggle)`}
              >
                {themeOptions.find((t) => t.id === currentTheme)?.icon || '🌿'}
              </button>
            </div>
          )}

          {/* User Profile Teaser Footer in Sidebar */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-stone-800/90 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/90 dark:border-stone-700 transition-all cursor-pointer text-left shadow-2xs group ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
            title="Open Eco Passport & Profile"
          >
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/60"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full" />
            </div>

            {!isCollapsed && (
              <div className="truncate flex-1">
                <div className="text-xs font-black text-stone-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                  Aditya Gupta
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  <span>Verified Champion</span>
                </div>
              </div>
            )}

            {!isCollapsed && (
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
