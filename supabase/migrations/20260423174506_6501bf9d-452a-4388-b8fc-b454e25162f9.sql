
-- =========================================
-- SELLERS
-- =========================================
CREATE TABLE public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location_label TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.5,
  total_orders INTEGER NOT NULL DEFAULT 0,
  avg_prep_minutes INTEGER NOT NULL DEFAULT 8,
  contribution_pct INTEGER NOT NULL DEFAULT 90,
  banner_image TEXT,
  category TEXT NOT NULL DEFAULT 'Groceries',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================
-- PRODUCTS
-- =========================================
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  unit TEXT NOT NULL DEFAULT '1 pc',
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  tag TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category);

-- =========================================
-- DRIVERS
-- =========================================
CREATE TABLE public.drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  vehicle TEXT NOT NULL DEFAULT 'Bike',
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.7,
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  current_lat DOUBLE PRECISION NOT NULL,
  current_lng DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'available', -- available | busy | offline
  last_assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_drivers_status ON public.drivers(status);

-- =========================================
-- ORDERS
-- =========================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code TEXT NOT NULL,                          -- e.g. CN-AB12
  customer_name TEXT NOT NULL DEFAULT 'You',
  customer_lat DOUBLE PRECISION NOT NULL,
  customer_lng DOUBLE PRECISION NOT NULL,
  customer_address TEXT NOT NULL DEFAULT 'Home',
  seller_id TEXT NOT NULL REFERENCES public.sellers(id),
  driver_id TEXT REFERENCES public.drivers(id),
  status TEXT NOT NULL DEFAULT 'placed', -- placed | packed | assigned | out_for_delivery | arrived | delivered | cancelled
  items JSONB NOT NULL,                  -- [{productId, name, qty, price, image}]
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  community_fund NUMERIC(10,2) NOT NULL DEFAULT 0,
  wait_penalty NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  seller_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
  driver_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
  distance_km NUMERIC(5,2) NOT NULL DEFAULT 1.5,
  assignment_reason JSONB,               -- {distance, rating, rotationRank, score}
  arrived_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_driver ON public.orders(driver_id);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

-- =========================================
-- ORDER EVENTS (timeline)
-- =========================================
CREATE TABLE public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  actor TEXT,                            -- 'system' | 'seller' | 'driver' | 'customer'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_events_order ON public.order_events(order_id, created_at);

-- =========================================
-- updated_at trigger
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- RLS — demo app (no auth), allow all
-- =========================================
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read sellers"   ON public.sellers   FOR SELECT USING (true);
CREATE POLICY "public write sellers"  ON public.sellers   FOR ALL    USING (true) WITH CHECK (true);

CREATE POLICY "public read products"  ON public.products  FOR SELECT USING (true);
CREATE POLICY "public write products" ON public.products  FOR ALL    USING (true) WITH CHECK (true);

CREATE POLICY "public read drivers"   ON public.drivers   FOR SELECT USING (true);
CREATE POLICY "public write drivers"  ON public.drivers   FOR ALL    USING (true) WITH CHECK (true);

CREATE POLICY "public read orders"    ON public.orders    FOR SELECT USING (true);
CREATE POLICY "public write orders"   ON public.orders    FOR ALL    USING (true) WITH CHECK (true);

CREATE POLICY "public read events"    ON public.order_events FOR SELECT USING (true);
CREATE POLICY "public write events"   ON public.order_events FOR ALL    USING (true) WITH CHECK (true);

-- =========================================
-- Realtime publication
-- =========================================
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_events REPLICA IDENTITY FULL;
ALTER TABLE public.drivers REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
