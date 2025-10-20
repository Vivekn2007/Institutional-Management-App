import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Department {
  id: string;
  name: string;
  code: string;
  head_of_department: string;
}

interface Branch {
  id: string;
  name: string;
  code: string;
  duration_years: number;
  total_semesters: number;
}

const DepartmentDetail = () => {
  const { departmentId } = useParams();
  const [department, setDepartment] = useState<Department | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    duration_years: 4,
    total_semesters: 8,
  });
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !departmentId) return;

    const fetchData = async () => {
      // Get department
      const { data: dept } = await supabase
        .from("departments")
        .select("*")
        .eq("id", departmentId)
        .single();

      if (dept) {
        setDepartment(dept);

        // Get branches
        const { data: branchData } = await supabase
          .from("branches")
          .select("*")
          .eq("department_id", departmentId);

        if (branchData) setBranches(branchData);
      }
    };

    fetchData();
  }, [user, departmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("branches").insert({
      department_id: departmentId,
      ...formData,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Branch added successfully",
      });
      setShowForm(false);
      setFormData({ name: "", code: "", duration_years: 4, total_semesters: 8 });
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!selectedBranch) return;

    const { error } = await supabase
      .from("branches")
      .delete()
      .eq("id", selectedBranch.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
      setShowDeleteDialog(false);
      setSelectedBranch(null);
      window.location.reload();
    }
  };

  if (!department) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/institute/departments")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{department.name}</h1>
              <p className="text-white/80">Code: {department.code}</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>

        {department.head_of_department && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm">
                <span className="font-semibold">Head of Department:</span>{" "}
                {department.head_of_department}
              </p>
            </CardContent>
          </Card>
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Branch Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <Label>Branch Code *</Label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g., CS"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duration (Years) *</Label>
                    <Input
                      type="number"
                      value={formData.duration_years}
                      onChange={(e) =>
                        setFormData({ ...formData, duration_years: parseInt(e.target.value) })
                      }
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                  <div>
                    <Label>Total Semesters *</Label>
                    <Input
                      type="number"
                      value={formData.total_semesters}
                      onChange={(e) =>
                        setFormData({ ...formData, total_semesters: parseInt(e.target.value) })
                      }
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Branch</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Branches</h2>
          {branches.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No branches added yet. Click "Add Branch" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <Card key={branch.id} className="cursor-pointer transition-all hover:shadow-lg">
                  <div onClick={() => navigate(`/institute/branches/${branch.id}/timetable-setup`)}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {branch.name}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBranch(branch);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Code: {branch.code}</p>
                        <p>Duration: {branch.duration_years} years</p>
                        <p>Semesters: {branch.total_semesters}</p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the branch "{selectedBranch?.name}". This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DepartmentDetail;
