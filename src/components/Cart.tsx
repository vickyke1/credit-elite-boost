import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { PaymentModal } from "./PaymentModal";

export const Cart = () => {
  const { items, removeFromCart, getTotalPrice, getItemCount, clearCart } = useCart();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {getItemCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-accent text-background">
                {getItemCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Shopping Cart ({getItemCount()} items)</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.id} className="surface-elevated rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        {item.type === 'tradeline' ? (
                          <>
                            <p className="text-sm text-muted-foreground">{item.cardId}</p>
                            <p className="text-sm text-accent">${item.creditLimit?.toLocaleString()} limit</p>
                            <p className="text-xs text-muted-foreground">{item.age} old</p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">${item.price}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-border pt-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-accent">${getTotalPrice()}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-cta hover:scale-105 transition-transform duration-300 glow-accent"
                    onClick={() => setIsPaymentOpen(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={getTotalPrice()}
        items={items}
        onSuccess={clearCart}
      />
    </>
  );
};