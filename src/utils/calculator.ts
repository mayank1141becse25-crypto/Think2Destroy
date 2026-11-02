import { WasteCategory, ValuationMetrics } from '../types';

export interface WasteSubtypeOption {
  id: string;
  name: string;
  minRate: number; // USD per kg
  maxRate: number;
  co2Factor: number; // kg CO2e avoided per kg
  treeFactor: number; // trees preserved per kg
  energyFactor: number; // kWh saved per kg
  waterFactor: number; // liters saved per kg
  landfillFactor: number; // m3 diverted per kg
  description: string;
}

export const WASTE_RATES_DATA: Record<WasteCategory, WasteSubtypeOption[]> = {
  Plastic: [
    {
      id: 'pet_bottles',
      name: 'PET (Polyethylene Terephthalate) Bottles',
      minRate: 0.35,
      maxRate: 0.55,
      co2Factor: 1.6,
      treeFactor: 0.001,
      energyFactor: 5.8,
      waterFactor: 24,
      landfillFactor: 0.0035,
      description: 'Clear drink bottles, water containers, food trays.',
    },
    {
      id: 'hdpe_containers',
      name: 'HDPE (High-Density Polyethylene) Jugs & Tubs',
      minRate: 0.45,
      maxRate: 0.70,
      co2Factor: 1.8,
      treeFactor: 0.001,
      energyFactor: 6.2,
      waterFactor: 28,
      landfillFactor: 0.003,
      description: 'Milk jugs, detergent bottles, shampoo containers.',
    },
    {
      id: 'pp_rigid',
      name: 'PP (Polypropylene) Rigid Plastics',
      minRate: 0.30,
      maxRate: 0.48,
      co2Factor: 1.4,
      treeFactor: 0.0008,
      energyFactor: 5.2,
      waterFactor: 20,
      landfillFactor: 0.0028,
      description: 'Yogurt cups, food takeaway containers, bottle caps.',
    },
    {
      id: 'ldpe_film',
      name: 'LDPE (Low-Density Polyethylene) Clean Film',
      minRate: 0.20,
      maxRate: 0.38,
      co2Factor: 1.2,
      treeFactor: 0.0006,
      energyFactor: 4.5,
      waterFactor: 16,
      landfillFactor: 0.004,
      description: 'Clean shrink wrap, bubble wrap, stretch film baled.',
    },
  ],
  Paper: [
    {
      id: 'corrugated_cardboard',
      name: 'Corrugated Cardboard (OCC)',
      minRate: 0.16,
      maxRate: 0.28,
      co2Factor: 1.3,
      treeFactor: 0.017,
      energyFactor: 4.1,
      waterFactor: 26,
      landfillFactor: 0.0042,
      description: 'Brown delivery boxes, packaging cartons, grooved boards.',
    },
    {
      id: 'office_white_paper',
      name: 'Office & Printer White Paper',
      minRate: 0.22,
      maxRate: 0.36,
      co2Factor: 1.4,
      treeFactor: 0.02,
      energyFactor: 4.6,
      waterFactor: 32,
      landfillFactor: 0.0025,
      description: 'Sorted office waste, printer paper, shredded documents.',
    },
    {
      id: 'old_newspaper',
      name: 'Newspapers & Periodicals (ONP)',
      minRate: 0.10,
      maxRate: 0.19,
      co2Factor: 1.0,
      treeFactor: 0.014,
      energyFactor: 3.5,
      waterFactor: 22,
      landfillFactor: 0.003,
      description: 'Daily newsprint, magazines, unbound pamphlets.',
    },
  ],
  Metal: [
    {
      id: 'aluminum_cans',
      name: 'Aluminum UBC (Beverage Cans)',
      minRate: 1.30,
      maxRate: 1.75,
      co2Factor: 9.1,
      treeFactor: 0.005,
      energyFactor: 14.5,
      waterFactor: 45,
      landfillFactor: 0.002,
      description: 'Clean crushed or whole soda/beer aluminum beverage cans.',
    },
    {
      id: 'copper_scrap',
      name: 'Bare Bright Copper / Tubing Scrap',
      minRate: 6.80,
      maxRate: 8.60,
      co2Factor: 4.8,
      treeFactor: 0.004,
      energyFactor: 18.0,
      waterFactor: 60,
      landfillFactor: 0.0008,
      description: 'Clean electrical wiring, plumbing copper pipes, stripped busbars.',
    },
    {
      id: 'brass_scrap',
      name: 'Brass Plumbing & Hardware Scrap',
      minRate: 3.90,
      maxRate: 5.10,
      co2Factor: 3.5,
      treeFactor: 0.003,
      energyFactor: 12.0,
      waterFactor: 40,
      landfillFactor: 0.001,
      description: 'Valves, faucets, fittings, decorative alloy components.',
    },
    {
      id: 'steel_iron_scrap',
      name: 'Ferrous Steel & Iron Scrap',
      minRate: 0.28,
      maxRate: 0.44,
      co2Factor: 1.8,
      treeFactor: 0.0015,
      energyFactor: 5.6,
      waterFactor: 18,
      landfillFactor: 0.0012,
      description: 'Food tin cans, appliance chassis, structural steel cuts.',
    },
  ],
  'E-waste': [
    {
      id: 'circuit_boards_pcb',
      name: 'High-Grade Printed Circuit Boards (PCBs)',
      minRate: 8.50,
      maxRate: 16.00,
      co2Factor: 6.2,
      treeFactor: 0.008,
      energyFactor: 22.0,
      waterFactor: 85,
      landfillFactor: 0.0015,
      description: 'Server motherboards, telecom cards, ram sticks with precious metals.',
    },
    {
      id: 'laptops_computers',
      name: 'Whole Laptops & Computer Towers',
      minRate: 1.80,
      maxRate: 3.50,
      co2Factor: 4.5,
      treeFactor: 0.005,
      energyFactor: 16.0,
      waterFactor: 60,
      landfillFactor: 0.003,
      description: 'Decommissioned notebook PCs, desktop units, workstations.',
    },
    {
      id: 'smartphones_tablets',
      name: 'Smartphones & Mobile Devices',
      minRate: 4.50,
      maxRate: 8.20,
      co2Factor: 5.8,
      treeFactor: 0.006,
      energyFactor: 19.0,
      waterFactor: 70,
      landfillFactor: 0.001,
      description: 'Used cellphones, tablets, lithium e-waste (excluding swollen cells).',
    },
    {
      id: 'cables_wiring',
      name: 'Insulated Copper Power Cables & Wire',
      minRate: 3.20,
      maxRate: 5.40,
      co2Factor: 3.9,
      treeFactor: 0.003,
      energyFactor: 14.0,
      waterFactor: 48,
      landfillFactor: 0.0018,
      description: 'Data cables, home wiring harness, power supply cords.',
    },
  ],
  Organic: [
    {
      id: 'kitchen_food_scraps',
      name: 'Segregated Kitchen & Produce Scraps',
      minRate: 0.06,
      maxRate: 0.12,
      co2Factor: 0.9,
      treeFactor: 0.002,
      energyFactor: 1.2,
      waterFactor: 8,
      landfillFactor: 0.0022,
      description: 'Vegetable peelings, fruit pulp, plate scraps for biomethane/compost.',
    },
    {
      id: 'spent_coffee_grounds',
      name: 'Spent Coffee Grounds (Cafes/Roasters)',
      minRate: 0.15,
      maxRate: 0.28,
      co2Factor: 1.1,
      treeFactor: 0.003,
      energyFactor: 2.4,
      waterFactor: 14,
      landfillFactor: 0.0018,
      description: 'Nitrogen-rich espresso cake, grounds for mushroom substrate & bio-oil.',
    },
    {
      id: 'yard_garden_waste',
      name: 'Yard Trimmings & Green Biomass',
      minRate: 0.04,
      maxRate: 0.09,
      co2Factor: 0.75,
      treeFactor: 0.0018,
      energyFactor: 0.9,
      waterFactor: 6,
      landfillFactor: 0.0035,
      description: 'Grass clippings, hedge cuttings, leaves for industrial mulching.',
    },
  ],
  Textile: [
    {
      id: 'clean_cotton_scrap',
      name: 'Post-Consumer 100% Cotton Apparel',
      minRate: 0.32,
      maxRate: 0.58,
      co2Factor: 3.6,
      treeFactor: 0.007,
      energyFactor: 8.5,
      waterFactor: 120, // Huge water savings vs virgin cotton!
      landfillFactor: 0.0038,
      description: 'T-shirts, shirts, bedlinens sorted for fiber garnetting.',
    },
    {
      id: 'denim_scraps',
      name: 'Denim Jeans & Heavy Cotton Weave',
      minRate: 0.38,
      maxRate: 0.65,
      co2Factor: 3.9,
      treeFactor: 0.008,
      energyFactor: 9.2,
      waterFactor: 140,
      landfillFactor: 0.0032,
      description: 'Denim cuts and post-consumer jeans for eco-insulation batting.',
    },
    {
      id: 'synthetic_polyester',
      name: 'Polyester / Mixed Synthetic Fabric',
      minRate: 0.18,
      maxRate: 0.34,
      co2Factor: 2.4,
      treeFactor: 0.002,
      energyFactor: 6.8,
      waterFactor: 35,
      landfillFactor: 0.0036,
      description: 'Activewear, nylon cuttings, blended fabric remnants for acoustic felt.',
    },
  ],
};

