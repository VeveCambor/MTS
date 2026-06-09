-- =============================================================
-- 0009_trainee_reads_parameters.sql
-- Cvičenec smí číst parametry definované svým trenérem
-- (potřebné pro stránku pokroku).
-- =============================================================

create policy "trainer_parameters_trainee_select"
  on public.trainer_parameters for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.trainer_id = trainer_parameters.user_id
    )
  );
