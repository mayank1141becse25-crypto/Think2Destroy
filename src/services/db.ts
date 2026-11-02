import { WasteListing, PickupRequest, UserProfile, UserEcoBadge, UpcycleBlueprint } from '../types';
import { SEED_MARKETPLACE_LISTINGS } from '../utils/seedData';
import {
  getSupabaseConfig,
  insertRemoteListing,
  deleteRemoteListing,
  insertRemotePickup,
  deleteRemotePickup,
  fetchRemoteListings,
  fetchRemotePickups,
} from './supabase';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'SEED' | 'RESET' | 'IMPORT';
  table: 'listings' | 'pickups' | 'blueprints' | 'profiles' | 'system';
  recordId?: string;
  summary: string;
}

export interface DatabaseStats {
  listingsCount: number;
  pickupsCount: number;
  blueprintsCount: number;
  logsCount: number;
  storageBytes: number;
  lastUpdated: string;
}

const STORAGE_KEYS = {
  LISTINGS: 'w2w_marketplace_listings_v1',
  PICKUPS: 'w2w_pickup_requests_v1',
  BLUEPRINTS: 'w2w_upcycle_blueprints_v1',
  PROFILE: 'w2w_user_profile_v1',
  BADGES: 'w2w_user_badges_v1',
  LOGS: 'w2w_audit_logs_v1',
};

const SAMPLE_INITIAL_PICKUP: PickupRequest = {
  id: 'pk-sample-1',
  trackingId: 'W2W-PK-92144',
  fullName: 'Aditya Gupta',
  phone: '+1 (555) 782-3901',
  email: 'adityagupta8725@gmail.com',
  address: '742 Evergreen Terrace, Apt 4B',
  city: 'Seattle',
  pincode: '98101',
  wasteCategory: 'E-waste',
  estimatedQuantityKg: 45,
  pickupDate: '2026-11-04',
  timeSlot: '10:00 AM - 01:00 PM',
  specialInstructions: 'Ring buzzer #4B, boxes are taped in the lobby.',
  status: 'Scheduled',
  createdAt: '2026-10-31T18:00:00Z',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Aditya Gupta',
  email: 'adityagupta8725@gmail.com',
  phone: '+1 (555) 782-3901',
  city: 'Seattle',
  country: 'United States',
  preferredCurrency: 'USD',
  organizationType: 'Individual Resident',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Circular economy practitioner and zero-waste advocate diverting household plastics, scrap metals, and e-waste into secondary supply loops.',
  ecoLevel: 'Tier 3: Circular Champion',
  memberSince: 'March 2026',
  verifiedStatus: true,
  notificationPreferences: {
    emailAlerts: true,
    pickupDispatches: true,
    priceSurges: true,
  },
};

const DEFAULT_BADGES: UserEcoBadge[] = [
  {
    id: 'b1',
    name: 'Zero-Waste Pioneer',
    icon: 'Sparkles',
    category: 'Milestone',
    unlocked: true,
    unlockedAt: '2026-03-12',
    description: 'First 100 kg of post-consumer recyclables diverted from municipal landfill.',
  },
  {
    id: 'b2',
    name: 'E-Waste Protector',
    icon: 'Cpu',
    category: 'Hazardous Waste',
    unlocked: true,
    unlockedAt: '2026-04-02',
    description: 'Safely manifested decommissioned electronic circuit boards & lithium batteries.',
  },
  {
    id: 'b3',
    name: 'Circular Mastermind',
    icon: 'Award',
    category: 'Literacy',
    unlocked: true,
    unlockedAt: '2026-04-18',
    description: 'Scored 100% on the municipal Waste Segregation Certification Challenge.',
  },
  {
    id: 'b4',
    name: 'Verified Feedstock Seller',
    icon: 'ShieldCheck',
    category: 'Marketplace',
    unlocked: true,
    unlockedAt: '2026-05-01',
    description: 'Successfully transacted verified industrial-grade secondary raw materials.',
  },
  {
    id: 'b5',
    name: 'Carbon Neutralizer',
    icon: 'Leaf',
    category: 'Climate Impact',
    unlocked: true,
    unlockedAt: '2026-05-15',
    description: 'Achieved over 1,500 kg of avoided greenhouse gas emissions (CO₂e).',
  },
  {
    id: 'b6',
    name: 'Closed-Loop Champion',
    icon: 'Recycle',
    category: 'Logistics',
    unlocked: false,
    description: 'Complete 10 scheduled doorstep collections with certified recovery fleets.',
  },
];

