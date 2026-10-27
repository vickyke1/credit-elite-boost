import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { followUpDraft, telegramChatUrl, type PaidBuyerOrder } from "@/lib/buyerTelegram";

export default function BuyerFollowUp({ order }: { order: PaidBuyerOrder }) {
  const [draft, setDraft] = useState(() => ["paid", "overpaid"].includes(order.status) ? followUpDraft(order) : `Hi @${order.telegram.replace(/^@/, "")}, how can I help with your CpnCreditBoost order ${order.id.slice(0, 8)}?`);
  const url = telegramChatUrl(order.telegram, draft);
  return (
    <div className="space-y-2">
      <Label htmlFor={`follow-up-${order.id}`}>Follow-up message</Label>
      <Textarea id={`follow-up-${order.id}`} value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} maxLength={2000} />
      {url ? <Button asChild size="sm" className="min-h-11"><a href={url} target="_blank" rel="noopener noreferrer"><Send className="w-4 h-4 mr-2" />Open Telegram chat</a></Button> : <p className="text-sm text-destructive">Valid Telegram username needed.</p>}
    </div>
  );
}