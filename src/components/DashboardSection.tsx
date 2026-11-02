import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Truck, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Leaf, 
  PackageCheck, 
  AlertTriangle,
  XCircle,
  ExternalLink,
  Coins
} from 'lucide-react';
import { WasteListing, PickupRequest, CurrencyInfo } from '../types';
import { formatCurrency } from '../utils/calculator';
import { CurrencyService } from '../utils/currency';

interface DashboardSectionProps {
  userListings: WasteListing[];
  pickupRequests: PickupRequest[];
  onDeleteListing: (id: string) => void;
  onToggleListingStatus: (id: string) => void;
  onCancelPickup: (id: string) => void;
  onDeletePickup: (id: string) => void;
  onOpenCreateListing: () => void;
  onOpenCreatePickup: () => void;
  currentCurrency?: CurrencyInfo;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  userListings,
  pickupRequests,
  onDeleteListing,
  onToggleListingStatus,
  onCancelPickup,
  onDeletePickup,
  onOpenCreateListing,
  onOpenCreatePickup,
  currentCurrency,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'pickups'>('listings');

  // Dynamic user calculations
  const stats = useMemo(() => {
    // Total waste listed in kg
    const totalListedKg = userListings.reduce((sum, item) => {
      const mult = item.unit === 'tons' ? 1000 : 1;
      return sum + item.quantity * mult;
    }, 0);

    // Total value of listings
    const totalListedValue = userListings.reduce((sum, item) => sum + item.totalPrice, 0);

    // Total pickups weight
    const totalPickupKg = pickupRequests.reduce(
      (sum, p) => (p.status !== 'Cancelled' ? sum + p.estimatedQuantityKg : sum),
      0
    );

    // Active pickups
    const activePickupsCount = pickupRequests.filter(
      (p) => p.status === 'Scheduled' || p.status === 'Crew Assigned'
    ).length;

    // Carbon offset estimate (~1.8 kg CO2e per kg diverted)
    const totalDivertedKg = totalListedKg + totalPickupKg;
    const estimatedCo2OffsetKg = Math.round(totalDivertedKg * 1.85);

    return {
      totalListedKg,
      totalListedValue,
      totalPickupKg,
      activePickupsCount,
      totalPickupsCount: pickupRequests.length,
      listingsCount: userListings.length,
      estimatedCo2OffsetKg,
    };
  }, [userListings, pickupRequests]);