const SEED_BLUEPRINTS: UpcycleBlueprint[] = [
  {
    id: 'bp-1',
    title: 'rPET 3D Printer Filament Spools',
    wasteCategory: 'Plastic',
    sourceFeedstock: 'Post-consumer clear PET beverage bottles & thermoform clamshells',
    endProduct: '1.75mm Precision Tolerance rPET 3D Printing Filament',
    valueMultiplier: 46.8,
    rawCostPerKgUSD: 0.48,
    finishedValuePerKgUSD: 22.50,
    difficulty: 'Intermediate',
    equipmentNeeded: ['Industrial Flake Shredder', 'Caustic Soda Wash Basin', 'Dehumidifying Hopper Dryer', 'Desktop Extruder & Spooler'],
    steps: [
      { stage: 'Stage 1', title: 'Flaking & Label Separation', desc: 'Mechanical granulation into 4-6mm uniform flakes followed by air-cyclone label separation.' },
      { stage: 'Stage 2', title: 'Hot Alkaline Wash & Desiccation', desc: 'Wash with 1% NaOH solution at 80°C to eliminate glue residue, then dry below 0.005% moisture content.' },
      { stage: 'Stage 3', title: 'Melt Extrusion & Laser Calipering', desc: 'Extrude at 250°C-260°C through a 1.75mm tungsten nozzle with dual-axis laser diameter monitoring.' },
      { stage: 'Stage 4', title: 'Tensioned Spooling & Vacuum Seal', desc: 'Wind onto recycled cardboard spools with desiccant pouch for industrial packaging.' }
    ],
    co2ReductionPercent: 78,
    marketDemand: 'Exponential',
    description: 'Transforms cheap scrap plastic bottles into valuable polymer filament demanded by prototyping labs, schools, and makers worldwide.',
    badge: 'High Value-Add (46x)',
    colorGrad: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'bp-2',
    title: 'Architectural Denim Acoustic Panels',
    wasteCategory: 'Textile',
    sourceFeedstock: 'Discarded cotton denim jeans & cutting-room garment trimmings',
    endProduct: 'NRC 0.85 Sound-Absorbing Wall Baffles & Building Insulation',
    valueMultiplier: 42.0,
    rawCostPerKgUSD: 0.20,
    finishedValuePerKgUSD: 8.40,
    difficulty: 'Beginner',
    equipmentNeeded: ['Rotary Textile Shredder', 'Fiber Garnetting Carder', 'Borate Flame-Retardant Mist Spray', 'Heated Platen Press'],
    steps: [
      { stage: 'Stage 1', title: 'De-Hardware & Shredding', desc: 'Automatic magnetic extraction of metal rivets and zippers, followed by high-speed rotary shredding.' },
      { stage: 'Stage 2', title: 'Fiber Garnetting & Blending', desc: 'Card fibers into an airy web and blend with 15% bicomponent low-melt polyester bonding fibers.' },
      { stage: 'Stage 3', title: 'Non-Toxic Fire Retardancy', desc: 'Apply aqueous borate mineral mist to achieve Class-A building fire rating.' },
      { stage: 'Stage 4', title: 'Thermal Compression Molding', desc: 'Compress at 160°C into rigid 50mm acoustic panels with custom chamfered beveled edges.' }
    ],
    co2ReductionPercent: 84,
    marketDemand: 'Very High',
    description: 'Converts fast-fashion denim waste into premium architectural acoustic panels favored by recording studios and modern offices.',
    badge: 'Zero Chemical Binder',
    colorGrad: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'bp-3',
    title: 'Biochar Horticultural Briquettes',
    wasteCategory: 'Organic',
    sourceFeedstock: 'Cafe spent espresso grounds and municipal fruit pulp waste',
    endProduct: 'Activated Carbon Soil Enhancer & Smokeless Barbecue Briquettes',
    valueMultiplier: 76.0,
    rawCostPerKgUSD: 0.05,
    finishedValuePerKgUSD: 3.80,
    difficulty: 'Beginner',
    equipmentNeeded: ['Solar Drying Tunnel', 'TLUD Biomass Pyrolysis Kiln', 'Cassava Starch Binder Mixer', 'Hydraulic Briquette Extruder'],
    steps: [
      { stage: 'Stage 1', title: 'Low-Energy Moisture Reduction', desc: 'Spread on solar drying racks to reduce moisture content from 65% down to under 12%.' },
      { stage: 'Stage 2', title: 'Oxygen-Deprived Pyrolysis', desc: 'Thermochemical decomposition at 450°C in anoxic retort, sequestering stable elemental carbon.' },
      { stage: 'Stage 3', title: 'Micro-Pore Inoculation', desc: 'Crush into biochar and inoculate with beneficial mycorrhizal fungi and organic compost tea.' },
      { stage: 'Stage 4', title: 'High-Density Hydraulic Pressing', desc: 'Blend with 5% non-toxic starch binder and press into uniform smokeless fuel briquettes.' }
    ],
    co2ReductionPercent: 92,
    marketDemand: 'High',
    description: 'Permanent carbon sequestration: turns wet organic waste into soil-boosting black gold that locks carbon in agriculture for centuries.',
    badge: 'Permanent Carbon Sink',
    colorGrad: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'bp-4',
    title: 'Telecom PCB Precious Metal Cathodes',
    wasteCategory: 'E-waste',
    sourceFeedstock: 'Decommissioned server motherboards, RAM gold fingers & telecom relays',
    endProduct: '99.9% Pure Electrolytic Copper Ingots & Gold Refining Sponge',
    valueMultiplier: 6.7,
    rawCostPerKgUSD: 12.50,
    finishedValuePerKgUSD: 84.00,
    difficulty: 'Industrial Scale',
    equipmentNeeded: ['Infrared Desoldering Table', 'Hermetic Hammer Mill', 'Eco Leaching Reactor Tank', 'Electro-Winning Cell Array'],
    steps: [
      { stage: 'Stage 1', title: 'Chip & Component Harvest', desc: 'Infrared heating frees surface-mount ICs and capacitors for specialized component recycling.' },
      { stage: 'Stage 2', title: 'Pulverization & Corona Separation', desc: 'Pulverize bare fiberglass boards and separate conductive copper fractions with high-voltage corona rolls.' },
      { stage: 'Stage 3', title: 'Closed-Loop Hydrometallurgy', desc: 'Leach copper into solution using recyclable citric acid-based reagents without toxic cyanide.' },
      { stage: 'Stage 4', title: 'Electro-Winning & Melting', desc: 'Recover electrolytic cathode copper sheets and smelt into 99.9% pure trade-certified bullion bars.' }
    ],
    co2ReductionPercent: 91,
    marketDemand: 'Exponential',
    description: 'Urban mining at its finest: one ton of circuit boards contains 40 to 800 times more gold and copper than natural mined ore.',
    badge: 'Urban Mining Gold',
    colorGrad: 'from-amber-500 to-orange-600',
  },
  {
    id: 'bp-5',
    title: 'Reclaimed Timber Modular Acoustic Tiles',
    wasteCategory: 'Paper',
    sourceFeedstock: 'Discarded shipping pallets and construction demolition pine',
    endProduct: 'Geometric Modular Parquet Wall Cladding Tiles',
    valueMultiplier: 94.6,
    rawCostPerKgUSD: 0.15,
    finishedValuePerKgUSD: 14.20,
    difficulty: 'Intermediate',
    equipmentNeeded: ['Magnetic De-nailing Wand', 'Heavy Duty Thickness Planer', 'CNC Precision Mitering Router', 'Natural Tung Oil Dip Bath'],
    steps: [
      { stage: 'Stage 1', title: 'Metal Detection & Dismantling', desc: 'Scan and extract hidden rusted nails, followed by pneumatic blade slat disengagement.' },
      { stage: 'Stage 2', title: 'Kiln Sanitation & Planing', desc: 'Heat-treat to eliminate pests, then surface-plane to expose rich authentic wood grain.' },
      { stage: 'Stage 3', title: 'Precision Geometric CNC Milling', desc: 'Cut into hexagonal acoustic interlocking tiles with sound-deflecting rear relief grooves.' },
      { stage: 'Stage 4', title: 'Natural Eco-Wax Sealing', desc: 'Finish with VOC-free beeswax and plant-based tung oil for long-lasting interior luster.' }
    ],
    co2ReductionPercent: 96,
    marketDemand: 'Very High',
    description: 'Turns beat-up shipping crates into architectural luxury wall panels that command high interior designer markups.',
    badge: 'High Designer Margin',
    colorGrad: 'from-amber-700 to-stone-700',
  },
  {
    id: 'bp-6',
    title: 'Architectural Recycled Terrazzo Slabs',
    wasteCategory: 'Metal',
    sourceFeedstock: 'Crushed beverage glass bottles, jar cullet & flat window scrap',
    endProduct: 'Diamond-Polished Architectural Terrazzo Countertops & Vanity Slabs',
    valueMultiplier: 231.0,
    rawCostPerKgUSD: 0.08,
    finishedValuePerKgUSD: 18.50,
    difficulty: 'Intermediate',
    equipmentNeeded: ['Jaw Cullet Crusher', 'Multi-Mesh Vibratory Sieve', 'Vacuum Planetary Mortar Mixer', 'Multi-Stage Diamond Polisher'],
    steps: [
      { stage: 'Stage 1', title: 'Tumbling & Color Grading', desc: 'Crush colored glass and tumble to round razor-sharp edges; sieve into 3 distinct aggregate sizes.' },
      { stage: 'Stage 2', title: 'Low-Carbon Matrix Formulation', desc: 'Blend 70% glass aggregate with pozzolanic bio-cement and white mineral pigment.' },
      { stage: 'Stage 3', title: 'Vibration Vacuum Casting', desc: 'Pour into monolithic slab forms on a 3,600 RPM vibrating table to eliminate trapped air voids.' },
      { stage: 'Stage 4', title: 'Sequential Diamond Grinding', desc: 'Hone from 50 grit up to 3000 grit until colored glass specks reflect brilliant stone-like clarity.' }
    ],
    co2ReductionPercent: 65,
    marketDemand: 'High',
    description: 'Turns discarded glass cullet that would otherwise sit in landfills forever into stunning granite-grade countertops.',
    badge: '231x Multiplier',
    colorGrad: 'from-teal-500 to-emerald-700',
  }
];

