import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, AlertTriangle, Loader2 } from "lucide-react";
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
                  {loadingAddress ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Loading secure address...</span>
                    </div>
                  ) : cryptoAddress ? (
                    <>
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
                    </>
                  ) : (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
                      Failed to load payment address. Please refresh the page.
                    </div>
                  )}
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