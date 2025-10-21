-- Update blocks table to use branch_id instead of department_id
ALTER TABLE public.blocks DROP COLUMN department_id;
ALTER TABLE public.blocks ADD COLUMN branch_id UUID NOT NULL;

-- Update the queries to reference branch instead of department
-- RLS policies remain the same as they check institute_id