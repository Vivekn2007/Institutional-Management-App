import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Clock, Coffee, Target, Edit } from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  type: "task" | "break" | "skill" | "free";
  duration: number;
}

const GeneratedTimetable = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    // Simulate AI-generated schedule based on setup data
    const mockSchedule: ScheduleItem[] = [
      { time: "09:00", activity: "Review emails", type: "task", duration: 30 },
      { time: "09:30", activity: "Coffee Break", type: "break", duration: 15 },
      { time: "09:45", activity: "Team meeting", type: "task", duration: 60 },
      { time: "10:45", activity: "Short Break", type: "break", duration: 15 },
      { time: "11:00", activity: "Project planning", type: "task", duration: 90 },
      { time: "12:30", activity: "Lunch Break", type: "break", duration: 60 },
      { time: "13:30", activity: "Data Science Learning", type: "skill", duration: 45 },
      { time: "14:15", activity: "Stretch Break", type: "break", duration: 15 },
      { time: "14:30", activity: "Documentation work", type: "task", duration: 60 },
      { time: "15:30", activity: "Free Time", type: "free", duration: 30 },
      { time: "16:00", activity: "Client calls", type: "task", duration: 45 },
      { time: "16:45", activity: "Wrap-up & Planning", type: "task", duration: 15 }
    ];
    
    setSchedule(mockSchedule);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task": return <Target className="h-4 w-4" />;
      case "break": return <Coffee className="h-4 w-4" />;
      case "skill": return <Clock className="h-4 w-4" />;
      case "free": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "task": return "bg-primary/10 text-primary border-primary/20";
      case "break": return "bg-success/10 text-success border-success/20";
      case "skill": return "bg-secondary/10 text-secondary border-secondary/20";
      case "free": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted";
    }
  };

  const handleDownloadPDF = () => {
    // Simulate PDF generation
    const element = document.createElement("a");
    const content = schedule.map(item => `${item.time} - ${item.activity} (${item.duration}min)`).join('\n');
    const file = new Blob([`Daily Timetable\n\n${content}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "daily-timetable.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/skills-recommendation")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Your AI-Generated Timetable</h1>
          </div>
          <Button 
            onClick={handleDownloadPDF}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Your Optimized Daily Schedule</h2>
            <p className="text-muted-foreground">
              AI-crafted timetable with breaks and skill development time
            </p>
          </div>

          {/* Schedule Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success">6</div>
                <div className="text-sm text-muted-foreground">Work Tasks</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-secondary">1</div>
                <div className="text-sm text-muted-foreground">Skill Time</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-warning">5</div>
                <div className="text-sm text-muted-foreground">Breaks</div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Table */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Daily Schedule</span>
                <Badge variant="outline">
                  {new Date().toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {schedule.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
                  onClick={() => navigate("/task-detail", { state: { task: item } })}
                >
                  <div className="text-sm font-mono font-medium text-muted-foreground min-w-[60px]">
                    {item.time}
                  </div>
                  
                  <div className={`p-2 rounded-lg ${getActivityColor(item.type)}`}>
                    {getActivityIcon(item.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{item.activity}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.duration} minutes
                    </div>
                  </div>
                  
                  <Badge variant="outline" className={getActivityColor(item.type)}>
                    {item.type}
                  </Badge>
                  
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              variant="outline"
              onClick={() => navigate("/daily-setup")}
              className="flex-1"
            >
              Regenerate Schedule
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="flex-1 gradient-primary text-white"
            >
              Save & Go to Dashboard
            </Button>
          </div>

          {/* Tips Card */}
          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pro Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Click on any time slot to add notes or attachments</li>
                    <li>• The AI scheduled breaks to optimize your productivity</li>
                    <li>• Skill development time is based on your selected interests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GeneratedTimetable;