import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Tag, 
  CheckCircle, 
  AlertCircle,
  X,
  Phone,
  Mail,
  User,
  ArrowUpDown,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { WasteListing, WasteCategory } from '../types';
import { formatCurrency } from '../utils/calculator';
import { CurrencyInfo, CurrencyService } from '../utils/currency';
import confetti from 'canvas-confetti';

interface MarketplaceSectionProps {
  listings: WasteListing[];
  onAddListing: (listing: WasteListing) => void;
  onDeleteListing: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  currentCurrency: CurrencyInfo;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  listings,
  onAddListing,
  onDeleteListing,
  onToggleStatus,
  isCreateModalOpen,
  setIsCreateModalOpen,
  currentCurrency,
}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'qty-desc'>('newest');

  // Contact modal state
  const [contactingListing, setContactingListing] = useState<WasteListing | null>(null);
  const [buyerMessage, setBuyerMessage] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // New Listing Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plastic' as WasteCategory,
    subType: 'PET Bottles / Containers',
    quantity: 50,
    unit: 'kg' as 'kg' | 'tons' | 'units',
    pricePerUnit: 0.50,
    location: '',
    city: 'Seattle',
    pincode: '98101',
    sellerName: 'Green Enterprise',
    sellerPhone: '+1 (555) 778-9900',
    sellerEmail: 'contact@enterprise.eco',
    description: '',
    condition: 'Sorted & Cleaned' as WasteListing['condition'],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const categories: Array<'All' | WasteCategory> = [
    'All',
    'Plastic',
    'Paper',
    'Metal',
    'E-waste',
    'Organic',
    'Textile',
  ];

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        const matchesCondition =
          selectedCondition === 'All' || item.condition === selectedCondition;
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesCondition && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'price-asc') {
          return a.pricePerUnit - b.pricePerUnit;
        }
        if (sortBy === 'price-desc') {
          return b.pricePerUnit - a.pricePerUnit;
        }
        if (sortBy === 'qty-desc') {
          return b.quantity - a.quantity;
        }
        return 0;
      });
  }, [listings, selectedCategory, selectedCondition, searchQuery, sortBy]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.location.trim()) errors.location = 'Address/Facility location is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim()) errors.pincode = 'Postal code / PIN is required';
    if (!formData.sellerName.trim()) errors.sellerName = 'Seller name is required';
    if (!formData.sellerPhone.trim()) errors.sellerPhone = 'Contact phone is required';
    if (!formData.description.trim()) errors.description = 'Provide a brief description of the material';
    if (formData.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
    if (formData.pricePerUnit <= 0) errors.pricePerUnit = 'Price must be greater than 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const totalPrice = Number((formData.quantity * formData.pricePerUnit).toFixed(2));
    
    // Choose nice contextual image
    const imageMap: Record<WasteCategory, string> = {
      Plastic: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      Paper: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      Metal: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      'E-waste': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      Organic: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      Textile: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    };

    const newListing: WasteListing = {
      id: `w2w-user-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      subType: formData.subType.trim() || formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      pricePerUnit: Number(formData.pricePerUnit),
      totalPrice,
      currency: '$',
      location: formData.location.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      sellerName: formData.sellerName.trim(),
      sellerPhone: formData.sellerPhone.trim(),
      sellerEmail: formData.sellerEmail.trim() || 'seller@waste2wealth.demo',
      description: formData.description.trim(),
      condition: formData.condition,
      imageUrl: imageMap[formData.category],
      createdAt: new Date().toISOString(),
      isUserCreated: true,
      status: 'Available',
    };

    onAddListing(newListing);
    setIsCreateModalOpen(false);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    setNotification(`Listing "${newListing.title}" successfully published to the marketplace!`);
    setTimeout(() => setNotification(null), 5000);

    // Reset form
    setFormData({
      title: '',
      category: 'Plastic',
      subType: 'Clean PET Granules',
      quantity: 50,
      unit: 'kg',
      pricePerUnit: 0.50,
      location: '',
      city: 'Seattle',
      pincode: '98101',
      sellerName: 'Green Enterprise',
      sellerPhone: '+1 (555) 778-9900',
      sellerEmail: 'contact@enterprise.eco',
      description: '',
      condition: 'Sorted & Cleaned',
    });
    setFormErrors({});
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactingListing(null);
      setBuyerMessage('');
      setBuyerName('');
      setBuyerPhone('');
    }, 2500);
  };

  const categoryColor = (cat: WasteCategory) => {
    switch (cat) {
      case 'Plastic':
        return 'bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-blue-500/20 text-blue-900 border-blue-300/80 shadow-2xs';
      case 'Paper':
        return 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/20 text-amber-900 border-amber-300/80 shadow-2xs';
      case 'Metal':
        return 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-indigo-500/20 text-indigo-900 border-indigo-300/80 shadow-2xs';
      case 'E-waste':
        return 'bg-gradient-to-r from-purple-500/15 via-fuchsia-500/15 to-purple-500/20 text-purple-900 border-purple-300/80 shadow-2xs';
      case 'Organic':
        return 'bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/20 text-emerald-900 border-emerald-300/80 shadow-2xs';
      case 'Textile':
        return 'bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-rose-500/20 text-rose-900 border-rose-300/80 shadow-2xs';
    }
  };

  return (
    <section id="marketplace" className="py-16 md:py-24 bg-[#FBFBF9] scroll-mt-20 relative overflow-hidden">
      {/* Subtle ambient blur glow */}
      <div className="absolute top-40 right-0 w-[450px] h-[450px] glow-spot-emerald -z-10 pointer-events-none rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] glow-spot-cyan -z-10 pointer-events-none rounded-full blur-3xl opacity-50" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs border border-emerald-300/50">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Secondary Feedstock</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading tracking-tight">
              Waste Marketplace
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Buy and sell segregated recyclable waste, industrial scrap, and recovered commodities. 
              Eliminate middlemen and direct secondary raw materials back into manufacturing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>List Waste for Sale</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {notification && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-emerald-900">{notification}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter & Search Bar with Glassmorphic styling */}
        <div className="mt-8 glass-panel p-5 rounded-3xl border border-white/80 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by material, grade, city, or seller..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-2xs placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none pl-9 pr-8 py-2.5 rounded-2xl border border-stone-200/90 text-xs sm:text-sm font-bold text-stone-700 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
                >
                  <option value="newest">Sort: Recently Added</option>
                  <option value="price-asc">Sort: Price (Low to High)</option>
                  <option value="price-desc">Sort: Price (High to Low)</option>
                  <option value="qty-desc">Sort: Quantity (Highest)</option>
                </select>
                <ArrowUpDown className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Condition Filter */}
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="pl-3 pr-8 py-2.5 rounded-2xl border border-stone-200/90 text-xs sm:text-sm font-bold text-stone-700 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
              >
                <option value="All">All Conditions</option>
                <option value="Sorted & Cleaned">Sorted & Cleaned</option>
                <option value="Baled">Baled</option>
                <option value="Industrial Scrap">Industrial Scrap</option>
                <option value="Raw / Unsorted">Raw / Unsorted</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills with Jewel Colors */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-500 font-bold mr-1 shrink-0 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter Stream:
            </span>
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
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                    isSelected
                      ? `${activeGradient} shadow-sm`
                      : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white border border-stone-200/60 shadow-2xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Listings Counter Bar */}
        <div className="mt-6 flex items-center justify-between text-xs text-stone-500 font-medium px-1">
          <span>
            Showing <strong className="text-stone-900">{filteredListings.length}</strong> of{' '}
            {listings.length} available waste lots
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedCondition !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedCondition('All');
              }}
              className="text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="mt-8 text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">No matching waste listings found</h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mt-1">
              Try adjusting your search criteria or be the first to list recyclable material in this category.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedCondition('All');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Create Listing
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const isSold = item.status === 'Sold';
              return (
                <div
                  key={item.id}
                  className={`group glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col justify-between border ${
                    item.isUserCreated
                      ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                      : 'border-white/80'
                  } ${isSold ? 'opacity-70' : ''}`}
                >
                  {/* Top Image & Badges */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span
                        className={`px-3 py-1 rounded-xl text-[10px] font-extrabold tracking-wide uppercase border backdrop-blur-md ${categoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-md shadow-2xs">
                        {item.condition}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {item.isUserCreated && (
                        <span className="px-3 py-1 rounded-xl text-[10px] font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/25">
                          My Listing
                        </span>
                      )}
                      {isSold && (
                        <span className="px-3 py-1 rounded-xl text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider shadow-sm">
                          Sold Out
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                      <div className="flex items-center gap-1.5 bg-stone-900/70 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{item.city}</span>
                      </div>
                      <div className="bg-stone-900/70 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs font-semibold">
                        {item.subType}
                      </div>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-stone-900 text-base leading-snug font-heading group-hover:text-emerald-700 transition-colors">
                          {item.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Pricing & Quantity Box with Glass finish */}
                      <div className="mt-4 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-2xs flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            Lot Quantity
                          </div>
                          <div className="text-sm font-black text-stone-900 font-heading">
                            {item.quantity.toLocaleString()} {item.unit}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            Price / {item.unit}
                          </div>
                          <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700 font-heading">
                            {CurrencyService.formatUSD(item.pricePerUnit, currentCurrency)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                        <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                          <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.sellerName}</span>
                        </div>
                        <span className="font-bold text-stone-800">
                          Total: {CurrencyService.formatUSD(item.totalPrice, currentCurrency)}
                        </span>
                      </div>

                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-5 pt-3.5 border-t border-stone-200/60 flex items-center gap-2">
                      {item.isUserCreated ? (
                        <>
                          <button
                            onClick={() => onToggleStatus(item.id)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                              isSold
                                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                            }`}
                          >
                            {isSold ? 'Mark Available' : 'Mark as Sold'}
                          </button>
                          <button
                            onClick={() => onDeleteListing(item.id)}
                            className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                            aria-label={`Delete listing ${item.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setContactingListing(item)}
                          disabled={isSold}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            isSold
                              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                              : 'bg-stone-900 hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-stone-900/10 hover:shadow-emerald-700/20 active:scale-95'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isSold ? 'Listing Sold' : 'Contact Seller / Bid'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE NEW LISTING MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-heading">
                    List Recyclable Waste
                  </h3>
                  <p className="text-xs text-stone-500">
                    Connect directly with industrial buyers and certified recyclers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Clean Baled PET Drink Bottles, Uncontaminated"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    formErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                />
                {formErrors.title && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as WasteCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Plastic">Plastic</option>
                    <option value="Paper">Paper</option>
                    <option value="Metal">Metal</option>
                    <option value="E-waste">E-waste</option>
                    <option value="Organic">Organic</option>
                    <option value="Textile">Textile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Material Grade / Subtype
                  </label>
                  <input
                    type="text"
                    value={formData.subType}
                    onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                    placeholder="e.g., PET Flakes / HDPE / OCC 11"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unit: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price per Unit ($) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerUnit: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Total Estimated: {formatCurrency(formData.quantity * formData.pricePerUnit)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        condition: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Sorted & Cleaned">Sorted & Cleaned</option>
                    <option value="Baled">Baled</option>
                    <option value="Industrial Scrap">Industrial Scrap</option>
                    <option value="Raw / Unsorted">Raw / Unsorted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Facility / Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., 200 Industrial Parkway"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      formErrors.location ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Seller / Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    value={formData.sellerPhone}
                    onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.sellerEmail}
                    onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description & Quality Notes *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail moisture levels, contamination rate, baling specs, and loading equipment available."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    formErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT SELLER MODAL */}
      {contactingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-heading">
                  Inquire / Bid on Feedstock Lot
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-xs sm:max-w-sm">
                  {contactingListing.title}
                </p>
              </div>
              <button
                onClick={() => setContactingListing(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900">Inquiry Sent to Seller!</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Seller <strong>{contactingListing.sellerName}</strong> has received your contact details and bid request. They will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="mt-4 space-y-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Seller:</span>
                    <strong className="text-stone-900">{contactingListing.sellerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Lot Rate:</span>
                    <strong className="text-emerald-700 font-semibold">
                      {formatCurrency(contactingListing.pricePerUnit, contactingListing.currency)} / {contactingListing.unit}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Location:</span>
                    <span>{contactingListing.location}, {contactingListing.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Phone:</span>
                    <span className="font-mono">{contactingListing.sellerPhone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name or Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g., Sarah Chen / Cascade Polymer Refiners"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Contact Phone / Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000 or email"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Message or Counter Offer
                  </label>
                  <textarea
                    rows={2}
                    value={buyerMessage}
                    onChange={(e) => setBuyerMessage(e.target.value)}
                    placeholder="Provide your bid price, logistics requirements, or request a material sample."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setContactingListing(null)}
                    className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
                  >
                    Send Direct Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