type ChangeListener = () => void;

class DatabaseEngine {
  private listeners: Set<ChangeListener> = new Set();

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in database subscriber', err);
      }
    });
  }

  // AUDIT LOGGING
  public log(operation: AuditLogEntry['operation'], table: AuditLogEntry['table'], summary: string, recordId?: string) {
    try {
      const logs = this.getAuditLogs();
      const newEntry: AuditLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        operation,
        table,
        recordId,
        summary,
      };
      const updated = [newEntry, ...logs.slice(0, 99)]; // retain last 100 entries
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not write audit log', e);
    }
  }

  public getAuditLogs(): AuditLogEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // --- LISTINGS CRUD ---
  public getListings(): WasteListing[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(SEED_MARKETPLACE_LISTINGS));
        this.log('SEED', 'listings', 'Initialized listings collection with 6 verified seed items');
        return SEED_MARKETPLACE_LISTINGS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_MARKETPLACE_LISTINGS;
    } catch {
      return SEED_MARKETPLACE_LISTINGS;
    }
  }

  public saveListings(listings: WasteListing[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
      this.notify();
    } catch (e) {
      console.error('Failed to save listings', e);
    }
  }

  public addListing(listing: WasteListing): WasteListing[] {
    const current = this.getListings();
    const updated = [listing, ...current];
    this.saveListings(updated);
    this.log('INSERT', 'listings', `Created listing "${listing.title}" (${listing.quantity} ${listing.unit})`, listing.id);

    // Sync to Supabase if configured
    if (getSupabaseConfig().isConfigured) {
      insertRemoteListing(listing).then((ok) => {
        if (ok) {
          this.log('UPDATE', 'listings', `Synced "${listing.title}" to Supabase cloud`, listing.id);
        }
      }).catch(console.error);
    }
    return updated;
  }

  public deleteListing(id: string): WasteListing[] {
    const current = this.getListings();
    const target = current.find((item) => item.id === id);
    const updated = current.filter((item) => item.id !== id);
    this.saveListings(updated);
    this.log('DELETE', 'listings', `Removed listing "${target?.title || id}"`, id);

    if (getSupabaseConfig().isConfigured) {
      deleteRemoteListing(id).catch(console.error);
    }
    return updated;
  }

  public toggleListingStatus(id: string): WasteListing[] {
    const current = this.getListings();
    let newStatus: 'Available' | 'Sold' = 'Available';
    let targetListing: WasteListing | undefined;
    const updated = current.map((item) => {
      if (item.id === id) {
        newStatus = item.status === 'Available' ? 'Sold' : 'Available';
        targetListing = { ...item, status: newStatus };
        return targetListing;
      }
      return item;
    });
    this.saveListings(updated);
    this.log('UPDATE', 'listings', `Updated status to "${newStatus}" for listing ID ${id}`, id);

    if (targetListing && getSupabaseConfig().isConfigured) {
      insertRemoteListing(targetListing).catch(console.error);
    }
    return updated;
  }

  // --- PICKUPS CRUD ---
  public getPickups(): PickupRequest[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PICKUPS);
      if (!raw) {
        const defaults = [SAMPLE_INITIAL_PICKUP];
        localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(defaults));
        this.log('SEED', 'pickups', 'Initialized pickups collection with initial demo order');
        return defaults;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [SAMPLE_INITIAL_PICKUP];
    } catch {
      return [SAMPLE_INITIAL_PICKUP];
    }
  }

  public savePickups(pickups: PickupRequest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));
      this.notify();
    } catch (e) {
      console.error('Failed to save pickups', e);
    }
  }

  public addPickup(pickup: PickupRequest): PickupRequest[] {
    const current = this.getPickups();
    const updated = [pickup, ...current];
    this.savePickups(updated);
    this.log('INSERT', 'pickups', `Scheduled doorstep pickup [${pickup.trackingId}] for ${pickup.fullName}`, pickup.id);

    // Sync to Supabase if configured
    if (getSupabaseConfig().isConfigured) {
      insertRemotePickup(pickup).then((ok) => {
        if (ok) {
          this.log('UPDATE', 'pickups', `Synced pickup [${pickup.trackingId}] to Supabase cloud`, pickup.id);
        }
      }).catch(console.error);
    }
    return updated;
  }

  public cancelPickup(id: string): PickupRequest[] {
    const current = this.getPickups();
    let cancelledPickup: PickupRequest | undefined;
    const updated = current.map((p) => {
      if (p.id === id) {
        cancelledPickup = { ...p, status: 'Cancelled' as const };
        return cancelledPickup;
      }
      return p;
    });
    this.savePickups(updated);
    this.log('UPDATE', 'pickups', `Order cancelled for pickup ID ${id}`, id);

    if (cancelledPickup && getSupabaseConfig().isConfigured) {
      insertRemotePickup(cancelledPickup).catch(console.error);
    }
    return updated;
  }

  public deletePickup(id: string): PickupRequest[] {
    const current = this.getPickups();
    const target = current.find((p) => p.id === id);
    const updated = current.filter((p) => p.id !== id);
    this.savePickups(updated);
    this.log('DELETE', 'pickups', `Deleted pickup order ${target?.trackingId || id}`, id);

    if (getSupabaseConfig().isConfigured) {
      deleteRemotePickup(id).catch(console.error);
    }
    return updated;
  }

  // --- SUPABASE CLOUD SYNC ---
  public async syncWithSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!getSupabaseConfig().isConfigured) {
      return { success: false, count: 0, error: 'Supabase anon key is not configured.' };
    }

    try {
      const [remoteListings, remotePickups] = await Promise.all([
        fetchRemoteListings(),
        fetchRemotePickups(),
      ]);

      let importedCount = 0;

      if (remoteListings && remoteListings.length > 0) {
        const localListings = this.getListings();
        const mergedMap = new Map<string, WasteListing>();
        localListings.forEach((l) => mergedMap.set(l.id, l));
        remoteListings.forEach((l) => mergedMap.set(l.id, l));
        const mergedList = Array.from(mergedMap.values());
        this.saveListings(mergedList);
        importedCount += remoteListings.length;
      }

      if (remotePickups && remotePickups.length > 0) {
        const localPickups = this.getPickups();
        const mergedMap = new Map<string, PickupRequest>();
        localPickups.forEach((p) => mergedMap.set(p.id, p));
        remotePickups.forEach((p) => mergedMap.set(p.id, p));
        const mergedPickups = Array.from(mergedMap.values());
        this.savePickups(mergedPickups);
        importedCount += remotePickups.length;
      }

      this.log('IMPORT', 'system', `Synchronized ${importedCount} records from Supabase cloud database`);
      return { success: true, count: importedCount };
    } catch (err) {
      return { success: false, count: 0, error: (err as Error).message };
    }
  }

  // --- BLUEPRINTS ---
  public getBlueprints(): UpcycleBlueprint[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BLUEPRINTS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(SEED_BLUEPRINTS));
        return SEED_BLUEPRINTS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_BLUEPRINTS;
    }
  }

  public addBlueprint(bp: UpcycleBlueprint): UpcycleBlueprint[] {
    const existing = this.getBlueprints();
    const updated = [bp, ...existing];
    try {
      localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(updated));
      this.log('INSERT', 'blueprints', `Added circular blueprint "${bp.title}"`, bp.id);
      this.notify();
    } catch (e) {
      console.error(e);
    }
    return updated;
  }

  // --- USER PROFILE & BADGES ---
  public getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
      }
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  public saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      this.log('UPDATE', 'profiles', `Updated KYC profile for ${profile.name}`);
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public getBadges(): UserEcoBadge[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(DEFAULT_BADGES));
        return DEFAULT_BADGES;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BADGES;
    }
  }

  // --- DATABASE ADMIN OPERATIONS ---
  public exportDatabaseJSON(): string {
    const dump = {
      exportTimestamp: new Date().toISOString(),
      schemaVersion: '2.0.0',
      database: 'waste2wealth_db',
      data: {
        listings: this.getListings(),
        pickups: this.getPickups(),
        blueprints: this.getBlueprints(),
        profile: this.getProfile(),
        badges: this.getBadges(),
        auditLogs: this.getAuditLogs(),
      },
    };
    return JSON.stringify(dump, null, 2);
  }

  public importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !parsed.data) return false;
      if (Array.isArray(parsed.data.listings)) {
        localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(parsed.data.listings));
      }
      if (Array.isArray(parsed.data.pickups)) {
        localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(parsed.data.pickups));
      }
      if (Array.isArray(parsed.data.blueprints)) {
        localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(parsed.data.blueprints));
      }
      if (parsed.data.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.data.profile));
      }
      this.log('IMPORT', 'system', 'Successfully restored database from external JSON snapshot');
      this.notify();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  public resetDatabase(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(SEED_MARKETPLACE_LISTINGS));
      localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify([SAMPLE_INITIAL_PICKUP]));
      localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(SEED_BLUEPRINTS));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(DEFAULT_BADGES));
      this.log('RESET', 'system', 'Database restored to initial pristine seed state');
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public getDatabaseStats(): DatabaseStats {
    let totalBytes = 0;
    for (const key of Object.values(STORAGE_KEYS)) {
      const val = localStorage.getItem(key);
      if (val) {
        totalBytes += val.length * 2; // rough UTF-16 byte estimate
      }
    }
    const listings = this.getListings();
    const pickups = this.getPickups();
    const blueprints = this.getBlueprints();
    const logs = this.getAuditLogs();

    return {
      listingsCount: listings.length,
      pickupsCount: pickups.length,
      blueprintsCount: blueprints.length,
      logsCount: logs.length,
      storageBytes: totalBytes,
      lastUpdated: logs[0]?.timestamp || new Date().toISOString(),
    };
  }
}

