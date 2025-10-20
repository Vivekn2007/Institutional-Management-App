export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          attachment_url: string | null
          class_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          title: string
          total_marks: number | null
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          class_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title: string
          total_marks?: number | null
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          class_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title?: string
          total_marks?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string
          created_at: string | null
          date: string
          id: string
          marked_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          date: string
          id?: string
          marked_at?: string | null
          status: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          date?: string
          id?: string
          marked_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          code: string
          created_at: string | null
          department_id: string
          duration_years: number
          id: string
          name: string
          total_semesters: number
        }
        Insert: {
          code: string
          created_at?: string | null
          department_id: string
          duration_years?: number
          id?: string
          name: string
          total_semesters?: number
        }
        Update: {
          code?: string
          created_at?: string | null
          department_id?: string
          duration_years?: number
          id?: string
          name?: string
          total_semesters?: number
        }
        Relationships: [
          {
            foreignKeyName: "branches_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          branch_id: string
          cancelled_at: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          institute_id: string
          lecture_hall_id: string | null
          professor_id: string
          scheduled_time: string | null
          semester: number
          status: string | null
          subject_code: string
          subject_name: string
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          cancelled_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          institute_id: string
          lecture_hall_id?: string | null
          professor_id: string
          scheduled_time?: string | null
          semester: number
          status?: string | null
          subject_code: string
          subject_name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          cancelled_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          institute_id?: string
          lecture_hall_id?: string | null
          professor_id?: string
          scheduled_time?: string | null
          semester?: number
          status?: string | null
          subject_code?: string
          subject_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_lecture_hall_id_fkey"
            columns: ["lecture_hall_id"]
            isOneToOne: false
            referencedRelation: "lecture_halls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          head_of_department: string | null
          id: string
          institute_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          head_of_department?: string | null
          id?: string
          institute_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          head_of_department?: string | null
          id?: string
          institute_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      institutes: {
        Row: {
          address: string
          admin_id: string
          created_at: string | null
          email: string
          established_year: number | null
          id: string
          name: string
          phone: string
          registration_number: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          admin_id: string
          created_at?: string | null
          email: string
          established_year?: number | null
          id?: string
          name: string
          phone: string
          registration_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          admin_id?: string
          created_at?: string | null
          email?: string
          established_year?: number | null
          id?: string
          name?: string
          phone?: string
          registration_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      lecture_halls: {
        Row: {
          building: string | null
          capacity: number
          created_at: string | null
          facilities: string[] | null
          floor: number | null
          id: string
          institute_id: string
          name: string
        }
        Insert: {
          building?: string | null
          capacity: number
          created_at?: string | null
          facilities?: string[] | null
          floor?: number | null
          id?: string
          institute_id: string
          name: string
        }
        Update: {
          building?: string | null
          capacity?: number
          created_at?: string | null
          facilities?: string[] | null
          floor?: number | null
          id?: string
          institute_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "lecture_halls_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          created_at: string | null
          date_of_joining: string | null
          department_id: string | null
          email: string
          id: string
          institute_id: string
          name: string
          phone: string | null
          professor_id: string
          qualification: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_joining?: string | null
          department_id?: string | null
          email: string
          id?: string
          institute_id: string
          name: string
          phone?: string | null
          professor_id: string
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_joining?: string | null
          department_id?: string | null
          email?: string
          id?: string
          institute_id?: string
          name?: string
          phone?: string | null
          professor_id?: string
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professors_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          admission_year: number | null
          branch_id: string | null
          created_at: string | null
          current_semester: number | null
          date_of_birth: string | null
          email: string
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          institute_id: string
          name: string
          phone: string | null
          roll_number: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          admission_year?: number | null
          branch_id?: string | null
          created_at?: string | null
          current_semester?: number | null
          date_of_birth?: string | null
          email: string
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          institute_id: string
          name: string
          phone?: string | null
          roll_number: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          admission_year?: number | null
          branch_id?: string | null
          created_at?: string | null
          current_semester?: number | null
          date_of_birth?: string | null
          email?: string
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          institute_id?: string
          name?: string
          phone?: string | null
          roll_number?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      timetables: {
        Row: {
          branch_id: string
          class_id: string | null
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          semester: number
          start_time: string
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          class_id?: string | null
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          semester: number
          start_time: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          class_id?: string | null
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          semester?: number
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetables_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetables_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "institute_admin" | "professor" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["institute_admin", "professor", "student"],
    },
  },
} as const
