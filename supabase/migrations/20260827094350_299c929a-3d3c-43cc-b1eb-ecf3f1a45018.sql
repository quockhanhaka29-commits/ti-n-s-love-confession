CREATE TABLE public.visits (
  id uuid primary key default gen_random_uuid(),
  device text,
  created_at timestamptz not null default now()
);

GRANT INSERT ON public.visits TO anon, authenticated;
GRANT SELECT, DELETE ON public.visits TO authenticated;
GRANT ALL ON public.visits TO service_role;

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a visit"
  ON public.visits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read visits"
  ON public.visits FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete visits"
  ON public.visits FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX visits_created_at_idx ON public.visits (created_at desc);