import React, { useState, useEffect, useRef } from 'react';
import { 
  Recycle, 
  Menu, 
  X, 
  PlusCircle, 
  Truck, 
  BarChart3, 
  GraduationCap, 
  Calculator, 
  Sparkles,
  HelpCircle,
  PhoneCall,
  Store,
  User,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';
import { CurrencyInfo, SUPPORTED_CURRENCIES } from '../utils/currency';
import { ThemeMode, THEME_OPTIONS } from '../utils/theme';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenListingModal: () => void;
  onOpenPickupModal: () => void;
  userListingsCount: number;
  userPickupsCount: number;
  currentCurrency: CurrencyInfo;
  onCurrencyChange: (currency: CurrencyInfo) => void;
  activeTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}


export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenListingModal,
  onOpenPickupModal,
  userListingsCount,
  userPickupsCount,
  currentCurrency,
  onCurrencyChange,
  activeTheme,
  onThemeChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close currency dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'calculator', label: 'Value Calculator', icon: Calculator },
    { id: 'quiz', label: 'Waste Quiz', icon: HelpCircle },
    { id: 'locator', label: 'Recycling Centers', icon: Truck },
    { id: 'education', label: 'Knowledge Hub', icon: GraduationCap },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: userListingsCount + userPickupsCount },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'about', label: 'About Us', icon: Sparkles },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] border-b border-stone-200/70 py-2.5'
          : 'bg-[#FBFBF9]/80 backdrop-blur-md border-b border-stone-200/40 py-3.5'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1 cursor-pointer shrink-0"
            aria-label="Waste2Wealth Home"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-all duration-300">
                <Recycle className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xs opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-stone-900 font-heading">
                  Waste<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">2</span>Wealth
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 text-emerald-800 rounded-full border border-emerald-300/40 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Circular Economy
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block -mt-0.5">
                Waste to Value Economy
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/60 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-sm'
                      : 'text-stone-700 hover:text-emerald-700 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Currency Selector + Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Country / Currency Dropdown (User's direct request) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white/80 hover:bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400 text-stone-800 transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Change currency"
                title="Change Country & Price Currency"
              >
                <span className="text-base">{currentCurrency.flag}</span>
                <span className="hidden sm:inline font-mono font-bold text-stone-900">{currentCurrency.code}</span>
                <span className="text-emerald-700 font-mono font-bold">({currentCurrency.symbol})</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Currency Dropdown Menu */}
              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xl p-2 z-50 max-h-80 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1 flex items-center justify-between">
                    <span>Select Country Currency</span>
                    <Globe className="w-3 h-3 text-emerald-600" />
                  </div>
                  {SUPPORTED_CURRENCIES.map((curr) => {
                    const isSelected = currentCurrency.code === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => {
                          onCurrencyChange(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                            : 'text-stone-700 hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{curr.flag}</span>
                          <div className="text-left leading-tight">
                            <div className="font-bold text-stone-900">
                              {curr.code} <span className="text-emerald-700">({curr.symbol})</span>
                            </div>
                            <div className="text-[10px] text-stone-400">{curr.country}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Theme Selector Dropdown (User's request) */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold bg-white/80 hover:bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400 text-stone-800 transition-all cursor-pointer backdrop-blur-sm"
                aria-label="Change Theme"
                title="Change Eco Theme"
              >
                <span>
                  {activeTheme === 'emerald' && '🌿'}
                  {activeTheme === 'midnight' && '🌙'}
                  {activeTheme === 'ocean' && '🌊'}
                  {activeTheme === 'solar' && '☀️'}
                </span>
                <span className="hidden xl:inline text-[11px] font-semibold">Theme</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1 flex items-center justify-between">
                    <span>Select Color Theme</span>
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                  </div>
                  {THEME_OPTIONS.map((theme) => {
                    const isSelected = activeTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onThemeChange(theme.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                            : 'text-stone-700 hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{theme.icon}</span>
                          <div className="text-left leading-tight">
                            <div className="font-bold text-stone-900">{theme.name}</div>
                            <div className="text-[10px] text-stone-400 truncate max-w-[140px]">{theme.tagline}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={onOpenPickupModal}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-white/80 hover:bg-white border border-stone-200/80 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-sm"
              aria-label="Request Pickup"
            >
              <Truck className="w-3.5 h-3.5 text-teal-600" />
              <span>Book Pickup</span>
            </button>

            {/* Sell Waste Button */}
            <button
              onClick={onOpenListingModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="List Waste for Sale"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Sell Waste</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 lg:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full glass-panel bg-white/95 border-b border-stone-200 shadow-2xl px-4 py-6 max-h-[85vh] overflow-y-auto backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => {
                onOpenListingModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Waste</span>
            </button>
            <button
              onClick={() => {
                onOpenPickupModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Book Pickup</span>
            </button>
          </div>

          {/* Currency pill in mobile menu */}
          <div className="p-3 mb-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <span className="text-xl">{currentCurrency.flag}</span>
              <span>Country Currency: {currentCurrency.code} ({currentCurrency.symbol})</span>
            </div>
            <button
              onClick={() => {
                handleNavClick('profile');
              }}
              className="text-[11px] font-bold text-emerald-700 underline"
            >
              Change
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500 font-medium">
              Waste2Wealth Platform • Accelerating Zero-Waste Economies
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