export const db = new DatabaseEngine();

// Production MySQL / PostgreSQL SQL DDL Schema for user reference
export const MYSQL_SCHEMA_DDL = `-- Waste2Wealth Production MySQL / PostgreSQL Relational Database Schema
-- Compatible with MySQL 8.0+, MariaDB 10.5+, and PostgreSQL 14+

CREATE DATABASE IF NOT EXISTS waste2wealth_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE waste2wealth_db;

-- 1. Waste Marketplace Listings Table
CREATE TABLE IF NOT EXISTS waste_listings (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category ENUM('Plastic', 'Paper', 'Metal', 'Organic', 'E-waste', 'Textile') NOT NULL,
  sub_type VARCHAR(100) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  price_per_unit DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  seller_name VARCHAR(150) NOT NULL,
  seller_phone VARCHAR(50) NOT NULL,
  seller_email VARCHAR(150) NOT NULL,
  description TEXT,
  cond ENUM('Sorted & Cleaned', 'Baled', 'Raw / Unsorted', 'Industrial Scrap') DEFAULT 'Sorted & Cleaned',
  image_url VARCHAR(500),
  is_user_created BOOLEAN DEFAULT FALSE,
  status ENUM('Available', 'Sold') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_city (city),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Logistics & Doorstep Pickup Orders Table
CREATE TABLE IF NOT EXISTS pickup_requests (
  id VARCHAR(64) PRIMARY KEY,
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  waste_category VARCHAR(50) NOT NULL,
  estimated_quantity_kg DECIMAL(10, 2) NOT NULL,
  pickup_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  special_instructions TEXT,
  status ENUM('Scheduled', 'Crew Assigned', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tracking (tracking_id),
  INDEX idx_pickup_status (status),
  INDEX idx_city_pickup (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Circular Upcycling Blueprints Table
CREATE TABLE IF NOT EXISTS upcycle_blueprints (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  waste_category VARCHAR(50) NOT NULL,
  source_feedstock TEXT NOT NULL,
  end_product VARCHAR(255) NOT NULL,
  value_multiplier DECIMAL(6, 2) NOT NULL,
  raw_cost_per_kg_usd DECIMAL(10, 2) NOT NULL,
  finished_value_per_kg_usd DECIMAL(10, 2) NOT NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Industrial Scale') DEFAULT 'Intermediate',
  equipment_needed JSON,
  transformation_steps JSON,
  co2_reduction_percent INT NOT NULL,
  market_demand ENUM('High', 'Very High', 'Exponential') DEFAULT 'High',
  description TEXT,
  badge VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. User Profiles & Eco Passport Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(50),
  city VARCHAR(100),
  country VARCHAR(100),
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  organization_type VARCHAR(100) DEFAULT 'Individual Resident',
  avatar_url VARCHAR(500),
  bio TEXT,
  eco_level VARCHAR(100) DEFAULT 'Tier 3: Circular Champion',
  verified_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. System Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  operation ENUM('INSERT', 'UPDATE', 'DELETE', 'SEED', 'RESET', 'IMPORT') NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id VARCHAR(64),
  summary TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// Sample Node.js / Express + MySQL2 implementation code
export const SAMPLE_MYSQL_BACKEND_CODE = `// server.ts - Full-Stack Express with MySQL Database Connection Pool
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// 1. Initialize Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'waste2wealth_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 2. Health & Connection Test Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as connected');
    res.json({ status: 'ok', database: 'connected', result: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
});

