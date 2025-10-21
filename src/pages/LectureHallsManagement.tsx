import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  code: string;
  block_count?: number;
}

const LectureHallsManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [instituteId, setInstituteId] = useState<string>("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login?role=institute");
      return;
    }

    const fetchData = async () => {
      // Get institute
      const { data: institute, error: instError } = await supabase
        .from("institutes")
        .select("id")
        .eq("admin_id", user.id)
        .single();

      if (instError || !institute) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load institute data",
        });
        setLoading(false);
        return;
      }

      setInstituteId(institute.id);

      // Get departments with block counts
      const { data: depts, error: deptsError } = await supabase
        .from("departments")
        .select("id, name, code")
        .eq("institute_id", institute.id);

      if (deptsError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: deptsError.message,
        });
        setLoading(false);
        return;
      }

      // Get block counts for each department
      const deptsWithCounts = await Promise.all(
        (depts || []).map(async (dept) => {
          const { count } = await supabase
            .from("blocks")
            .select("id", { count: "exact", head: true })
            .eq("department_id", dept.id);

          return { ...dept, block_count: count || 0 };
        })
      );

      setDepartments(deptsWithCounts);
      setLoading(false);
    };

    fetchData();
  }, [user, navigate, toast]);

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/institute-dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Lecture Halls Management</h1>
              <p className="text-white/80 mt-1">Select a department to manage blocks and rooms</p>
            </div>
          </div>
        </div>

        {departments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No departments found. Please add departments first.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/institute/departments")}
              >
                Add Department
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card
                key={dept.id}
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/95"
                onClick={() => navigate(`/institute/lecture-halls/${dept.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {dept.name}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Code: <span className="font-medium">{dept.code}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Blocks: <span className="font-medium">{dept.block_count}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureHallsManagement;
