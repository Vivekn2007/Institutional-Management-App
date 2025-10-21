-- Add explicit UPDATE and DELETE restrictive policies to user_roles table
-- This prevents any potential privilege escalation through role manipulation

CREATE POLICY "Block role updates" 
ON public.user_roles
FOR UPDATE 
TO authenticated
USING (false);

CREATE POLICY "Block role deletes" 
ON public.user_roles
FOR DELETE 
TO authenticated
USING (false);