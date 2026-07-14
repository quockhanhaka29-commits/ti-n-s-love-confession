
CREATE POLICY "Admin can upload photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'photos' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admin can update photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'photos' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admin can delete photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'photos' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admin can read photos objects" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'photos' AND public.has_role(auth.uid(),'admin'));
