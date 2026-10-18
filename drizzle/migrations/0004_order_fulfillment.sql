ALTER TABLE public.orders ADD COLUMN fulfillment_status text NOT NULL DEFAULT 'unfulfilled';
ALTER TABLE public.orders ADD COLUMN fulfillment_note text;
ALTER TABLE public.orders ADD COLUMN fulfilled_at timestamptz;
ALTER TABLE public.orders ADD CONSTRAINT orders_fulfillment_status_check CHECK (fulfillment_status IN ('unfulfilled','fulfilled','cancelled')) NOT VALID;
COMMENT ON COLUMN public.orders.fulfillment_status IS 'Owner-controlled delivery state: unfulfilled until the owner sends the tradeline details to the buyer.';