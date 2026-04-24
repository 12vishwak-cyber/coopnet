ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.governance_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  proposer_label text NOT NULL,
  proposer_role text NOT NULL,
  status text NOT NULL DEFAULT 'voting',
  required_majority integer NOT NULL DEFAULT 60,
  total_members integer NOT NULL DEFAULT 48,
  deadline_at timestamp with time zone,
  activated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.governance_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.governance_proposals(id) ON DELETE CASCADE,
  voter_key text NOT NULL,
  voter_role text NOT NULL,
  vote text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (proposal_id, voter_key)
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_context text NOT NULL,
  actor_label text NOT NULL,
  category text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  status text NOT NULL DEFAULT 'open',
  order_ref text,
  response text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'governance_proposals' AND policyname = 'public read governance proposals'
  ) THEN
    CREATE POLICY "public read governance proposals"
    ON public.governance_proposals
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'governance_proposals' AND policyname = 'public write governance proposals'
  ) THEN
    CREATE POLICY "public write governance proposals"
    ON public.governance_proposals
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'governance_votes' AND policyname = 'public read governance votes'
  ) THEN
    CREATE POLICY "public read governance votes"
    ON public.governance_votes
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'governance_votes' AND policyname = 'public write governance votes'
  ) THEN
    CREATE POLICY "public write governance votes"
    ON public.governance_votes
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'support_tickets' AND policyname = 'public read support tickets'
  ) THEN
    CREATE POLICY "public read support tickets"
    ON public.support_tickets
    FOR SELECT
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'support_tickets' AND policyname = 'public write support tickets'
  ) THEN
    CREATE POLICY "public write support tickets"
    ON public.support_tickets
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_governance_votes_proposal_id ON public.governance_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_role_context_status ON public.support_tickets(role_context, status);

DROP TRIGGER IF EXISTS set_governance_proposals_updated_at ON public.governance_proposals;
CREATE TRIGGER set_governance_proposals_updated_at
BEFORE UPDATE ON public.governance_proposals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER set_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();