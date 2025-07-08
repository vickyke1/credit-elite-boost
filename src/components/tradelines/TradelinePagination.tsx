import { Button } from "@/components/ui/button";

interface TradelinePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TradelinePagination = ({ currentPage, totalPages, onPageChange }: TradelinePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button 
        variant="outline" 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
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
              onClick={() => onPageChange(pageNum)}
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
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};