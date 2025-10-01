import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, AlertTriangle, Loader2, QrCode } from "lucide-react";
import bitcoinQR from "@/assets/bitcoin-qr.jpg";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { emailSchema, phoneSchema, nameSchema, transactionIdSchema, SECURITY_CONFIG } from "@/lib/security";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

const paymentFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  transactionId: transactionIdSchema.optional()
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

export const PaymentModal = ({ isOpen, onClose, total }: PaymentModalProps) => {
  const [copied, setCopied] = useState(false);
  const [cryptoAddress, setCryptoAddress] = useState<string>("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema)
  });

  // Fetch Bitcoin address securely from backend when modal opens
  useEffect(() => {
    const fetchPaymentAddress = async () => {
      if (!isOpen || cryptoAddress) return;
      setLoadingAddress(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-payment-address');
        
        if (error) throw error;
        
        if (data?.address) {
          setCryptoAddress(data.address);
        } else {
          throw new Error('No address received');
        }
      } catch (err) {
        console.error('Failed to fetch payment address:', err);
        toast({
          title: "Error",
          description: "Failed to load payment address. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchPaymentAddress();
  }, [isOpen, cryptoAddress, toast]);

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

  const onSubmit = (data: PaymentFormData) => {
    toast({
      title: "Order Submitted!",
      description: "Your order has been submitted. We'll contact you shortly.",
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase - ${total}</DialogTitle>
          <DialogDescription>Secure checkout via crypto. Your payment address is generated server-side.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto">Crypto Payment</TabsTrigger>
            <TabsTrigger value="tutorial">Payment Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold text-accent">Cryptocurrency Payment Options</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose your preferred crypto payment method
                </p>
              </div>

              {/* Cashaap Payment */}
              <div className="surface-elevated rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-3">Option 1: Pay with Cashaap (Recommended)</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Quick and secure crypto payment through Cashaap platform
                </p>
                <Button
                  onClick={() => cryptoAddress && window.open(`https://cashaap.com/pay?address=${cryptoAddress}&amount=${total}&currency=USD`, '_blank')}
                  className="w-full bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent mb-2"
                  disabled={!cryptoAddress || loadingAddress}
                >
                  {loadingAddress ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Preparing payment…</span>
                  ) : (
                    <>Pay ${total} with Cashaap</>
                  )}
                </Button>
              </div>

              {/* Direct Bitcoin Payment */}
              <div className="surface-elevated rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-3">Option 2: Direct Bitcoin Payment</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-muted rounded-lg">
                    <QrCode className="w-5 h-5 text-accent mb-2" />
                    <p className="text-sm font-medium text-accent mb-3">Scan with CashApp or Phone</p>
                    <img 
                      src={bitcoinQR} 
                      alt="Bitcoin Payment QR Code" 
                      className="w-48 h-48 rounded-lg border-2 border-accent/20"
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">Scan to pay instantly</p>
                  </div>

                  {/* Address Section */}
                  <div className="flex flex-col justify-center">
                    <Label className="text-sm font-medium mb-2">Or Copy Bitcoin Address:</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={cryptoAddress}
                        readOnly
                        placeholder={loadingAddress ? 'Loading address…' : 'Bitcoin address will appear here'}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="shrink-0"
                        disabled={!cryptoAddress}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Send exactly ${total} worth of Bitcoin
                    </p>
                  </div>
                </div>
              </div>

              {/* Alternative Payment Methods */}
              <div className="surface-elevated rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-3">Alternative Payment Methods</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We also accept payments via:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>Zelle:</strong> Contact us at Admin@cpncreditboost.com</li>
                  <li>• <strong>Venmo:</strong> Contact us at Admin@cpncreditboost.com</li>
                </ul>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-orange-400 mb-2">Payment Instructions:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Send exactly ${total} worth of Bitcoin</li>
                  <li>• Use Cashaap for fastest processing</li>
                  <li>• For Zelle/Venmo, email Admin@cpncreditboost.com first</li>
                  <li>• Allow 1-3 confirmations for crypto payments</li>
                  <li>• Save transaction ID for your records</li>
                </ul>
              </div>

              <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Security Notice:</strong> Only provide personal information after completing your Bitcoin payment. 
                  Never share sensitive financial information through unsecured channels.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Label>Customer Information</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input 
                      {...register("firstName")}
                      placeholder="First Name" 
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Input 
                      {...register("lastName")}
                      placeholder="Last Name" 
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Input 
                    {...register("email")}
                    placeholder="Email Address" 
                    type="email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Input 
                    {...register("phone")}
                    placeholder="Phone Number" 
                    type="tel"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <Input 
                    {...register("transactionId")}
                    placeholder="Bitcoin Transaction ID (after payment)" 
                    className={errors.transactionId ? "border-red-500" : ""}
                  />
                  {errors.transactionId && (
                    <p className="text-red-500 text-sm mt-1">{errors.transactionId.message}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent"
                >
                  Confirm Order
                </Button>
              </form>
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
                src="https://www.youtube.com/embed/fDjDH_WAvYI?si=cfU_hWvDwXsMS5X5&t=4s"
                title="How to Make Bitcoin Payments"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>

            <div className="surface-elevated rounded-lg p-4">
              <h4 className="font-semibold text-accent mb-2">Payment Methods:</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-accent mb-2">1. Cashaap (Fastest)</h5>
                  <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside ml-4">
                    <li>Click the "Pay with Cashaap" button above</li>
                    <li>Complete payment on Cashaap platform</li>
                    <li>Return here to submit your information</li>
                  </ol>
                </div>
                <div>
                  <h5 className="font-medium text-accent mb-2">2. Direct Bitcoin</h5>
                  <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside ml-4">
                    <li>Copy our Bitcoin address: {cryptoAddress || 'loading…'}</li>
                    <li>Open your Bitcoin wallet (CashApp, etc.)</li>
                    <li>Send exactly ${total} worth of Bitcoin</li>
                    <li>Save the transaction ID</li>
                  </ol>
                </div>
                <div>
                  <h5 className="font-medium text-accent mb-2">3. Zelle/Venmo</h5>
                  <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside ml-4">
                    <li>Email Admin@cpncreditboost.com</li>
                    <li>Request payment instructions</li>
                    <li>Complete payment via your preferred method</li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};