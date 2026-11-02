export type { CurrencyInfo } from '../utils/currency';
export type WasteCategory = 'Plastic' | 'Paper' | 'Metal' | 'Organic' | 'E-waste' | 'Textile';

export interface WasteListing {
  id: string;
  title: string;
  category: WasteCategory;
  subType: string;
  quantity: number;
  unit: 'kg' | 'tons' | 'units';
  pricePerUnit: number;
  totalPrice: number;
  currency: string;
  location: string;
  city: string;
  pincode: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  description: string;
  condition: 'Sorted & Cleaned' | 'Baled' | 'Raw / Unsorted' | 'Industrial Scrap';
  imageUrl: string;
  createdAt: string;
  isUserCreated: boolean;
  status: 'Available' | 'Sold';
}

export interface PickupRequest {
  id: string;
  trackingId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  wasteCategory: WasteCategory;
  estimatedQuantityKg: number;
  pickupDate: string;
  timeSlot: string;
  specialInstructions?: string;
  status: 'Scheduled' | 'Crew Assigned' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface RecyclingCenter {
  id: string;
  name: string;
  city: string;
  pincode: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  acceptedCategories: WasteCategory[];
  rating: number;
  reviewsCount: number;
  hasDropOff: boolean;
  hasCommercialPickup: boolean;
  isVerifiedDemo: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: WasteCategory | 'General';
  options: string[];
  correctIndex: number;
  explanation: string;
  ecoTip: string;
}

export interface QuizResult {
  score: number;
  total: number;
  completedAt: string;
  rankTitle: string;
}

export interface CategoryDetail {
  id: WasteCategory;
  name: string;
  iconName: string;
  tagline: string;
  description: string;
  conversionProcess: string;
  valuableProducts: string[];
  preparationTips: string[];
  donts: string[];
  co2PerTon: number; // kg of CO2 saved per ton recycled
  marketDemand: 'Very High' | 'High' | 'Moderate' | 'Growing';
  economicValueRating: string;
}

export interface ValuationMetrics {
  category: WasteCategory;
  subType: string;
  quantityKg: number;
  estimatedMinPrice: number;
  estimatedMaxPrice: number;
  estimatedAvgPrice: number;
  co2SavedKg: number;
  treesEquivalent: number;
  landfillVolumeDivertedM3: number;
  energySavedKwh: number;
  waterSavedLiters: number;
}

export interface UserEcoBadge {
  id: string;
  name: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  preferredCurrency: string;
  organizationType: 'Individual Resident' | 'Commercial Business' | 'Recycling Collector' | 'Industrial Manufacturer';
  avatarUrl: string;
  bio: string;
  ecoLevel: string;
  memberSince: string;
  verifiedStatus: boolean;
  notificationPreferences: {
    emailAlerts: boolean;
    pickupDispatches: boolean;
    priceSurges: boolean;
  };
}

export interface UpcycleBlueprint {
  id: string;
  title: string;
  wasteCategory: WasteCategory;
  sourceFeedstock: string;
  endProduct: string;
  valueMultiplier: number;
  rawCostPerKgUSD: number;
  finishedValuePerKgUSD: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Industrial Scale';
  equipmentNeeded: string[];
  steps: { stage: string; title: string; desc: string }[];
  co2ReductionPercent: number;
  marketDemand: 'High' | 'Very High' | 'Exponential';
  description: string;
  badge: string;
  colorGrad: string;
  isCommunitySubmitted?: boolean;
}