// 3. GET /api/listings - Retrieve all marketplace scrap listings
app.get('/api/listings', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM waste_listings ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 4. POST /api/listings - Create a new scrap listing
app.post('/api/listings', async (req, res) => {
  try {
    const {
      id, title, category, subType, quantity, unit, pricePerUnit,
      totalPrice, currency, location, city, pincode, sellerName,
      sellerPhone, sellerEmail, description, condition, imageUrl
    } = req.body;

    const query = \`
      INSERT INTO waste_listings (
        id, title, category, sub_type, quantity, unit, price_per_unit,
        total_price, currency, location, city, pincode, seller_name,
        seller_phone, seller_email, description, cond, image_url, is_user_created, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'Available')
    \`;

    await pool.execute(query, [
      id, title, category, subType, quantity, unit, pricePerUnit,
      totalPrice, currency, location, city, pincode, sellerName,
      sellerPhone, sellerEmail, description, condition, imageUrl
    ]);

    res.status(201).json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 5. POST /api/pickups - Create doorstep pickup order
app.post('/api/pickups', async (req, res) => {
  try {
    const p = req.body;
    const query = \`
      INSERT INTO pickup_requests (
        id, tracking_id, full_name, phone, email, address, city,
        pincode, waste_category, estimated_quantity_kg, pickup_date,
        time_slot, special_instructions, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled')
    \`;

    await pool.execute(query, [
      p.id, p.trackingId, p.fullName, p.phone, p.email, p.address,
      p.city, p.pincode, p.wasteCategory, p.estimatedQuantityKg,
      p.pickupDate, p.timeSlot, p.specialInstructions
    ]);

    res.status(201).json({ success: true, trackingId: p.trackingId });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default app;
`;
