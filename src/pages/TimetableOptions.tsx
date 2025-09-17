import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Target, CalendarDays } from "lucide-react";

const TimetableOptions = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Daily Timetable",
      description: "AI-powered daily schedule optimization",
      icon: Clock,
      path: "/daily-setup",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Weekly Timetable", 
      description: "Plan your entire week efficiently",
      icon: Calendar,
      path: "/weekly-setup",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Monthly Timetable",
      description: "Long-term calendar planning",
      icon: CalendarDays,
      path: "/monthly-timetable",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Task-Based Timetable",
      description: "Organize tasks within time frames",
      icon: Target,
      path: "/task-based-setup",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Create Timetable</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Choose Your Timetable Type</h2>
            <p className="text-muted-foreground">
              Select the type of timetable that best fits your needs
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid gap-6">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.title}
                  className="hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer gradient-card"
                  onClick={() => navigate(option.path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${option.gradient} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{option.title}</CardTitle>
                        <p className="text-muted-foreground">{option.description}</p>
                      </div>
                      <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI-Powered Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Our intelligent system considers your preferences, energy levels, and optimal 
                    productivity patterns to create the perfect schedule for you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TimetableOptions;