import { useState, useMemo, lazy, Suspense } from "react";
import { generateTradelines } from "@/utils/tradelineData";
import { TradelineFilters } from "@/components/tradelines/TradelineFilters";
import { TradelineTable } from "@/components/tradelines/TradelineTable";
import { TradelinePagination } from "@/components/tradelines/TradelinePagination";
import { TradelineStats } from "@/components/tradelines/TradelineStats";
import { ShieldCheck, Sparkles } from "lucide-react";

// Code-split the Recharts-powered analytics so the chart library stays out of
// the main bundle and only loads on this marketplace page.
const TradelineAnalytics = lazy(() =>
  import("@/components/tradelines/TradelineAnalytics").then((m) => ({
    default: m.TradelineAnalytics,
  }))
);

const AnalyticsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-14">
    <div className="glass-card rounded-2xl p-6 lg:col-span-2 h-[340px] skeleton-shimmer" />
    <div className="glass-card rounded-2xl p-6 h-[340px] skeleton-shimmer" />
  </div>
);

const ExtensiveTradelineMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("age");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  return (
    <section className="py-16 md:py-20 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-5">
            <Sparkles className="h-4 w-4" />
            Premium Aged Tradelines
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Tradeline Marketplace
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our extensive inventory of premium aged tradelines from top financial institutions.
            All tradelines are verified and guaranteed to report within 7-14 business days.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Verified inventory · Bank-grade security
          </div>
        </div>

        {/* KPI Overview */}
        <TradelineStats tradelines={allTradelines} />

        {/* Analytics Widgets */}
        <Suspense fallback={<AnalyticsSkeleton />}>
          <TradelineAnalytics tradelines={allTradelines} />
        </Suspense>

        {/* Search and Filters */}
        <div className="mt-14">
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

        {/* Tradelines Table */}
        <TradelineTable tradelines={paginatedTradelines} />

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