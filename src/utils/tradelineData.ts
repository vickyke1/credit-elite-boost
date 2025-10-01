export interface Tradeline {
  id: string;
  bankName: string;
  cardId: string;
  creditLimit: number;
  dateOpened: string;
  purchaseDeadline: string;
  reportingPeriod: string;
  availability: number;
  price: number;
  age: string;
  ageInYears: number;
  status: 'available' | 'limited' | 'sold-out';
}

export const generateTradelines = (): Tradeline[] => {
  const banks = [
    "Chase", "American Express", "Capital One", "Citi", "Bank of America", "Wells Fargo", 
    "Discover", "Barclays", "U.S. Bank", "PNC", "TD Bank", "Regions", "SunTrust", 
    "Fifth Third", "KeyBank", "Huntington", "Synchrony", "Navy Federal", "USAA", 
    "First National", "Citizens Bank", "BB&T", "Union Bank", "HSBC", "Goldman Sachs",
    "Morgan Stanley", "Charles Schwab", "Fidelity", "Vanguard", "Ally Bank",
    "Marcus", "Truist", "BMO Harris", "M&T Bank", "Santander", "Citizens", "Regions",
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

  const tradelines = [];
  
  for (let i = 0; i < 1500; i++) {
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const creditLimit = [5000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 35000, 40000, 50000, 75000, 100000][Math.floor(Math.random() * 13)];
    const yearsOld = Math.floor(Math.random() * 15) + 2; // 2-16 years old
    const monthsOld = Math.floor(Math.random() * 12);
    
    const openDate = new Date();
    openDate.setFullYear(openDate.getFullYear() - yearsOld);
    openDate.setMonth(openDate.getMonth() - monthsOld);
    
    const purchaseDeadline = new Date();
    purchaseDeadline.setDate(purchaseDeadline.getDate() + Math.floor(Math.random() * 14) + 1);
    
    const reportingPeriod = Math.floor(Math.random() * 3) + 1; // 1-3 cycles
    const availability = Math.floor(Math.random() * 10) + 1; // 1-10 slots
    
    // Price calculation based on age and limit
    const basePrice = Math.floor((creditLimit / 1000) * (yearsOld * 8) + (Math.random() * 200) + 300);
    const price = Math.round(basePrice / 50) * 50; // Round to nearest $50
    
    tradelines.push({
      id: `TL${String(i + 1).padStart(4, '0')}`,
      bankName: bank,
      cardId: `${bank.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${cardType.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      creditLimit: creditLimit,
      dateOpened: openDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      purchaseDeadline: purchaseDeadline.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      reportingPeriod: `${reportingPeriod} cycle${reportingPeriod > 1 ? 's' : ''}`,
      availability: availability,
      price: price,
      age: `${yearsOld}y ${monthsOld}m`,
      ageInYears: yearsOld + (monthsOld / 12),
      status: availability > 3 ? 'available' : availability > 0 ? 'limited' : 'sold-out'
    });
  }
  
  return tradelines.sort((a, b) => b.ageInYears - a.ageInYears);
};