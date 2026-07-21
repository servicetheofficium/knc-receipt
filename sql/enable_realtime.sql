-- Run this once in the Supabase SQL Editor for this project (eihnhfiubtgylwaqwhvu).
-- Enables live updates: when one user adds/edits/deletes a receipt,
-- other logged-in users see it without refreshing.

alter publication supabase_realtime add table public.receipts;
