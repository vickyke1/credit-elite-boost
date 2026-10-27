import { useState } from "react";
import { Copy, Check, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const BTC_ADDRESS = "18zzeUz9UXTZ58W6TxdKCh94un8JK7Jc3t";
const CONTACT_URL = "https://t.me/Cpn_creditboost";

export const ManualPaymentOptions = () => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BTC_ADDRESS);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <section className="space-y-5 border-t border-border pt-5" aria-label="Private payment options">
      <div className="space-y-3">
        <h3 className="font-semibold text-primary">Cash App</h3>
        <p className="text-sm text-muted-foreground">Request the verified business payment link privately. A Bitcoin address is not a Cash App payment link.</p>
        <Button asChild variant="outline" className="w-full">
          <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer"><Send aria-hidden="true" /> Request Cash App link</a>
        </Button>
      </div>
      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="font-semibold text-primary">Direct Bitcoin payment</h3>
        <p className="text-sm text-muted-foreground">Before sending BTC, confirm the item is available and get the exact BTC amount and order reference from @Cpn_creditboost. Use the Bitcoin network only.</p>
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted p-3">
          <code className="min-w-0 flex-1 break-all text-xs">{BTC_ADDRESS}</code>
          <Button variant="ghost" size="icon" aria-label={copied ? "Bitcoin address copied" : "Copy Bitcoin address"} title="Copy Bitcoin address" onClick={copyAddress}>
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          </Button>
        </div>
        <p role="status" className="text-xs text-muted-foreground">{copyError ? "Copy unavailable. Select the address above to copy it manually." : copied ? "Bitcoin address copied." : "Save your transaction reference for receipt verification."}</p>
      </div>
      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="font-semibold">Zelle & Venmo</h3>
        <p className="text-sm text-muted-foreground">For Zelle or Venmo payment arrangements, contact @Cpn_creditboost privately on Telegram to confirm availability and recipient details.</p>
        <Button asChild className="w-full">
          <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden="true" /> Contact @Cpn_creditboost</a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Manual payments require verified receipt before an order is confirmed. Do not send money for an unavailable or unapproved product. Never share passwords, seed phrases, or private keys.</p>
    </section>
  );
};