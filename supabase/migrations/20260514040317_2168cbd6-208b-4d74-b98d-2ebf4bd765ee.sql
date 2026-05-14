
-- Drop overly permissive public ALL/write policies
DROP POLICY IF EXISTS "public write events" ON public.order_events;
DROP POLICY IF EXISTS "public write products" ON public.products;
DROP POLICY IF EXISTS "public write sellers" ON public.sellers;
DROP POLICY IF EXISTS "public write orders" ON public.orders;
DROP POLICY IF EXISTS "public write drivers" ON public.drivers;
DROP POLICY IF EXISTS "public update support tickets response" ON public.support_tickets;

-- Public SELECT policies remain in place for catalog + tracking visibility.
-- All write operations now flow exclusively through edge functions using
-- the service role key (which bypasses RLS).

-- Prevent duplicate governance votes from the same voter on the same proposal.
-- Mitigates vote stuffing via varied voter_key by at least requiring distinct keys per proposal.
CREATE UNIQUE INDEX IF NOT EXISTS governance_votes_proposal_voter_key_idx
  ON public.governance_votes (proposal_id, voter_key);
