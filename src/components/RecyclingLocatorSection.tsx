import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Truck, 
  Clock, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Calendar, 
  ShieldCheck,
  Building2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { RecyclingCenter, PickupRequest, WasteCategory } from '../types';
import { SEED_RECYCLING_CENTERS } from '../utils/seedData';
import confetti from 'canvas-confetti';

interface RecyclingLocatorSectionProps {
  onAddPickupRequest: (request: PickupRequest) => void;
  isPickupModalOpen: boolean;
  setIsPickupModalOpen: (open: boolean) => void;
}

export const RecyclingLocatorSection: React.FC<RecyclingLocatorSectionProps> = ({
  onAddPickupRequest,
  isPickupModalOpen,
  setIsPickupModalOpen,
}) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>('All');
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);

  // Active view tab: "centers" | "pickup"
  const [activeTab, setActiveTab] = useState<'centers' | 'pickup'>('centers');

  // Pickup Form State
  const [pickupForm, setPickupForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Seattle',
    pincode: '98101',
    wasteCategory: 'E-waste' as WasteCategory,
    estimatedQuantityKg: 35,
    pickupDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '09:00 AM - 12:00 PM',
    specialInstructions: '',
  });
  const [pickupErrors, setPickupErrors] = useState<Record<string, string>>({});
  const [submittedPickup, setSubmittedPickup] = useState<PickupRequest | null>(null);

  const materialFilters: Array<'All' | WasteCategory> = [
    'All',
    'Plastic',
    'Paper',
    'Metal',
    'E-waste',
    'Organic',
    'Textile',
  ];

  // Filter centers
  const filteredCenters = useMemo(() => {
    return SEED_RECYCLING_CENTERS.filter((center) => {
      const matchesSearch =
        searchLocation === '' ||
        center.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
        center.pincode.includes(searchLocation) ||
        center.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        center.address.toLowerCase().includes(searchLocation.toLowerCase());

      const matchesMaterial =
        selectedMaterialFilter === 'All' ||
        center.acceptedCategories.includes(selectedMaterialFilter as WasteCategory);

      return matchesSearch && matchesMaterial;
    });
  }, [searchLocation, selectedMaterialFilter]);

  const validatePickupForm = () => {
    const errors: Record<string, string> = {};
    if (!pickupForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!pickupForm.phone.trim()) errors.phone = 'Valid phone number is required';
    if (!pickupForm.email.trim() || !pickupForm.email.includes('@')) errors.email = 'Valid email address is required';
    if (!pickupForm.address.trim()) errors.address = 'Street address is required';
    if (!pickupForm.city.trim()) errors.city = 'City is required';
    if (!pickupForm.pincode.trim()) errors.pincode = 'Postal / PIN code is required';
    if (!pickupForm.pickupDate) errors.pickupDate = 'Select a preferred date';
    if (pickupForm.estimatedQuantityKg <= 0) errors.estimatedQuantityKg = 'Enter approximate kilograms';
    setPickupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePickupForm()) return;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `W2W-PK-${randomSuffix}`;

    const newRequest: PickupRequest = {
      id: `pk-${Date.now()}`,
      trackingId,
      fullName: pickupForm.fullName.trim(),
      phone: pickupForm.phone.trim(),
      email: pickupForm.email.trim(),
      address: pickupForm.address.trim(),
      city: pickupForm.city.trim(),
      pincode: pickupForm.pincode.trim(),
      wasteCategory: pickupForm.wasteCategory,
      estimatedQuantityKg: Number(pickupForm.estimatedQuantityKg),
      pickupDate: pickupForm.pickupDate,
      timeSlot: pickupForm.timeSlot,
      specialInstructions: pickupForm.specialInstructions.trim(),
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    };

    onAddPickupRequest(newRequest);
    setSubmittedPickup(newRequest);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  };

  const handleCloseSuccess = () => {
    setSubmittedPickup(null);
    setIsPickupModalOpen(false);
    // Reset form defaults
    setPickupForm({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: 'Seattle',
      pincode: '98101',
      wasteCategory: 'E-waste',
      estimatedQuantityKg: 35,
      pickupDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: '09:00 AM - 12:00 PM',
      specialInstructions: '',
    });
    setPickupErrors({});
  };

  return (
    <section id="locator" className="py-20 md:py-28 relative overflow-hidden bg-stone-100/40 scroll-mt-20 border-b border-stone-200/80">
      {/* Ambient background glows */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full glow-spot-emerald pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full glow-spot-cyan pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full glow-spot-amber pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-300/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Waste Logistics Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 font-heading tracking-tight">
              Recycling Centers & On-Demand Pickup
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl font-medium">
              Locate certified regional material recovery centers or book a certified doorstep 
              pickup for residential, campus, and industrial recyclables.
            </p>
          </div>

          {/* Toggle between directory and direct form */}
          <div className="flex items-center gap-2 glass-panel p-1.5 rounded-2xl border border-white/80 shrink-0 shadow-sm">
            <button
              onClick={() => setActiveTab('centers')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'centers'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Find Centers
            </button>
            <button
              onClick={() => setActiveTab('pickup')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pickup'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/20'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Book Doorstep Pickup
            </button>
          </div>
        </div>

        {/* TAB 1: RECYCLING CENTERS DIRECTORY */}
        {activeTab === 'centers' && (
          <div className="mt-8 space-y-6">
            {/* Search and Material filter */}
            <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/80 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search city (e.g. Seattle, Austin, NY) or PIN..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80 backdrop-blur-sm"
                />
                {searchLocation && (
                  <button
                    onClick={() => setSearchLocation('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Material filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
                <span className="text-stone-500 font-bold mr-1 shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-emerald-600" /> Streams:
                </span>
                {materialFilters.map((mat) => {
                  const isSelected = selectedMaterialFilter === mat;
                  let colorClass = isSelected
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white/70 text-stone-700 hover:bg-white border border-stone-200/60';

                  if (isSelected && mat === 'Plastic') colorClass = 'bg-cyan-600 text-white shadow-cyan-600/20';
                  if (isSelected && mat === 'Paper') colorClass = 'bg-amber-600 text-white shadow-amber-600/20';
                  if (isSelected && mat === 'Metal') colorClass = 'bg-indigo-600 text-white shadow-indigo-600/20';
                  if (isSelected && mat === 'E-waste') colorClass = 'bg-purple-600 text-white shadow-purple-600/20';
                  if (isSelected && mat === 'Organic') colorClass = 'bg-emerald-600 text-white shadow-emerald-600/20';
                  if (isSelected && mat === 'Textile') colorClass = 'bg-rose-600 text-white shadow-rose-600/20';

                  return (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterialFilter(mat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer shadow-2xs ${colorClass}`}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results count & Demo Data notice */}
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
              <span>
                Found <strong className="text-stone-900 font-black">{filteredCenters.length}</strong> certified demo facilities
              </span>
              <span className="glass-pill text-amber-900 px-3 py-1 rounded-full border border-amber-300/80 text-[11px] font-bold shadow-2xs">
                Verified Demo Network
              </span>
            </div>

            {/* Centers Grid */}
            {filteredCenters.length === 0 ? (
              <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-white/80">
                <p className="text-stone-800 font-black text-base font-heading">No recycling centers found matching your query</p>
                <p className="text-stone-500 text-xs mt-1.5 font-medium">Try typing "Seattle", "Austin", "Chicago" or resetting the stream filter.</p>
                <button
                  onClick={() => {
                    setSearchLocation('');
                    setSelectedMaterialFilter('All');
                  }}
                  className="mt-5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
                  <div
                    key={center.id}
                    className="glass-panel glass-panel-hover rounded-3xl border border-white/80 p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg border border-emerald-300/80 mb-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            Verified Demo Hub
                          </span>
                          <h3 className="font-black text-stone-900 text-lg font-heading leading-snug">
                            {center.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-300/60 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span className="text-xs font-black text-stone-900">{center.rating}</span>
                          <span className="text-[10px] text-stone-500 font-medium">({center.reviewsCount})</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2.5 text-xs text-stone-600 font-medium">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{center.address}, {center.city} (PIN: {center.pincode})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{center.hours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-cyan-600 shrink-0" />
                          <span className="font-mono text-[11px] font-bold text-stone-700">{center.phone}</span>
                        </div>
                      </div>

                      {/* Accepted Materials Badges with stream colors */}
                      <div className="mt-5 pt-3.5 border-t border-stone-200/60">
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                          Accepted Feedstock Streams:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {center.acceptedCategories.map((cat) => {
                            let pillColor = 'bg-stone-100 text-stone-700 border-stone-200';
                            if (cat === 'Plastic') pillColor = 'bg-cyan-50 text-cyan-900 border-cyan-200';
                            if (cat === 'Paper') pillColor = 'bg-amber-50 text-amber-900 border-amber-200';
                            if (cat === 'Metal') pillColor = 'bg-indigo-50 text-indigo-900 border-indigo-200';
                            if (cat === 'E-waste') pillColor = 'bg-purple-50 text-purple-900 border-purple-200';
                            if (cat === 'Organic') pillColor = 'bg-emerald-50 text-emerald-900 border-emerald-200';
                            if (cat === 'Textile') pillColor = 'bg-rose-50 text-rose-900 border-rose-200';

                            return (
                              <span
                                key={cat}
                                className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md border shadow-2xs ${pillColor}`}
                              >
                                {cat}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-6 pt-3.5 border-t border-stone-200/60 flex items-center justify-between">
                      <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                        {center.hasCommercialPickup && (
                          <span className="inline-flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" /> Doorstep Available
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setPickupForm((prev) => ({
                            ...prev,
                            city: center.city,
                            pincode: center.pincode,
                          }));
                          setActiveTab('pickup');
                        }}
                        className="text-xs font-black text-stone-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Dispatch Pickup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REQUEST PICKUP FORM */}
        {activeTab === 'pickup' && (
          <div className="mt-8 max-w-3xl mx-auto glass-panel rounded-3xl border border-white/80 shadow-xl p-6 sm:p-10 backdrop-blur-xl">
            <div className="flex items-center gap-3.5 pb-6 border-b border-stone-200/70">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-heading">
                  Schedule On-Demand Recyclable Pickup
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  Our certified zero-emission logistics crew weighs, audits, and manifests your waste on site.
                </p>
              </div>
            </div>

            <form onSubmit={handlePickupSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={pickupForm.fullName}
                    onChange={(e) => setPickupForm({ ...pickupForm, fullName: e.target.value })}
                    placeholder="e.g. Jordan Smith"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      pickupErrors.fullName ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                  {pickupErrors.fullName && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{pickupErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={pickupForm.phone}
                    onChange={(e) => setPickupForm({ ...pickupForm, phone: e.target.value })}
                    placeholder="+1 (555) 345-6789"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      pickupErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                  {pickupErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">{pickupErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Email Address * (For Confirmation & Real-Time Tracking)
                </label>
                <input
                  type="email"
                  value={pickupForm.email}
                  onChange={(e) => setPickupForm({ ...pickupForm, email: e.target.value })}
                  placeholder="jordan.smith@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    pickupErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                {pickupErrors.email && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">{pickupErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Pickup Street Address *
                </label>
                <input
                  type="text"
                  value={pickupForm.address}
                  onChange={(e) => setPickupForm({ ...pickupForm, address: e.target.value })}
                  placeholder="Apartment / Suite, Building name, Street"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    pickupErrors.address ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200/90 bg-white/80'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                {pickupErrors.address && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">{pickupErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={pickupForm.city}
                    onChange={(e) => setPickupForm({ ...pickupForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Postal Code / PIN *
                  </label>
                  <input
                    type="text"
                    value={pickupForm.pincode}
                    onChange={(e) => setPickupForm({ ...pickupForm, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Primary Waste Stream *
                  </label>
                  <select
                    value={pickupForm.wasteCategory}
                    onChange={(e) =>
                      setPickupForm({
                        ...pickupForm,
                        wasteCategory: e.target.value as WasteCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Plastic">Plastic (PET / HDPE / Rigid)</option>
                    <option value="Paper">Paper & Corrugated Cardboard (OCC)</option>
                    <option value="Metal">Scrap Metal, Aluminum & Copper</option>
                    <option value="E-waste">E-waste, Circuit Boards & Batteries</option>
                    <option value="Organic">Organic Food / Compost Waste</option>
                    <option value="Textile">Textiles & Apparel Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Approximate Weight (kg) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={pickupForm.estimatedQuantityKg}
                    onChange={(e) =>
                      setPickupForm({
                        ...pickupForm,
                        estimatedQuantityKg: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Preferred Pickup Date *
                  </label>
                  <input
                    type="date"
                    value={pickupForm.pickupDate}
                    onChange={(e) => setPickupForm({ ...pickupForm, pickupDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Time Window *
                  </label>
                  <select
                    value={pickupForm.timeSlot}
                    onChange={(e) => setPickupForm({ ...pickupForm, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="08:00 AM - 11:00 AM">08:00 AM - 11:00 AM (Morning)</option>
                    <option value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM (Midday)</option>
                    <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Afternoon)</option>
                    <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Access Notes / Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={pickupForm.specialInstructions}
                  onChange={(e) =>
                    setPickupForm({ ...pickupForm, specialInstructions: e.target.value })
                  }
                  placeholder="e.g. Loading dock in rear alley, elevator access available, boxed and labeled."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-stone-200/70 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('centers')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200/60 cursor-pointer"
                >
                  Back to Facilities
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer"
                >
                  Confirm Pickup Dispatch
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* POPUP MODAL ON SUBMITTED PICKUP */}
      {(submittedPickup || isPickupModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            {submittedPickup ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    Pickup Scheduled Successfully
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 font-heading mt-2">
                    Dispatch Order Confirmed!
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Your recyclable waste pickup has been registered with our regional fleet.
                  </p>
                </div>

                {/* Tracking ID Badge */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-left text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
                    <span className="text-stone-500">Tracking Reference:</span>
                    <strong className="text-emerald-700 font-mono text-sm">
                      {submittedPickup.trackingId}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Assigned Facility:</span>
                    <span className="font-semibold text-stone-900">{submittedPickup.city} Eco-Hub</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Scheduled Date:</span>
                    <span className="font-semibold text-stone-900">
                      {submittedPickup.pickupDate} ({submittedPickup.timeSlot})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Material & Weight:</span>
                    <span className="font-semibold text-stone-900">
                      {submittedPickup.estimatedQuantityKg} kg of {submittedPickup.wasteCategory}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handleCloseSuccess}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm cursor-pointer"
                  >
                    View in User Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-base font-bold text-stone-900 font-heading">
                    Quick Pickup Dispatch
                  </h3>
                  <button
                    onClick={() => setIsPickupModalOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="py-4">
                  <p className="text-xs text-stone-600 mb-4">
                    Switching to full booking form in the Recycling section.
                  </p>
                  <button
                    onClick={() => {
                      setIsPickupModalOpen(false);
                      setActiveTab('pickup');
                      const el = document.getElementById('locator');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
                  >
                    Continue to Request Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
