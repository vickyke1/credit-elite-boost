import { useState, useMemo } from "react";
import { generateTradelines } from "@/utils/tradelineData";
import { TradelineFilters } from "@/components/tradelines/TradelineFilters";
import { TradelineGrid } from "@/components/tradelines/TradelineGrid";
import { TradelinePagination } from "@/components/tradelines/TradelinePagination";
import { ShieldCheck, Sparkles } from "lucide-react";

const ExtensiveTradelineMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("age");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const allTradelines = useMemo(() => generateTradelines(), []);

  const filteredAndSortedTradelines = useMemo(() => {
    const filtered = allTradelines.filter(tradeline => {
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
  const totalLimit = allTradelines.reduce((sum, tradeline) => sum + tradeline.creditLimit, 0);
  const startingPrice = Math.min(...allTradelines.map((tradeline) => tradeline.price));

  return (
    <section className="min-h-screen bg-background pb-20 pt-14 md:pt-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 border-b border-border pb-9 animate-fade-in md:flex md:items-end md:justify-between md:gap-10">
          <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-5">
            <Sparkles className="h-4 w-4" />
            Premium Aged Tradelines
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Tradeline <span className="text-primary">Inventory</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Compare verified aged tradelines by bank, limit, age, reporting window, and price.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Verified inventory · Bank-grade security
          </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6 md:mt-0 md:min-w-[420px] md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <div className="text-xs text-muted-foreground">Available</div>
              <div className="mt-1 text-xl font-bold text-foreground">{allTradelines.length.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Limit</div>
              <div className="mt-1 text-xl font-bold text-primary">${(totalLimit / 1_000_000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">From</div>
              <div className="mt-1 text-xl font-bold text-accent">${startingPrice}</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div>
          <TradelineFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            resultCount={filteredAndSortedTradelines.length}
          />
        </div>

        {/* Tradeline Product Cards */}
        <TradelineGrid tradelines={paginatedTradelines} />

        {/* Pagination */}
        <TradelinePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default ExtensiveTradelineMarketplace;