  const getStatusBadge = (status: PickupRequest['status']) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Scheduled
          </span>
        );
      case 'Crew Assigned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Crew Assigned
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 line-through">
            Cancelled
          </span>
        );
    }
  };

  return (
    <section id="dashboard" className="py-20 md:py-28 relative overflow-hidden bg-stone-50/70 scroll-mt-20">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full glow-spot-emerald pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full glow-spot-purple pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full glow-spot-cyan pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-300/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Circular Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 font-heading tracking-tight">
              User Activity Dashboard
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl font-medium">
              Track your listed secondary feedstock, manage scheduled collection pick-up dispatches, 
              and verify your accumulated ecological contribution.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateListing}
              className="px-5 py-2.5 rounded-xl glass-panel border border-white/80 text-xs font-bold text-stone-800 hover:bg-white shadow-sm cursor-pointer flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>List Waste</span>
            </button>
            <button
              onClick={onOpenCreatePickup}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20 cursor-pointer flex items-center gap-2 transition-all active:scale-95"
            >
              <Truck className="w-4 h-4" />
              <span>New Pickup</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards with Radiant Glassmorphism */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Waste Listed */}
          <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md hover:shadow-lg transition-all flex items-center gap-4 bg-gradient-to-br from-cyan-50/60 via-white/70 to-blue-50/40">
            <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 border border-cyan-300/60 text-cyan-700 flex items-center justify-center shrink-0 shadow-2xs">
              <PackageCheck className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Feedstock Listed</div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
                {stats.totalListedKg.toLocaleString()} <span className="text-xs font-bold text-stone-400">kg</span>
              </div>
              <div className="text-[11px] text-cyan-700 font-semibold mt-0.5">
                Across {stats.listingsCount} active listings
              </div>
            </div>
          </div>

          {/* Total Estimated Value */}
          <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md hover:shadow-lg transition-all flex items-center gap-4 bg-gradient-to-br from-emerald-50/70 via-white/70 to-teal-50/40">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-300/60 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Coins className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Market Value</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-heading">
                {CurrencyService.formatUSD(stats.totalListedValue, currentCurrency)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Potential circular revenue
              </div>
            </div>
          </div>

          {/* Total Pickup Requests */}
          <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md hover:shadow-lg transition-all flex items-center gap-4 bg-gradient-to-br from-amber-50/60 via-white/70 to-orange-50/40">
            <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-300/60 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Doorstep Pickups</div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-heading">
                {stats.totalPickupsCount}{' '}
                <span className="text-[11px] font-black text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-lg ml-1">
                  {stats.activePickupsCount} Active
                </span>
              </div>
              <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                {stats.totalPickupKg.toLocaleString()} kg manifest volume
              </div>
            </div>
          </div>

          {/* Lifetime CO2 Diverted */}
          <div className="glass-panel p-5.5 rounded-3xl border border-white/80 shadow-md hover:shadow-lg transition-all flex items-center gap-4 bg-gradient-to-br from-purple-50/60 via-white/70 to-indigo-50/40">
            <div className="w-13 h-13 rounded-2xl bg-purple-500/10 border border-purple-300/60 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Leaf className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">CO₂e Avoided</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-950 font-heading">
                {stats.estimatedCo2OffsetKg.toLocaleString()} <span className="text-xs font-bold text-stone-400">kg</span>
              </div>
              <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
                Municipal diversion offset
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher for User Records */}
        <div className="mt-10 flex items-center gap-3 border-b border-stone-200/80 pb-3">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-stone-900 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            My Feedstock Listings ({userListings.length})
          </button>

          <button
            onClick={() => setActiveTab('pickups')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'pickups'
                ? 'bg-stone-900 text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            My Collection Pickups ({pickupRequests.length})
          </button>
        </div>

        {/* TAB CONTENT: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="mt-6">
            {userListings.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900">No marketplace listings created yet</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Post your recyclable scrap, baled cardboard, or electronic equipment to connect directly with industrial buyers.
                </p>
                <button
                  onClick={onOpenCreateListing}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200 shadow-xs">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-[#FAF8F5] text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5">Listing Title</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Lot Quantity</th>
                      <th className="px-4 py-3.5">Unit Price</th>
                      <th className="px-4 py-3.5">Total Value</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {userListings.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-stone-900">{item.title}</div>
                          <div className="text-[10px] text-stone-400">
                            {item.city} • {item.subType}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 font-semibold text-stone-800 text-[10px]">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-stone-900">
                          {item.quantity.toLocaleString()} {item.unit}
                        </td>
                        <td className="px-4 py-4 font-semibold text-stone-700">
                          {CurrencyService.formatUSD(item.pricePerUnit, currentCurrency)}
                        </td>
                        <td className="px-4 py-4 font-extrabold text-emerald-700 font-heading">
                          {CurrencyService.formatUSD(item.totalPrice, currentCurrency)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onToggleListingStatus(item.id)}
                              className="px-2.5 py-1 rounded-lg border border-stone-200 text-[11px] font-semibold text-stone-700 hover:bg-stone-100"
                            >
                              {item.status === 'Available' ? 'Mark Sold' : 'Reactivate'}
                            </button>
                            <button
                              onClick={() => onDeleteListing(item.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              aria-label={`Delete listing ${item.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: MY PICKUPS */}
        {activeTab === 'pickups' && (
          <div className="mt-6">
            {pickupRequests.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900">No pickup requests scheduled</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Book a doorstep collection for recyclable e-waste, plastics, or cardboard right from your location.
                </p>
                <button
                  onClick={onOpenCreatePickup}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  Schedule First Pickup
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200 shadow-xs">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-[#FAF8F5] text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5">Tracking ID</th>
                      <th className="px-4 py-3.5">Category & Weight</th>
                      <th className="px-4 py-3.5">Address</th>
                      <th className="px-4 py-3.5">Preferred Date / Slot</th>
                      <th className="px-4 py-3.5">Current Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {pickupRequests.map((pickup) => (
                      <tr key={pickup.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-mono font-bold text-stone-900 text-xs">
                            {pickup.trackingId}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Booked: {new Date(pickup.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-stone-900">{pickup.wasteCategory}</div>
                          <div className="text-[11px] text-emerald-700 font-semibold">
                            ~{pickup.estimatedQuantityKg} kg
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-xs truncate">
                          <div className="truncate text-stone-800">{pickup.address}</div>
                          <div className="text-[10px] text-stone-400">
                            {pickup.city} (PIN: {pickup.pincode})
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-stone-900">{pickup.pickupDate}</div>
                          <div className="text-[10px] text-stone-500">{pickup.timeSlot}</div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(pickup.status)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {pickup.status === 'Scheduled' && (
                              <button
                                onClick={() => onCancelPickup(pickup.id)}
                                className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => onDeletePickup(pickup.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                              aria-label={`Delete pickup record ${pickup.trackingId}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
