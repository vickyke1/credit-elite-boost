import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface TradelineFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  filterBy: string;
  setFilterBy: (filter: string) => void;
  resultCount: number;
}

export const TradelineFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  resultCount
}: TradelineFiltersProps) => {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
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
        <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2">
          <span className="status-dot h-2 w-2 rounded-full bg-accent" />
          <span className="text-sm font-medium text-foreground">
            <span className="font-bold text-primary">{resultCount.toLocaleString()}</span> tradelines found
          </span>
        </div>
      </div>
    </div>
  );
};