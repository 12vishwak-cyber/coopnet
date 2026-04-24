DROP POLICY IF EXISTS "public write governance proposals" ON public.governance_proposals;
DROP POLICY IF EXISTS "public write governance votes" ON public.governance_votes;
DROP POLICY IF EXISTS "public write support tickets" ON public.support_tickets;

CREATE POLICY "public insert governance votes"
ON public.governance_votes
FOR INSERT
WITH CHECK (
  vote IN ('for', 'against')
  AND voter_role IN ('customer', 'seller', 'worker')
  AND length(trim(voter_key)) >= 3
);

CREATE POLICY "public insert support tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (
  role_context IN ('seller', 'worker')
  AND priority IN ('low', 'normal', 'high', 'urgent')
  AND status = 'open'
  AND length(trim(actor_label)) >= 3
  AND length(trim(subject)) >= 5
  AND length(trim(message)) >= 10
);

CREATE POLICY "public update support tickets response"
ON public.support_tickets
FOR UPDATE
USING (status IN ('open', 'in_progress', 'resolved'))
WITH CHECK (
  role_context IN ('seller', 'worker')
  AND priority IN ('low', 'normal', 'high', 'urgent')
  AND status IN ('open', 'in_progress', 'resolved')
);