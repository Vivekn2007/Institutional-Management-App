import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Building, Users, BookOpen, LogOut, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Institute {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const InstituteDashboard = () => {
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    departments: 0,
    professors: 0,
    students: 0,
    lectureHalls: 0,
  });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login?role=institute");
      return;
    }

    const fetchInstitute = async () => {
      const { data, error } = await supabase
        .from("institutes")
        .select("*")
        .eq("admin_id", user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading institute",
          description: error.message,
        });
        setLoading(false);
        return;
      }
      
      setInstitute(data);
      
      // Fetch counts
      const [deptResult, profResult, studResult, hallResult] = await Promise.all([
        supabase
          .from("departments")
          .select("id", { count: "exact", head: true })
          .eq("institute_id", data.id),
        supabase
          .from("professors")
          .select("id", { count: "exact", head: true })
          .eq("institute_id", data.id),
        supabase
          .from("students")
          .select("id", { count: "exact", head: true })
          .eq("institute_id", data.id),
        supabase
          .from("lecture_halls")
          .select("id", { count: "exact", head: true })
          .eq("institute_id", data.id),
      ]);

      setCounts({
        departments: deptResult.count || 0,
        professors: profResult.count || 0,
        students: studResult.count || 0,
        lectureHalls: hallResult.count || 0,
      });
      
      setLoading(false);
    };

    fetchInstitute();
  }, [user, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{institute?.name}</h1>
            <p className="text-white/80 mt-1">Institute Management Dashboard</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Departments</p>
                  <p className="text-2xl font-bold">{counts.departments}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Professors</p>
                  <p className="text-2xl font-bold">{counts.professors}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold">{counts.students}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lecture Halls</p>
                  <p className="text-2xl font-bold">{counts.lectureHalls}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Departments
                <Button 
                  size="sm" 
                  onClick={() => navigate("/institute/departments")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Department
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Manage departments, add professors, and organize your institution
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Lecture Halls
                <Button 
                  size="sm" 
                  onClick={() => navigate("/institute/lecture-halls")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Hall
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Manage lecture halls and their availability
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Professors
                <Button 
                  size="sm" 
                  onClick={() => navigate("/institute/professors")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Professor
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Add professors and generate their login credentials
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Students
                <Button 
                  size="sm" 
                  onClick={() => navigate("/institute/students")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Students
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Add students to branches and generate their credentials
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;
