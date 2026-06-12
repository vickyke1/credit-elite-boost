export interface Tradeline {
  id: string;
  slug: string;
  bankName: string;
  cardName: string;
  cardId: string;
  creditLimit: number;
  dateOpened: string;
  purchaseDeadline: string;
  reportingPeriod: string;
  firstReportingPeriod: string;
  availability: number;
  price: number;
  age: string;
  ageInYears: number;
  description: string;
  status: 'available' | 'limited' | 'sold-out';
}

// Deterministic PRNG (mulberry32). Using a fixed seed keeps the generated
// inventory stable across renders and — crucially — across page loads, so a
// product detail page can reliably look a tradeline up by its slug / card id.
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
  "Frost Bank", "Associated Bank", "Commerce Bank", "Pinnacle", "Texas Capital", "CIT Bank"
];

const cardTypes = [
  "Sapphire Preferred", "Sapphire Reserve", "Freedom Unlimited", "Freedom Flex",
  "Gold Card", "Platinum Card", "Blue Cash", "Green Card", "Venture", "VentureOne",
  "Quicksilver", "SavorOne", "Double Cash", "Premier", "Prestige", "Costco",
  "Cash Rewards", "Travel Rewards", "Platinum Rewards", "Cashback", "Miles",
  "Prime Rewards", "Business Cash", "Ink Preferred", "Spark Miles", "Executive"
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

const formatShortDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const TOTAL_TRADELINES = 1500;

let cachedTradelines: Tradeline[] | null = null;

export const generateTradelines = (): Tradeline[] => {
  if (cachedTradelines) {
    return cachedTradelines;
  }

  const rand = mulberry32(20240517);
  const tradelines: Tradeline[] = [];
  const usedCardIds = new Set<string>();
  const limits = [25000, 30000, 35000, 40000, 50000, 60000, 75000, 85000, 100000, 125000, 150000];

  for (let i = 0; i < TOTAL_TRADELINES; i++) {
    const bank = banks[Math.floor(rand() * banks.length)];
    const cardName = cardTypes[Math.floor(rand() * cardTypes.length)];
    const creditLimit = limits[Math.floor(rand() * limits.length)];
    const yearsOld = Math.floor(rand() * 15) + 2; // 2-16 years old
    const monthsOld = Math.floor(rand() * 12);

    const openDate = new Date();
    openDate.setFullYear(openDate.getFullYear() - yearsOld);
    openDate.setMonth(openDate.getMonth() - monthsOld);

    // Deadlines sit comfortably in the future (30-75 days out) so listings
    // never show an imminent or stale cutoff date.
    const deadlineOffset = Math.floor(rand() * 46) + 30;
    const purchaseDeadline = new Date();
    purchaseDeadline.setDate(purchaseDeadline.getDate() + deadlineOffset);

    // First reporting window: opens ~11 days after the purchase deadline and
    // runs for a 7-day statement cycle (mirrors how AU tradelines post).
    const reportStart = new Date(purchaseDeadline);
    reportStart.setDate(reportStart.getDate() + 11);
    const reportEnd = new Date(reportStart);
    reportEnd.setDate(reportEnd.getDate() + 7);

    const reportingCycles = Math.floor(rand() * 3) + 1; // 1-3 cycles
    const availability = Math.floor(rand() * 10) + 1; // 1-10 slots

    // Price calculation - low prices for high limits
    const basePrice = Math.floor((creditLimit / 2000) * (yearsOld * 2) + rand() * 100 + 150);
    const price = Math.round(basePrice / 25) * 25; // Round to nearest $25

    // Deterministic, unique numeric card id (mirrors supplier-style IDs).
    let cardId = String(10000 + Math.floor(rand() * 89999));
    while (usedCardIds.has(cardId)) {
      cardId = String(10000 + ((Number(cardId) - 10000 + 1) % 89999));
    }
    usedCardIds.add(cardId);

    const age = `${yearsOld}y ${monthsOld}m`;
    const ageCompact = `${yearsOld}y${monthsOld}m`;
    const slug = `${slugify(bank)}-${cardId}`;

    const description =
      `Seasoned ${bank} tradeline with a ${ageCompact} age and a $${creditLimit.toLocaleString()} ` +
      `credit limit. This seasoned authorized user credit card tradeline is guaranteed to post by ` +
      `${formatShortDate(reportEnd)} when purchased by ${formatShortDate(purchaseDeadline)}. ` +
      `This tradeline is also guaranteed to have no late payments ever reported and a utilization of 15% or lower.`;

    tradelines.push({
      id: `TL${String(i + 1).padStart(4, '0')}`,
      slug,
      bankName: bank,
      cardName,
      cardId,
      creditLimit,
      dateOpened: formatDate(openDate),
      purchaseDeadline: formatDate(purchaseDeadline),
      reportingPeriod: `${reportingCycles} cycle${reportingCycles > 1 ? 's' : ''}`,
      firstReportingPeriod: `${formatShortDate(reportStart)} - ${formatShortDate(reportEnd)}`,
      availability,
      price,
      age,
      ageInYears: yearsOld + monthsOld / 12,
      description,
      status: availability > 3 ? 'available' : availability > 0 ? 'limited' : 'sold-out'
    });
  }

  cachedTradelines = tradelines.sort((a, b) => b.ageInYears - a.ageInYears);
  return cachedTradelines;
};

export const getTradelineBySlug = (slug: string): Tradeline | undefined =>
  generateTradelines().find((tradeline) => tradeline.slug === slug);

export const getTradelineByCardId = (cardId: string): Tradeline | undefined =>
  generateTradelines().find((tradeline) => tradeline.cardId === cardId);

export const getProductUrl = (tradeline: Tradeline): string =>
  `/product/${tradeline.slug}?card_id=${tradeline.cardId}`;
