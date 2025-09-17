import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, BookOpen, Target } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(217 91% 60% / 0.9) 0%, hsl(262 83% 70% / 0.9) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Logo and App Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Clock className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">TimeWise</h1>
          <p className="text-xl text-white/90">AI-Powered Timetable Manager</p>
        </div>

        {/* Login Options */}
        <Card className="p-8 space-y-6 bg-white/95 backdrop-blur-sm shadow-glow">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-foreground">Get Started</h2>
            <p className="text-center text-muted-foreground">Choose your account type to continue</p>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-medium bg-muted hover:bg-muted/80 text-muted-foreground"
              onClick={() => {}}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Institute Login
              <span className="ml-2 text-xs bg-warning text-warning-foreground px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </Button>

            <Button 
              size="lg"
              variant="hero"
              className="w-full h-14 text-lg font-medium"
              onClick={() => navigate("/login")}
            >
              <Target className="mr-3 h-5 w-5" />
              Individual Login
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New to TimeWise?{" "}
              <button 
                onClick={() => navigate("/register")}
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;