import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export const PaymentModal = ({ isOpen, onClose, total }: PaymentModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const cryptoAddress = "18zzeUz9UXTZ58W6TxdKCh94un8JK7Jc3t";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cryptoAddress);
      setCopied(true);
      toast({
        title: "Address Copied!",
        description: "Bitcoin address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the address manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase - ${total}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto">Crypto Payment</TabsTrigger>
            <TabsTrigger value="tutorial">Payment Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold text-accent">Bitcoin (BTC) Payment</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Send exactly ${total} worth of Bitcoin to the address below
                </p>
              </div>

              <div className="surface-elevated rounded-lg p-4">
                <Label className="text-sm font-medium">Bitcoin Address:</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    value={cryptoAddress}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-orange-400 mb-2">Important Instructions:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Send exactly ${total} worth of Bitcoin</li>
                  <li>• Use CashApp or your preferred Bitcoin wallet</li>
                  <li>• Allow 1-3 confirmations for processing</li>
                  <li>• Contact support with transaction ID after payment</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Label>Customer Information</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Email Address" />
                <Input placeholder="Phone Number" />
                <Input placeholder="Bitcoin Transaction ID (after payment)" />
              </div>

              <Button className="w-full bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent">
                Confirm Order
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tutorial" className="space-y-4">
            <div>
              <Label className="text-lg font-semibold text-accent">How to Make Bitcoin Deposits</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Watch this tutorial to learn how to send Bitcoin payments
              </p>
            </div>

            <div className="w-full">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/Ba-LJhEd2Ko?si=cfU_hWvDwXsMS5X5"
                title="How to Make Bitcoin Deposits"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>

            <div className="surface-elevated rounded-lg p-4">
              <h4 className="font-semibold text-accent mb-2">Quick Steps:</h4>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Open your CashApp or Bitcoin wallet</li>
                <li>Select "Send" or "Transfer"</li>
                <li>Enter the Bitcoin address provided</li>
                <li>Enter the exact USD amount: ${total}</li>
                <li>Review and confirm the transaction</li>
                <li>Save the transaction ID for your records</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};