import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Building2, Edit, Trash2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    head_of_department: "",
    description: "",
  });
  const [instituteId, setInstituteId] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Get institute
      const { data: institute } = await supabase
        .from("institutes")
        .select("id")
        .eq("admin_id", user.id)
        .single();

      if (institute) {
        setInstituteId(institute.id);
        
        // Get departments
        const { data: depts } = await supabase
          .from("departments")
          .select("*")
          .eq("institute_id", institute.id);

        if (depts) setDepartments(depts);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && selectedDept) {
      const { error } = await supabase
        .from("departments")
        .update(formData)
        .eq("id", selectedDept.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
        setShowForm(false);
        setIsEditing(false);
        setSelectedDept(null);
        setFormData({ name: "", code: "", head_of_department: "", description: "" });
        window.location.reload();
      }
    } else {
      const { error } = await supabase.from("departments").insert({
        institute_id: instituteId,
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
          description: "Department added successfully",
        });
        setShowForm(false);
        setFormData({ name: "", code: "", head_of_department: "", description: "" });
        window.location.reload();
      }
    }
  };

  const handleDeptClick = (dept: Department) => {
    setSelectedDept(dept);
    setShowDetails(true);
  };

  const handleEdit = () => {
    if (selectedDept) {
      setFormData({
        name: selectedDept.name,
        code: selectedDept.code,
        head_of_department: selectedDept.head_of_department || "",
        description: "",
      });
      setIsEditing(true);
      setShowDetails(false);
      setShowForm(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedDept) return;

    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", selectedDept.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      setShowDeleteDialog(false);
      setShowDetails(false);
      setSelectedDept(null);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/institute-dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Department Management</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Department</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Department Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Department Code *</Label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Head of Department</Label>
                  <Input
                    value={formData.head_of_department}
                    onChange={(e) => setFormData({ ...formData, head_of_department: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button type="submit">Add Department</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card 
              key={dept.id} 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => handleDeptClick(dept)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {dept.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Code: {dept.code}</p>
                {dept.head_of_department && (
                  <p className="text-sm text-muted-foreground">HOD: {dept.head_of_department}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {selectedDept?.name}
              </DialogTitle>
              <DialogDescription>
                Manage department details and view related information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Department Code</Label>
                <p className="text-sm text-muted-foreground">{selectedDept?.code}</p>
              </div>
              {selectedDept?.head_of_department && (
                <div>
                  <Label className="text-sm font-semibold">Head of Department</Label>
                  <p className="text-sm text-muted-foreground">{selectedDept.head_of_department}</p>
                </div>
              )}
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={handleEdit} className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Department
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setShowDetails(false);
                    navigate("/institute/professors");
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Professors
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    setShowDetails(false);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the department "{selectedDept?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DepartmentManagement;