/**
 * Pure calculation function for waste valuation and ecological impact.
 */
export function calculateValuation(
  category: WasteCategory,
  subTypeId: string,
  quantityKg: number
): ValuationMetrics {
  const safeQty = Math.max(0, quantityKg);
  const options = WASTE_RATES_DATA[category] || WASTE_RATES_DATA.Plastic;
  const selectedOption = options.find((opt) => opt.id === subTypeId) || options[0];

  const estimatedMinPrice = Number((safeQty * selectedOption.minRate).toFixed(2));
  const estimatedMaxPrice = Number((safeQty * selectedOption.maxRate).toFixed(2));
  const estimatedAvgPrice = Number(
    ((estimatedMinPrice + estimatedMaxPrice) / 2).toFixed(2)
  );

  const co2SavedKg = Number((safeQty * selectedOption.co2Factor).toFixed(1));
  const treesEquivalent = Number((safeQty * selectedOption.treeFactor).toFixed(2));
  const landfillVolumeDivertedM3 = Number(
    (safeQty * selectedOption.landfillFactor).toFixed(3)
  );
  const energySavedKwh = Number((safeQty * selectedOption.energyFactor).toFixed(1));
  const waterSavedLiters = Math.round(safeQty * selectedOption.waterFactor);

  return {
    category,
    subType: selectedOption.name,
    quantityKg: safeQty,
    estimatedMinPrice,
    estimatedMaxPrice,
    estimatedAvgPrice,
    co2SavedKg,
    treesEquivalent,
    landfillVolumeDivertedM3,
    energySavedKwh,
    waterSavedLiters,
  };
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
