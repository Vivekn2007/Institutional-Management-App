import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, User, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { generateProfessorId, generatePassword } from "@/utils/credentialGenerator";

interface Department {
  id: string;
  name: string;
}

interface Professor {
  id: string;
  name: string;
  email: string;
  professor_id: string;
  department_id: string;
}

const ProfessorManagement = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department_id: "",
    qualification: "",
    specialization: "",
  });
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    professorId: string;
    password: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string>("");
  const [instituteId, setInstituteId] = useState<string>("");
  const [instituteName, setInstituteName] = useState<string>("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: institute } = await supabase
        .from("institutes")
        .select("id, name")
        .eq("admin_id", user.id)
        .single();

      if (institute) {
        setInstituteId(institute.id);
        setInstituteName(institute.name);

        const { data: depts } = await supabase
          .from("departments")
          .select("id, name")
          .eq("institute_id", institute.id);

        if (depts) setDepartments(depts);

        const { data: profs } = await supabase
          .from("professors")
          .select("*")
          .eq("institute_id", institute.id);

        if (profs) setProfessors(profs);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const professorId = generateProfessorId(instituteName, formData.name);
    const password = generatePassword();

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          data: {
            name: formData.name,
            role: "professor",
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create professor record
        const { error: profError } = await supabase.from("professors").insert({
          user_id: authData.user.id,
          institute_id: instituteId,
          department_id: formData.department_id || null,
          professor_id: professorId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          qualification: formData.qualification || null,
          specialization: formData.specialization || null,
        });

        if (profError) throw profError;

        // Add role
        await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "professor",
        });

        setGeneratedCredentials({ professorId, password });
        toast({
          title: "Success",
          description: "Professor added successfully",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
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
            <h1 className="text-3xl font-bold text-white">Professor Management</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Professor
          </Button>
        </div>

        {showForm && !generatedCredentials && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Professor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={formData.department_id} onValueChange={(value) => setFormData({ ...formData, department_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Qualification</Label>
                    <Input
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <Input
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit">Generate Credentials & Add Professor</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {generatedCredentials && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-primary">Professor Credentials Generated!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share these credentials with the professor. They won't be shown again.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">Professor ID</p>
                    <p className="text-lg font-mono">{generatedCredentials.professorId}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedCredentials.professorId, "id")}
                  >
                    {copiedField === "id" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-lg font-mono">{generatedCredentials.password}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedCredentials.password, "password")}
                  >
                    {copiedField === "password" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button onClick={() => { setGeneratedCredentials(null); setShowForm(false); window.location.reload(); }}>
                Done
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {professors.map((prof) => (
            <Card key={prof.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {prof.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">ID: {prof.professor_id}</p>
                <p className="text-sm text-muted-foreground">Email: {prof.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorManagement;
