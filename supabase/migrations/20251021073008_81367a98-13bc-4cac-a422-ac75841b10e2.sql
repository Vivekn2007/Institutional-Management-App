-- Create blocks table
CREATE TABLE public.blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL,
  name TEXT NOT NULL,
  building TEXT,
  floor INTEGER,
  institute_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID NOT NULL,
  room_number TEXT NOT NULL,
  location TEXT,
  capacity INTEGER NOT NULL,
  room_type TEXT,
  facilities TEXT[],
  institute_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blocks
CREATE POLICY "Institute admins can manage blocks"
ON public.blocks
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM institutes
    WHERE institutes.id = blocks.institute_id
    AND institutes.admin_id = auth.uid()
  )
);

CREATE POLICY "Institute members can view blocks"
ON public.blocks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM institutes
    WHERE institutes.id = blocks.institute_id
    AND (institutes.admin_id = auth.uid() OR has_role(auth.uid(), 'institute_admin'))
  )
);

-- RLS Policies for rooms
CREATE POLICY "Institute admins can manage rooms"
ON public.rooms
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM institutes
    WHERE institutes.id = rooms.institute_id
    AND institutes.admin_id = auth.uid()
  )
);

CREATE POLICY "Institute members can view rooms"
ON public.rooms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM institutes
    WHERE institutes.id = rooms.institute_id
    AND (institutes.admin_id = auth.uid() OR has_role(auth.uid(), 'institute_admin'))
  )
);