import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WasteListing, PickupRequest, UpcycleBlueprint, UserProfile } from '../types';

export const DEFAULT_SUPABASE_URL = 'https://sjkoqvjxvnlwzowxpqgy.supabase.co';
export const SUPABASE_PROJECT_REF = 'sjkoqvjxvnlwzowxpqgy';

const STORAGE_KEY_URL = 'w2w_supabase_url';
const STORAGE_KEY_ANON = 'w2w_supabase_anon_key';

let activeClient: SupabaseClient | null = null;
let activeUrl: string = '';
let activeAnonKey: string = '';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  projectRef: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envAnon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

  const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const storedAnon = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;

  const url = storedUrl || envUrl || DEFAULT_SUPABASE_URL;
  const anonKey = storedAnon || envAnon || '';

  return {
    url,
    anonKey,
    projectRef: SUPABASE_PROJECT_REF,
    isConfigured: Boolean(url && anonKey.trim().length > 10),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  }
  activeClient = null; // force re-creation
  activeUrl = '';
  activeAnonKey = '';
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  if (activeClient && activeUrl === config.url && activeAnonKey === config.anonKey) {
    return activeClient;
  }

  try {
    activeClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    activeUrl = config.url;
    activeAnonKey = config.anonKey;
    return activeClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  tablesFound?: string[];
  latencyMs?: number;
}

