import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Generate realistic tradeline data
const generateTradelines = () => {
  const banks = [
    "Chase", "American Express", "Capital One", "Citi", "Bank of America", "Wells Fargo", 
    "Discover", "Barclays", "U.S. Bank", "PNC", "TD Bank", "Regions", "SunTrust", 
    "Fifth Third", "KeyBank", "Huntington", "Synchrony", "Navy Federal", "USAA", 
    "First National", "Citizens Bank", "BB&T", "Union Bank", "HSBC", "Goldman Sachs",
    "Morgan Stanley", "Charles Schwab", "Fidelity", "Vanguard", "Ally Bank"
  ];

  const cardTypes = [
    "Sapphire Preferred", "Sapphire Reserve", "Freedom Unlimited", "Freedom Flex",
    "Gold Card", "Platinum Card", "Blue Cash", "Green Card", "Venture", "VentureOne",
    "Quicksilver", "SavorOne", "Double Cash", "Premier", "Prestige", "Costco",
    "Cash Rewards", "Travel Rewards", "Platinum Rewards", "Cashback", "Miles",
    "Prime Rewards", "Business Cash", "Ink Preferred", "Spark Miles", "Executive"
  ];

  const tradelines = [];
  
  for (let i = 0; i < 350; i++) {
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

const ExtensiveTradelineMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("age");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const { addToCart } = useCart();
  const { toast } = useToast();

  const allTradelines = useMemo(() => generateTradelines(), []);

  const filteredAndSortedTradelines = useMemo(() => {
    let filtered = allTradelines.filter(tradeline => {
      const matchesSearch = tradeline.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tradeline.cardId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === "all" || 
                           (filterBy === "available" && tradeline.status === "available") ||
                           (filterBy === "limited" && tradeline.status === "limited") ||
                           (filterBy === "high-limit" && tradeline.creditLimit >= 25000) ||
                           (filterBy === "aged" && tradeline.ageInYears >= 8);
      
      return matchesSearch && matchesFilter;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "age":
          return b.ageInYears - a.ageInYears;
        case "limit":
          return b.creditLimit - a.creditLimit;
        case "price":
          return a.price - b.price;
        case "bank":
          return a.bankName.localeCompare(b.bankName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allTradelines, searchTerm, sortBy, filterBy]);

  const paginatedTradelines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTradelines.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTradelines, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedTradelines.length / itemsPerPage);

  const getStatusBadge = (status: string, availability: number) => {
    switch (status) {
      case 'available':
        return <Badge variant="secondary" className="bg-accent/20 text-accent">Available ({availability})</Badge>;
      case 'limited':
        return <Badge variant="outline" className="border-orange-500 text-orange-400">Limited ({availability})</Badge>;
      case 'sold-out':
        return <Badge variant="destructive">Sold Out</Badge>;
      default:
        return null;
    }
  };

  const handleAddToCart = (tradeline: any) => {
    const cartItem = {
      id: tradeline.id,
      bankName: tradeline.bankName,
      cardId: tradeline.cardId,
      creditLimit: tradeline.creditLimit,
      price: tradeline.price,
      age: tradeline.age
    };
    
    addToCart(cartItem);
    toast({
      title: "Added to Cart!",
      description: `${tradeline.bankName} tradeline added to your cart`,
    });
  };

  return (
    <section className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Tradeline Marketplace
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our extensive inventory of premium aged tradelines from top financial institutions.
            All tradelines are verified and guaranteed to report within 7-14 business days.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="surface-elevated rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by bank or card ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="age">Sort by Age (Oldest First)</SelectItem>
                <SelectItem value="limit">Sort by Credit Limit (Highest First)</SelectItem>
                <SelectItem value="price">Sort by Price (Lowest First)</SelectItem>
                <SelectItem value="bank">Sort by Bank Name</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter */}
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tradelines</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="limited">Limited Availability</SelectItem>
                <SelectItem value="high-limit">High Limit ($25K+)</SelectItem>
                <SelectItem value="aged">Aged (8+ Years)</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-surface-elevated rounded-lg px-4 py-2">
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedTradelines.length} tradelines found
              </span>
            </div>
          </div>
        </div>

        {/* Tradelines Table */}
        <div className="surface-elevated rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-hover">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Bank Name</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Card ID</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Credit Limit</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Date Opened</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Purchase Deadline</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Reporting Period</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Availability</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Price</th>
                  <th className="text-left p-4 font-semibold text-foreground border-b border-border">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTradelines.map((tradeline, index) => (
                  <tr key={tradeline.id} className="hover:bg-surface-hover transition-colors border-b border-border/50">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{tradeline.bankName}</div>
                      <div className="text-sm text-muted-foreground">{tradeline.age} old</div>
                    </td>
                    <td className="p-4">
                      <code className="text-sm bg-muted px-2 py-1 rounded text-primary">{tradeline.cardId}</code>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-accent">${tradeline.creditLimit.toLocaleString()}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{tradeline.dateOpened}</td>
                    <td className="p-4 text-muted-foreground">{tradeline.purchaseDeadline}</td>
                    <td className="p-4 text-muted-foreground">{tradeline.reportingPeriod}</td>
                    <td className="p-4">
                      {getStatusBadge(tradeline.status, tradeline.availability)}
                    </td>
                    <td className="p-4">
                      <div className="text-xl font-bold text-foreground">${tradeline.price}</div>
                    </td>
                    <td className="p-4">
                      <Button 
                        size="sm"
                        disabled={tradeline.status === 'sold-out'}
                        onClick={() => handleAddToCart(tradeline)}
                        className={`${
                          tradeline.status === 'sold-out' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent'
                        }`}
                      >
                        {tradeline.status === 'sold-out' ? 'Sold Out' : 'Add Individual to Cart'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button 
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="surface-elevated rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent">{allTradelines.length}+</div>
            <div className="text-muted-foreground">Total Tradelines</div>
          </div>
          <div className="surface-elevated rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-primary">${Math.min(...allTradelines.map(t => t.price))}</div>
            <div className="text-muted-foreground">Starting Price</div>
          </div>
          <div className="surface-elevated rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent">${Math.max(...allTradelines.map(t => t.creditLimit)).toLocaleString()}</div>
            <div className="text-muted-foreground">Highest Limit</div>
          </div>
          <div className="surface-elevated rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-primary">{Math.max(...allTradelines.map(t => t.ageInYears)).toFixed(0)}+</div>
            <div className="text-muted-foreground">Years Aged</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtensiveTradelineMarketplace;