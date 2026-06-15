// Server-side source of truth for pricing & availability.
//
// Tradelines are generated deterministically from a fixed seed — identical to
// the front-end generator in src/utils/tradelineData.ts — so the server can
// re-derive the authoritative price/availability for any card id without a DB
// round-trip and WITHOUT trusting any price sent by the browser.
//
// Education products are a small, explicit allow-list of LEGAL credit-education
// items. CPN / identity products are intentionally absent and therefore can
// never pass validation.

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const banks = [
  "Chase", "American Express", "Capital One", "Citi", "Bank of America", "Wells Fargo",
  "Discover", "Barclays", "U.S. Bank", "PNC", "TD Bank", "Regions", "SunTrust",
  "Fifth Third", "KeyBank", "Huntington", "Synchrony", "Navy Federal", "USAA",
  "First National", "Citizens Bank", "BB&T", "Union Bank", "HSBC", "Goldman Sachs",
  "Morgan Stanley", "Charles Schwab", "Fidelity", "Vanguard", "Ally Bank",
  "Marcus", "Truist", "BMO Harris", "M&T Bank", "Santander", "Citizens",
  "First Citizens", "Comerica", "Zions", "Webster Bank", "BOK Financial", "Synovus",
  "Valley National", "Old National", "First Horizon", "Umpqua", "BancorpSouth", "Arvest",
  "Frost Bank", "Associated Bank", "Commerce Bank", "Pinnacle", "Texas Capital", "CIT Bank",
];

export interface CatalogTradeline {
  cardId: string;
  bankName: string;
  price: number;
  availability: number;
  status: "available" | "limited" | "sold-out";
}

const TOTAL_TRADELINES = 1500;
let cache: Map<string, CatalogTradeline> | null = null;

const buildTradelines = (): Map<string, CatalogTradeline> => {
  if (cache) return cache;
  const rand = mulberry32(20240517);
  const map = new Map<string, CatalogTradeline>();
  const usedCardIds = new Set<string>();
  const limits = [25000, 30000, 35000, 40000, 50000, 60000, 75000, 85000, 100000, 125000, 150000];

  // Each iteration must draw rand() in the SAME order and count as the
  // front-end generator (src/utils/tradelineData.ts) so card ids and prices
  // line up. rand() advances the generator regardless of the arithmetic
  // applied, so unused draws are plain rand() calls.
  for (let i = 0; i < TOTAL_TRADELINES; i++) {
    const bank = banks[Math.floor(rand() * banks.length)];
    rand(); // cardName draw
    const creditLimit = limits[Math.floor(rand() * limits.length)];
    const yearsOld = Math.floor(rand() * 15) + 2;
    rand(); // monthsOld
    rand(); // deadlineOffset
    rand(); // reportingCycles
    const availability = Math.floor(rand() * 10) + 1;

    const basePrice = Math.floor((creditLimit / 2000) * (yearsOld * 2) + rand() * 100 + 150);
    const price = Math.round(basePrice / 25) * 25;

    let cardId = String(10000 + Math.floor(rand() * 89999));
    while (usedCardIds.has(cardId)) {
      cardId = String(10000 + ((Number(cardId) - 10000 + 1) % 89999));
    }
    usedCardIds.add(cardId);

    map.set(cardId, {
      cardId,
      bankName: bank,
      price,
      availability,
      status: availability > 3 ? "available" : availability > 0 ? "limited" : "sold-out",
    });
  }
  cache = map;
  return map;
};

export const getTradelineByCardId = (cardId: string): CatalogTradeline | undefined =>
  buildTradelines().get(cardId);

export interface EducationProduct {
  sku: string;
  name: string;
  price: number; // USD
}

// Legal, digital credit-education products only.
export const EDUCATION_PRODUCTS: Record<string, EducationProduct> = {
  "edu-credit-fundamentals": { sku: "edu-credit-fundamentals", name: "Credit Fundamentals Course", price: 49 },
  "edu-credit-building-guide": { sku: "edu-credit-building-guide", name: "Credit Building Playbook (eBook)", price: 29 },
  "edu-dispute-toolkit": { sku: "edu-dispute-toolkit", name: "FCRA Dispute Letter Toolkit", price: 39 },
  "edu-tradeline-strategy": { sku: "edu-tradeline-strategy", name: "Authorized-User Tradeline Strategy Guide", price: 59 },
};

export interface IncomingItem {
  type: string;
  ref: string; // tradeline cardId or education sku
  price?: number; // browser-claimed price (NOT trusted)
  quantity?: number;
}

export interface ValidatedItem {
  productType: "tradeline" | "education";
  productRef: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  items: ValidatedItem[];
  subtotalCents: number;
  totalCents: number;
}

// Validate a cart entirely from server-side data. Any unrecognised product
// (including CPN/identity packages) is rejected.
export const validateCart = (incoming: IncomingItem[]): ValidationResult => {
  const errors: string[] = [];
  const items: ValidatedItem[] = [];

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return { valid: false, errors: ["Cart is empty."], items: [], subtotalCents: 0, totalCents: 0 };
  }

  for (const raw of incoming) {
    const quantity = Math.max(1, Math.floor(Number(raw.quantity) || 1));

    if (raw.type === "tradeline") {
      const tl = getTradelineByCardId(String(raw.ref));
      if (!tl) {
        errors.push(`Tradeline ${raw.ref} is no longer listed.`);
        continue;
      }
      if (tl.status === "sold-out" || tl.availability <= 0) {
        errors.push(`Tradeline ${tl.bankName} (${tl.cardId}) is sold out.`);
        continue;
      }
      items.push({
        productType: "tradeline",
        productRef: tl.cardId,
        name: `${tl.bankName} Tradeline #${tl.cardId}`,
        unitPriceCents: Math.round(tl.price * 100),
        quantity,
      });
    } else if (raw.type === "education") {
      const product = EDUCATION_PRODUCTS[String(raw.ref)];
      if (!product) {
        errors.push(`Education product ${raw.ref} is not available.`);
        continue;
      }
      items.push({
        productType: "education",
        productRef: product.sku,
        name: product.name,
        unitPriceCents: Math.round(product.price * 100),
        quantity,
      });
    } else {
      // Unsupported product type (e.g. CPN / identity packages) — blocked.
      errors.push(`Product "${raw.ref}" cannot be purchased through online checkout.`);
    }
  }

  const subtotalCents = items.reduce((sum, it) => sum + it.unitPriceCents * it.quantity, 0);

  return {
    valid: errors.length === 0 && items.length > 0,
    errors,
    items,
    subtotalCents,
    totalCents: subtotalCents, // no automatic discounts; promo codes validated separately
  };
};