export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<ConnectionTestResult> {
  const url = customUrl || getSupabaseConfig().url;
  const key = customKey || getSupabaseConfig().anonKey;

  if (!url || !key) {
    return {
      success: false,
      message: 'Both Supabase URL and anon public key are required to test connection.',
    };
  }

  const startTime = Date.now();
  try {
    const testClient = createClient(url, key);
    
    // Attempt to query waste_listings
    const { data, error } = await testClient
      .from('waste_listings')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      // Table might not exist yet (relation "waste_listings" does not exist)
      if (error.code === '42P01' || error.message.includes('relation "waste_listings" does not exist')) {
        return {
          success: true,
          latencyMs,
          message: `Connected successfully to ${url} in ${latencyMs}ms! (Note: The "waste_listings" table has not been created yet. Execute the SQL Migration script in Supabase SQL Editor to create tables).`,
          tablesFound: [],
        };
      }
      return {
        success: false,
        latencyMs,
        message: `Supabase returned error: ${error.message} (${error.code || 'UNKNOWN'})`,
      };
    }

    return {
      success: true,
      latencyMs,
      message: `Successfully connected to Supabase (${url}) in ${latencyMs}ms! Table "waste_listings" is online.`,
      tablesFound: ['waste_listings'],
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection failed: ${(err as Error).message}`,
    };
  }
}

// -------------------------------------------------------------
// SUPABASE DATA OPERATIONS (WITH FALLBACK)
// -------------------------------------------------------------

export async function fetchRemoteListings(): Promise<WasteListing[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('waste_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch listings error:', error.message);
      return null;
    }

    // Map database snake_case columns back to WasteListing model
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      subType: row.sub_type,
      quantity: Number(row.quantity),
      unit: row.unit,
      pricePerUnit: Number(row.price_per_unit),
      totalPrice: Number(row.total_price),
      currency: row.currency || 'USD',
      location: row.location,
      city: row.city,
      pincode: row.pincode,
      sellerName: row.seller_name,
      sellerPhone: row.seller_phone,
      sellerEmail: row.seller_email,
      description: row.description || '',
      condition: row.cond || 'Sorted & Cleaned',
      imageUrl: row.image_url || '',
      isUserCreated: Boolean(row.is_user_created),
      status: row.status || 'Available',
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Remote fetch error:', err);
    return null;
  }
}

export async function insertRemoteListing(listing: WasteListing): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: listing.id,
      title: listing.title,
      category: listing.category,
      sub_type: listing.subType,
      quantity: listing.quantity,
      unit: listing.unit,
      price_per_unit: listing.pricePerUnit,
      total_price: listing.totalPrice,
      currency: listing.currency,
      location: listing.location,
      city: listing.city,
      pincode: listing.pincode,
      seller_name: listing.sellerName,
      seller_phone: listing.sellerPhone,
      seller_email: listing.sellerEmail,
      description: listing.description,
      cond: listing.condition,
      image_url: listing.imageUrl,
      is_user_created: listing.isUserCreated,
      status: listing.status,
    };

    const { error } = await client.from('waste_listings').upsert(payload);
    if (error) {
      console.warn('Supabase listing upsert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error inserting listing to Supabase:', err);
    return false;
  }
}

export async function deleteRemoteListing(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('waste_listings').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchRemotePickups(): Promise<PickupRequest[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('pickup_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch pickups error:', error.message);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      trackingId: row.tracking_id,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      pincode: row.pincode,
      wasteCategory: row.waste_category,
      estimatedQuantityKg: Number(row.estimated_quantity_kg),
      pickupDate: row.pickup_date,
      timeSlot: row.time_slot,
      specialInstructions: row.special_instructions || '',
      status: row.status || 'Scheduled',
      createdAt: row.created_at,
    }));
  } catch {
    return null;
  }
}

export async function insertRemotePickup(pickup: PickupRequest): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: pickup.id,
      tracking_id: pickup.trackingId,
      full_name: pickup.fullName,
      phone: pickup.phone,
      email: pickup.email,
      address: pickup.address,
      city: pickup.city,
      pincode: pickup.pincode,
      waste_category: pickup.wasteCategory,
      estimated_quantity_kg: pickup.estimatedQuantityKg,
      pickup_date: pickup.pickupDate,
      time_slot: pickup.timeSlot,
      special_instructions: pickup.specialInstructions,
      status: pickup.status,
    };

    const { error } = await client.from('pickup_requests').upsert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteRemotePickup(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('pickup_requests').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function pushAllLocalDataToSupabase(
  listings: WasteListing[],
  pickups: PickupRequest[],
  blueprints: UpcycleBlueprint[],
  profile: UserProfile
): Promise<{ success: boolean; message: string; counts: { listings: number; pickups: number; blueprints: number } }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase client is not configured with an anon API key.',
      counts: { listings: 0, pickups: 0, blueprints: 0 },
    };
  }

  try {
    // 1. Sync listings
    const listingRows = listings.map((l) => ({
      id: l.id,
      title: l.title,
      category: l.category,
      sub_type: l.subType,
      quantity: l.quantity,
      unit: l.unit,
      price_per_unit: l.pricePerUnit,
      total_price: l.totalPrice,
      currency: l.currency,
      location: l.location,
      city: l.city,
      pincode: l.pincode,
      seller_name: l.sellerName,
      seller_phone: l.sellerPhone,
      seller_email: l.sellerEmail,
      description: l.description,
      cond: l.condition,
      image_url: l.imageUrl,
      is_user_created: l.isUserCreated,
      status: l.status,
    }));

    const { error: listingErr } = await client.from('waste_listings').upsert(listingRows);
    if (listingErr) throw new Error(`Listings upload error: ${listingErr.message}`);

    // 2. Sync pickups
    const pickupRows = pickups.map((p) => ({
      id: p.id,
      tracking_id: p.trackingId,
      full_name: p.fullName,
      phone: p.phone,
      email: p.email,
      address: p.address,
      city: p.city,
      pincode: p.pincode,
      waste_category: p.wasteCategory,
      estimated_quantity_kg: p.estimatedQuantityKg,
      pickup_date: p.pickupDate,
      time_slot: p.timeSlot,
      special_instructions: p.specialInstructions,
      status: p.status,
    }));

    const { error: pickupErr } = await client.from('pickup_requests').upsert(pickupRows);
    if (pickupErr) throw new Error(`Pickups upload error: ${pickupErr.message}`);

    // 3. Sync blueprints
    const blueprintRows = blueprints.map((b) => ({
      id: b.id,
      title: b.title,
      waste_category: b.wasteCategory,
      source_feedstock: b.sourceFeedstock,
      end_product: b.endProduct,
      value_multiplier: b.valueMultiplier,
      raw_cost_per_kg_usd: b.rawCostPerKgUSD,
      finished_value_per_kg_usd: b.finishedValuePerKgUSD,
      difficulty: b.difficulty,
      equipment_needed: b.equipmentNeeded,
      steps: b.steps,
      co2_reduction_percent: b.co2ReductionPercent,
      market_demand: b.marketDemand,
      description: b.description,
      badge: b.badge,
    }));

    const { error: bpErr } = await client.from('upcycle_blueprints').upsert(blueprintRows);
    if (bpErr) throw new Error(`Blueprints upload error: ${bpErr.message}`);

    return {
      success: true,
      message: `Successfully synchronized ${listingRows.length} listings, ${pickupRows.length} pickups, and ${blueprintRows.length} blueprints to Supabase!`,
      counts: {
        listings: listingRows.length,
        pickups: pickupRows.length,
        blueprints: blueprintRows.length,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message,
      counts: { listings: 0, pickups: 0, blueprints: 0 },
    };
  }
}

// -------------------------------------------------------------
// SUPABASE POSTGRESQL DDL SCRIPT WITH RLS POLICIES & SEED DATA
// -------------------------------------------------------------
export const SUPABASE_SQL_DDL = `-- =========================================================================
-- Waste2Wealth Official Supabase Schema & Security Setup
-- Target Project: https://sjkoqvjxvnlwzowxpqgy.supabase.co
-- Run this script in: Supabase Dashboard -> SQL Editor -> New Query
-- =========================================================================

-- 1. Create Waste Listings Table
CREATE TABLE IF NOT EXISTS public.waste_listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_type TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  price_per_unit NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  seller_phone TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  description TEXT,
  cond TEXT DEFAULT 'Sorted & Cleaned',
  image_url TEXT,
  is_user_created BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Doorstep Pickup Requests Table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id TEXT PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  waste_category TEXT NOT NULL,
  estimated_quantity_kg NUMERIC(10, 2) NOT NULL,
  pickup_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  special_instructions TEXT,
  status TEXT DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Upcycling Blueprints Table
CREATE TABLE IF NOT EXISTS public.upcycle_blueprints (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  waste_category TEXT NOT NULL,
  source_feedstock TEXT NOT NULL,
  end_product TEXT NOT NULL,
  value_multiplier NUMERIC(8, 2) NOT NULL,
  raw_cost_per_kg_usd NUMERIC(10, 2) NOT NULL,
  finished_value_per_kg_usd NUMERIC(10, 2) NOT NULL,
  difficulty TEXT DEFAULT 'Intermediate',
  equipment_needed JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  co2_reduction_percent INT NOT NULL,
  market_demand TEXT DEFAULT 'High',
  description TEXT,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  country TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  organization_type TEXT DEFAULT 'Individual Resident',
  avatar_url TEXT,
  bio TEXT,
  eco_level TEXT DEFAULT 'Tier 3: Circular Champion',
  verified_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.waste_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcycle_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create Open Access Policies for Public Client Access (Anon Key)
DROP POLICY IF EXISTS "Public access for waste_listings" ON public.waste_listings;
CREATE POLICY "Public access for waste_listings" ON public.waste_listings
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for pickup_requests" ON public.pickup_requests;
CREATE POLICY "Public access for pickup_requests" ON public.pickup_requests
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for upcycle_blueprints" ON public.upcycle_blueprints;
CREATE POLICY "Public access for upcycle_blueprints" ON public.upcycle_blueprints
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for user_profiles" ON public.user_profiles;
CREATE POLICY "Public access for user_profiles" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- 7. Enable Realtime Notifications on Tables (Optional for live UI updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.waste_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pickup_requests;

-- 8. Seed Default Sample Data
INSERT INTO public.waste_listings (
  id, title, category, sub_type, quantity, unit, price_per_unit, total_price,
  currency, location, city, pincode, seller_name, seller_phone, seller_email,
  description, cond, image_url, is_user_created, status
) VALUES 
(
  'wl-seed-1',
  'Post-Consumer Clean PET Flakes (Optical Sorted)',
  'Plastic',
  'PET / Polyester',
  1200.00,
  'kg',
  0.48,
  576.00,
  'USD',
  'Industrial Zone Gateway #4',
  'Seattle',
  '98101',
  'Aditya Gupta',
  '+1 (555) 782-3901',
  'adityagupta8725@gmail.com',
  'Hot-washed, optical-sorted clear PET beverage bottle flakes with < 50 ppm PVC contamination. Perfect for rPET extrusion or textile fiber drawing.',
  'Sorted & Cleaned',
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  FALSE,
  'Available'
),
(
  'wl-seed-2',
  'Decommissioned Server Grade Printed Circuit Boards',
  'E-waste',
  'Motherboards & RAM',
  350.00,
  'kg',
  12.50,
  4375.00,
  'USD',
  'Silicon Logistics Warehouse B',
  'San Jose',
  '95112',
  'Pacific Circular Recovery',
  '+1 (555) 492-1084',
  'e-waste@pacific-recovery.org',
  'Dual-socket server motherboards and DDR4 RAM gold fingers. Rich in gold, silver, palladium, and electrolytic copper.',
  'Industrial Scrap',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  FALSE,
  'Available'
)
ON CONFLICT (id) DO NOTHING;
`;
