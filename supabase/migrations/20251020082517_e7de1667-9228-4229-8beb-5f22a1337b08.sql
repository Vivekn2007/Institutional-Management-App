-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('institute_admin', 'professor', 'student');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Institutes table
CREATE TABLE public.institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  registration_number TEXT,
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(admin_id)
);

ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Institute admins can view their institute"
  ON public.institutes FOR SELECT
  USING (admin_id = auth.uid() OR public.has_role(auth.uid(), 'institute_admin'));

CREATE POLICY "Institute admins can update their institute"
  ON public.institutes FOR UPDATE
  USING (admin_id = auth.uid());

CREATE POLICY "Users can create institute"
  ON public.institutes FOR INSERT
  WITH CHECK (admin_id = auth.uid());

-- Departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID REFERENCES public.institutes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  head_of_department TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institute_id, code)
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Institute members can view departments"
  ON public.departments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = departments.institute_id 
      AND (admin_id = auth.uid() OR public.has_role(auth.uid(), 'institute_admin'))
    )
  );

CREATE POLICY "Institute admins can manage departments"
  ON public.departments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = departments.institute_id AND admin_id = auth.uid()
    )
  );

-- Lecture halls table
CREATE TABLE public.lecture_halls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID REFERENCES public.institutes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  building TEXT,
  floor INTEGER,
  facilities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institute_id, name)
);

ALTER TABLE public.lecture_halls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Institute members can view lecture halls"
  ON public.lecture_halls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = lecture_halls.institute_id 
      AND (admin_id = auth.uid() OR public.has_role(auth.uid(), 'institute_admin'))
    )
  );

CREATE POLICY "Institute admins can manage lecture halls"
  ON public.lecture_halls FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = lecture_halls.institute_id AND admin_id = auth.uid()
    )
  );

-- Professors table
CREATE TABLE public.professors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID REFERENCES public.institutes(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  professor_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  qualification TEXT,
  specialization TEXT,
  date_of_joining DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institute_id, professor_id),
  UNIQUE(institute_id, email)
);

ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors can view their profile"
  ON public.professors FOR SELECT
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'professor'));

CREATE POLICY "Institute admins can manage professors"
  ON public.professors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = professors.institute_id AND admin_id = auth.uid()
    )
  );

-- Branches table
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  duration_years INTEGER NOT NULL DEFAULT 4,
  total_semesters INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department_id, code)
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Institute members can view branches"
  ON public.branches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.departments d
      JOIN public.institutes i ON d.institute_id = i.id
      WHERE d.id = branches.department_id 
      AND (i.admin_id = auth.uid() OR public.has_role(auth.uid(), 'institute_admin'))
    )
  );

CREATE POLICY "Institute admins can manage branches"
  ON public.branches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.departments d
      JOIN public.institutes i ON d.institute_id = i.id
      WHERE d.id = branches.department_id AND i.admin_id = auth.uid()
    )
  );

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID REFERENCES public.institutes(id) ON DELETE CASCADE NOT NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  roll_number TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  admission_year INTEGER,
  current_semester INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institute_id, roll_number),
  UNIQUE(institute_id, email)
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their profile"
  ON public.students FOR SELECT
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'student'));

CREATE POLICY "Institute admins can manage students"
  ON public.students FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = students.institute_id AND admin_id = auth.uid()
    )
  );

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID REFERENCES public.institutes(id) ON DELETE CASCADE NOT NULL,
  professor_id UUID REFERENCES public.professors(id) ON DELETE CASCADE NOT NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE NOT NULL,
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  semester INTEGER NOT NULL,
  lecture_hall_id UUID REFERENCES public.lecture_halls(id) ON DELETE SET NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled',
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Institute members can view classes"
  ON public.classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = classes.institute_id 
      AND (admin_id = auth.uid() OR public.has_role(auth.uid(), 'institute_admin'))
    )
    OR EXISTS (
      SELECT 1 FROM public.professors WHERE id = classes.professor_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.students WHERE branch_id = classes.branch_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Professors can manage their classes"
  ON public.classes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.professors WHERE id = classes.professor_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Institute admins can manage all classes"
  ON public.classes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.institutes 
      WHERE id = classes.institute_id AND admin_id = auth.uid()
    )
  );

-- Assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  total_marks INTEGER DEFAULT 100,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students and professors can view assignments"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.professors p ON c.professor_id = p.id
      WHERE c.id = assignments.class_id AND p.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.students s ON c.branch_id = s.branch_id
      WHERE c.id = assignments.class_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Professors can manage assignments"
  ON public.assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.professors p ON c.professor_id = p.id
      WHERE c.id = assignments.class_id AND p.user_id = auth.uid()
    )
  );

-- Timetables table
CREATE TABLE public.timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE NOT NULL,
  semester INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their timetable"
  ON public.timetables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE branch_id = timetables.branch_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Institute admins can manage timetables"
  ON public.timetables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.branches b
      JOIN public.departments d ON b.department_id = d.id
      JOIN public.institutes i ON d.institute_id = i.id
      WHERE b.id = timetables.branch_id AND i.admin_id = auth.uid()
    )
  );

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their attendance"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE id = attendance.student_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Professors can manage attendance"
  ON public.attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.professors p ON c.professor_id = p.id
      WHERE c.id = attendance.class_id AND p.user_id = auth.uid()
    )
  );

-- Tasks table for priority management
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their tasks"
  ON public.tasks FOR ALL
  USING (user_id = auth.uid());

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_institutes_updated_at BEFORE UPDATE ON public.institutes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professors_updated_at BEFORE UPDATE ON public.professors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON public.timetables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();