import { useState, useMemo } from "react";
import { generateTradelines } from "@/utils/tradelineData";
import { TradelineFilters } from "@/components/tradelines/TradelineFilters";
import { TradelineGrid, useAddTradelineToCart } from "@/components/tradelines/TradelineGrid";
import { TradelineCompare } from "@/components/tradelines/TradelineCompare";
import { TradelineAdvisor } from "@/components/tradelines/TradelineAdvisor";
import { Button } from "@/components/ui/button";
import { Columns3 } from "lucide-react";
import { TradelinePagination } from "@/components/tradelines/TradelinePagination";
import { ShieldCheck, Sparkles } from "lucide-react";

const ExtensiveTradelineMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("age");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const addTradelineToCart = useAddTradelineToCart();
  const toggleCompare = (id: string) =>
    setCompareIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= 4 ? ids : [...ids, id]));

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
    <section className="min-h-screen bg-background pb-16 pt-8 md:pt-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 border-b border-border pb-6 animate-fade-in md:flex md:items-end md:justify-between md:gap-10">
          <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-5">
            <Sparkles className="h-4 w-4" />
            CpnCreditBoost
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Tradeline <span className="text-primary">Inventory</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Compare aged tradelines by bank, limit, age, reporting window, and price.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            USD prices · One-time purchase per tradeline
          </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 md:mt-0 md:min-w-[420px] md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <div className="text-xs text-muted-foreground">Available</div>
              <div className="mt-1 text-xl font-bold text-foreground">{allTradelines.filter(t => t.status !== "sold-out").length.toLocaleString()}</div>
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

        <TradelineAdvisor tradelines={allTradelines} onCompare={(ids) => { setCompareIds(ids); setCompareOpen(true); }} />

        {/* Search and Filters */}
        <div>
          <TradelineFilters
            searchTerm={searchTerm}
            setSearchTerm={(term) => { setSearchTerm(term); setCurrentPage(1); }}
            sortBy={sortBy}
            setSortBy={(value) => { setSortBy(value); setCurrentPage(1); }}
            filterBy={filterBy}
            setFilterBy={(value) => { setFilterBy(value); setCurrentPage(1); }}
            resultCount={filteredAndSortedTradelines.length}
          />
        </div>

        {/* Tradeline Product Cards */}
        <TradelineGrid tradelines={paginatedTradelines} compareIds={compareIds} onToggleCompare={toggleCompare} />

        {compareIds.length > 0 && (
          <div className="sticky bottom-4 z-30 mx-auto mt-4 flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-primary/40 bg-card px-4 py-2 shadow-elevated">
            <span className="text-sm">{compareIds.length} of 4 selected</span>
            <Button variant="ghost" size="sm" className="min-h-11" onClick={() => setCompareIds([])}>Clear</Button>
            <Button size="sm" className="min-h-11" onClick={() => setCompareOpen(true)}>
              <Columns3 className="h-4 w-4" /> Compare
            </Button>
          </div>
        )}

        <TradelineCompare
          open={compareOpen}
          onOpenChange={setCompareOpen}
          tradelines={compareIds.map((id) => allTradelines.find((t) => t.id === id)).filter((t): t is NonNullable<typeof t> => Boolean(t))}
          onRemove={toggleCompare}
          onAddToCart={addTradelineToCart}
        />

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