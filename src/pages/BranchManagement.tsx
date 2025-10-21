import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Branch {
  id: string;
  name: string;
  code: string;
  block_count?: number;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const BranchManagement = () => {
  const { departmentId } = useParams();
  const [department, setDepartment] = useState<Department | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !departmentId) return;

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
        return;
      }

      // Get department
      const { data: departmentData, error: deptError } = await supabase
        .from("departments")
        .select("*")
        .eq("id", departmentId)
        .single();

      if (deptError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: deptError.message,
        });
        return;
      }

      setDepartment(departmentData);

      // Get branches with block counts
      const { data: branchesData, error: branchesError } = await supabase
        .from("branches")
        .select("*")
        .eq("department_id", departmentId)
        .order("created_at", { ascending: false });

      if (branchesError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: branchesError.message,
        });
        return;
      }

      // Get block counts for each branch
      const branchesWithCounts = await Promise.all(
        (branchesData || []).map(async (branch) => {
          const { count } = await supabase
            .from("blocks")
            .select("id", { count: "exact", head: true })
            .eq("branch_id", branch.id);

          return { ...branch, block_count: count || 0 };
        })
      );

      setBranches(branchesWithCounts);
      setLoading(false);
    };

    fetchData();
  }, [user, departmentId, navigate, toast]);

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
              onClick={() => navigate("/institute/lecture-halls")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {department?.name} - Branches
              </h1>
              <p className="text-white/80 mt-1">Select a branch to manage blocks</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <Card
              key={branch.id}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white/95"
              onClick={() => navigate(`/institute/branches/${branch.id}/blocks`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {branch.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Code: <span className="font-medium">{branch.code}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Blocks: <span className="font-medium">{branch.block_count}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {branches.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No branches found for this department</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BranchManagement;
