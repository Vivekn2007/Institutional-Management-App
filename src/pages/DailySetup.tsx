import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Plus, GripVertical, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  duration: number;
}

const DailySetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    hours: 8,
    purpose: "",
    startTime: "09:00",
    endTime: "17:00",
    freeTime: [1]
  });
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Review emails", duration: 30 },
    { id: "2", title: "Team meeting", duration: 60 }
  ]);
  
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        duration: 60
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleGenerate = () => {
    if (!formData.purpose) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select the purpose of your timetable"
      });
      return;
    }

    // Store data for next screen
    const setupData = { ...formData, tasks };
    localStorage.setItem("dailySetup", JSON.stringify(setupData));
    
    navigate("/skills-recommendation");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/timetable-options")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Daily Timetable Setup</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Create Your Daily Schedule</h2>
            <p className="text-muted-foreground">
              Let our AI create an optimized daily timetable for you
            </p>
          </div>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Schedule Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hours to Schedule</Label>
                  <Input
                    type="number"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: parseInt(e.target.value) || 8})}
                    min="1"
                    max="16"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Purpose</Label>
                  <Select value={formData.purpose} onValueChange={(value) => setFormData({...formData, purpose: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Free Time Per Day: {formData.freeTime[0]} hour(s)</Label>
                <Slider
                  value={formData.freeTime}
                  onValueChange={(value) => setFormData({...formData, freeTime: value})}
                  max={4}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Tasks & Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <Button onClick={addTask} className="gradient-primary text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card/50">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.duration} minutes</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeTask(task.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tasks added yet. Add your first task above!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={handleGenerate}
            className="w-full"
            variant="hero"
            size="lg"
          >
            Generate AI Timetable
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DailySetup;