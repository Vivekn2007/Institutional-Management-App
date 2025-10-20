import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const InstituteRegister = () => {
  const [formData, setFormData] = useState({
    instituteName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    registrationNumber: "",
    establishedYear: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign up user
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password,
        {
          name: formData.instituteName,
          phone: formData.phone,
          hobbies: "",
          role: "institute_admin",
        }
      );

      if (authError) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: authError.message,
        });
        return;
      }

      if (authData.user) {
        // Create institute record
        const { error: instituteError } = await supabase
          .from("institutes")
          .insert({
            admin_id: authData.user.id,
            name: formData.instituteName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            website: formData.website || null,
            registration_number: formData.registrationNumber || null,
            established_year: formData.establishedYear ? parseInt(formData.establishedYear) : null,
          });

        if (instituteError) {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: "Failed to create institute profile",
          });
          return;
        }

        // Add role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: authData.user.id,
            role: "institute_admin",
          });

        if (roleError) {
          console.error("Role assignment error:", roleError);
        }

        toast({
          title: "Registration successful!",
          description: "Welcome to ScholarSync",
        });

        navigate("/institute-dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-glow bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/")}
                className="p-2 h-auto"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl">Institute Registration</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Register your educational institution</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute Name *</Label>
                  <Input
                    id="instituteName"
                    name="instituteName"
                    type="text"
                    value={formData.instituteName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    name="establishedYear"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.establishedYear}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                variant="hero"
                disabled={isLoading}
              >
                <Building className="mr-2 h-5 w-5" />
                {isLoading ? "Registering..." : "Register Institute"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login?role=institute" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstituteRegister;
