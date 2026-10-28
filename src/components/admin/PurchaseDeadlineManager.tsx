import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTradelineInventory, deadlineQueryKey } from "@/hooks/useTradelineInventory";
import { deadlineISO, displayDeadline, extendedDeadline, isDeadlineExpired, utcToday } from "@/lib/purchaseDeadlines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

type Change = { listing_id: string; previous_deadline: string; new_deadline: string };
type Result = { listing_id: string; updated: boolean; error?: string };

export default function PurchaseDeadlineManager() {
  const { inventory, isPending, error, data } = useTradelineInventory();
  const client = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState("expired");
  const [search, setSearch] = useState("");
  const [days, setDays] = useState(7);
  const [date, setDate] = useState<Date>();
  const [mode, setMode] = useState("days");
  const [preview, setPreview] = useState<Change[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const today = utcToday();
  const storedIds = useMemo(() => new Set(data?.map(row => row.listing_id)), [data]);
  const expired = inventory.filter(item => isDeadlineExpired(item.purchaseDeadline, today));
  const upcoming = inventory.filter(item => !isDeadlineExpired(item.purchaseDeadline, today));
  const candidates = view === "expired" ? expired : upcoming;
  const filtered = candidates.filter(item => `${item.id} ${item.cardId} ${item.bankName}`.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 50));
  const visible = filtered.slice((Math.min(page, pages) - 1) * 50, Math.min(page, pages) * 50);
  const { data: audit, error: auditError } = useQuery({
    queryKey: ["tradeline-deadline-audit"],
    queryFn: async () => {
      const response = await supabase.from("tradeline_deadline_audit").select("*").order("updated_at", { ascending: false }).limit(100);
      if (response.error) throw response.error;
      return response.data;
    },
  });

  function prepare() {
    setMessage("");
    try {
      const newDeadline = mode === "days" ? extendedDeadline(days, today) : date ? format(date, "yyyy-MM-dd") : "";
      if (!newDeadline || newDeadline < today) throw new Error("Choose today or a future date.");
      const changes = inventory.filter(item => selected.has(item.id)).map(item => ({ listing_id: item.id, previous_deadline: deadlineISO(item.purchaseDeadline), new_deadline: newDeadline }));
      if (!changes.length) throw new Error("Select at least one listing.");
      if (changes.some(item => item.new_deadline <= item.previous_deadline)) throw new Error("The new date must extend every selected listing’s current deadline.");
      setPreview(changes);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Check the selected date."); }
  }

  async function confirm() {
    setBusy(true);
    try {
      const response = await supabase.rpc("extend_purchase_deadlines", { p_changes: preview });
      if (response.error) throw response.error;
      const outcome = response.data as unknown as Result[];
      setResults(outcome);
      setSelected(new Set(outcome.filter(item => !item.updated).map(item => item.listing_id)));
      setPreview([]);
      await Promise.all([client.invalidateQueries({ queryKey: deadlineQueryKey }), client.invalidateQueries({ queryKey: ["tradeline-deadline-audit"] })]);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Update failed. Refresh and try again."); }
    finally { setBusy(false); }
  }

  return <section className="space-y-5" aria-label="Purchase deadline management">
    <h2 className="text-xl font-semibold">Extend Purchase Deadlines</h2>
    {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : error ? <p role="alert" className="text-destructive">Could not load saved deadlines. Refresh before making changes.</p> : <>
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={view} onValueChange={value => { setView(value); setPage(1); }}><TabsList><TabsTrigger className="min-h-11" value="expired">Expired ({expired.length})</TabsTrigger><TabsTrigger className="min-h-11" value="upcoming">Upcoming ({upcoming.length})</TabsTrigger></TabsList></Tabs>
        <Input className="w-full sm:w-64 min-h-11" aria-label="Search deadlines" placeholder="Bank, listing ID or card ID" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} />
        <Button variant="outline" className="min-h-11" onClick={() => setSelected(new Set(candidates.filter(item => storedIds.has(item.id)).map(item => item.id)))}>Select all {view} ({candidates.length})</Button>
        <Button variant="ghost" className="min-h-11" onClick={() => setSelected(new Set())}>Clear ({selected.size})</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-y border-border py-4">
        <Tabs value={mode} onValueChange={setMode}><TabsList><TabsTrigger value="days" className="min-h-11">Days from today (UTC)</TabsTrigger><TabsTrigger value="date" className="min-h-11">Custom date</TabsTrigger></TabsList></Tabs>
        {mode === "days" ? <><div className="flex gap-2">{[7, 14, 30].map(value => <Button key={value} className="min-h-11" variant={days === value ? "default" : "outline"} onClick={() => setDays(value)}>{value} days</Button>)}</div><Input type="number" min={1} step={1} aria-label="Custom extension days" className="w-24 min-h-11" value={days} onChange={event => setDays(Number(event.target.value))} /></> : <Popover><PopoverTrigger asChild><Button variant="outline" className="min-h-11"><CalendarIcon className="h-4 w-4" />{date ? format(date, "PPP") : "Choose deadline"}</Button></PopoverTrigger><PopoverContent align="start" className="w-auto p-0 pointer-events-auto"><Calendar mode="single" selected={date} onSelect={setDate} disabled={value => format(value, "yyyy-MM-dd") < today} className="p-3 pointer-events-auto" /></PopoverContent></Popover>}
        <Button className="min-h-11" disabled={!selected.size || busy} onClick={prepare}>Preview changes ({selected.size})</Button>
      </div>
      <p className="text-sm text-muted-foreground">Today: {displayDeadline(today)} (UTC) · Only purchase deadlines change. Reporting windows remain unchanged.</p>
      {message && <p role="alert" className="text-destructive">{message}</p>}
      {results.length > 0 && <div role="status" className="border-l-4 border-primary pl-4"><p className="font-semibold">{results.filter(item => item.updated).length} listings updated · {results.filter(item => !item.updated).length} failed</p>{results.filter(item => !item.updated).map(item => <p className="text-sm text-destructive" key={item.listing_id}>{item.listing_id}: {item.error}</p>)}</div>}
      <div className="overflow-x-auto max-h-[540px] border border-border rounded-lg">
        <table className="w-full text-sm"><thead className="sticky top-0 bg-card"><tr><th className="p-3 text-left">Select</th><th className="p-3 text-left">Listing</th><th className="p-3 text-left">Buy By</th><th className="p-3 text-left">Reporting window</th></tr></thead><tbody>{visible.map(item => <tr key={item.id} className="border-t border-border even:bg-muted/30"><td className="p-3"><label className="flex min-h-11 min-w-11 items-center"><Checkbox aria-label={`Select ${item.id}`} disabled={!storedIds.has(item.id)} checked={selected.has(item.id)} onCheckedChange={checked => setSelected(previous => { const next = new Set(previous); if (checked === true) next.add(item.id); else next.delete(item.id); return next; })} /></label></td><td className="p-3 whitespace-nowrap">{item.bankName}<div className="text-muted-foreground">{item.id} · Card {item.cardId}</div></td><td className="p-3 whitespace-nowrap">{item.purchaseDeadline}</td><td className="p-3 whitespace-nowrap">{item.firstReportingPeriod}</td></tr>)}</tbody></table>
        {!filtered.length && <p className="p-4 text-muted-foreground">No {view} listings found.</p>}
      </div>
      <div className="flex items-center justify-end gap-3"><Button variant="outline" className="min-h-11" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</Button><span className="text-sm">{Math.min(page, pages)} / {pages}</span><Button variant="outline" className="min-h-11" disabled={page >= pages} onClick={() => setPage(value => value + 1)}>Next</Button></div>
    </>}
    <h3 className="font-semibold">Deadline audit history</h3>
    {auditError && <p role="alert" className="text-destructive">Could not load audit history.</p>}
    <div className="max-h-80 overflow-auto text-sm">{audit?.length ? audit.map(row => <div key={row.id} className="border-b border-border py-3"><p>{row.listing_id} · {displayDeadline(row.previous_deadline)} → {displayDeadline(row.new_deadline)}</p><p className="text-muted-foreground break-all">{new Date(row.updated_at).toLocaleString()} · Admin {row.administrator}</p></div>) : <p className="text-muted-foreground">No deadline changes recorded.</p>}</div>
    <AlertDialog open={preview.length > 0} onOpenChange={open => { if (!open && !busy) setPreview([]); }}><AlertDialogContent className="max-w-2xl max-h-[85dvh] overflow-y-auto"><AlertDialogHeader><AlertDialogTitle>Confirm purchase deadline extensions</AlertDialogTitle><AlertDialogDescription>{preview.length} listings selected. Only the purchase deadline will change; all other listing details are preserved.</AlertDialogDescription></AlertDialogHeader><div className="max-h-80 overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-card"><tr><th className="p-2 text-left">Listing</th><th className="p-2 text-left">Old deadline</th><th className="p-2 text-left">New deadline</th></tr></thead><tbody>{preview.map(item => <tr key={item.listing_id}><td className="p-2">{item.listing_id}</td><td className="p-2">{displayDeadline(item.previous_deadline)}</td><td className="p-2">{displayDeadline(item.new_deadline)}</td></tr>)}</tbody></table></div>{message && <p role="alert" className="text-destructive">{message}</p>}<AlertDialogFooter><AlertDialogCancel disabled={busy} className="min-h-11">Cancel</AlertDialogCancel><Button disabled={busy} className="min-h-11" onClick={() => { void confirm(); }}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Confirm extension</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </section>;
}