-- Fix student data exposure by restricting students to view only their own record
-- Drop the overly permissive policy that allows any student to view all student records
DROP POLICY IF EXISTS "Students can view their profile" ON public.students;

-- Create a new restrictive policy that only allows students to view their own record
CREATE POLICY "Students can view their own profile" 
ON public.students 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());