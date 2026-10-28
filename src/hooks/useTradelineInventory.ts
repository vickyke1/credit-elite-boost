import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateTradelines } from "@/utils/tradelineData";
import { applyPurchaseDeadlines } from "@/lib/purchaseDeadlines";

export const deadlineQueryKey = ["tradeline-purchase-deadlines"];

export function useTradelineInventory() {
  const query = useQuery({
    queryKey: deadlineQueryKey,
    queryFn: async () => {
      const rows: { listing_id: string; purchase_deadline: string }[] = [];
      // PostgREST caps a page; exhaust every page to include the full inventory.
      for (let start = 0; ; start += 1000) {
        const { data, error } = await supabase.from("tradeline_purchase_deadlines")
          .select("listing_id,purchase_deadline").order("listing_id").range(start, start + 999);
        if (error) throw error;
        rows.push(...data);
        if (data.length < 1000) return rows;
      }
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
  const inventory = useMemo(() => applyPurchaseDeadlines(generateTradelines(), query.data ?? []), [query.data]);
  return { inventory, ...query };
}