import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, GripVertical, X, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  estimatedTime: number;
  priority: number;
}

const TaskBasedSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [timeFrame, setTimeFrame] = useState({
    startTime: "09:00",
    endTime: "17:00"
  });
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Complete project proposal", estimatedTime: 120, priority: 1 },
    { id: "2", title: "Review team feedback", estimatedTime: 45, priority: 2 }
  ]);
  
  const [newTask, setNewTask] = useState({
    title: "",
    estimatedTime: 60
  });

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        estimatedTime: newTask.estimatedTime,
        priority: tasks.length + 1
      };
      setTasks([...tasks, task]);
      setNewTask({ title: "", estimatedTime: 60 });
    }
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTaskTime = (id: string, time: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, estimatedTime: time } : task
    ));
  };

  const generateTimetable = () => {
    if (tasks.length === 0) {
      toast({
        variant: "destructive",
        title: "No tasks added",
        description: "Please add at least one task to generate a timetable"
      });
      return;
    }

    const totalTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const startTime = new Date(`2000-01-01 ${timeFrame.startTime}`);
    const endTime = new Date(`2000-01-01 ${timeFrame.endTime}`);
    const availableMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    if (totalTime > availableMinutes) {
      toast({
        variant: "destructive",
        title: "Not enough time",
        description: `Total task time (${Math.round(totalTime/60)}h ${totalTime%60}m) exceeds available time (${Math.round(availableMinutes/60)}h ${availableMinutes%60}m)`
      });
      return;
    }

    // Store data for AI processing
    const taskBasedConfig = {
      timeFrame,
      tasks,
      totalTime,
      availableTime: availableMinutes
    };
    
    localStorage.setItem("taskBasedConfig", JSON.stringify(taskBasedConfig));
    navigate("/generated-timetable");
  };

  const totalTaskTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
  const totalHours = Math.floor(totalTaskTime / 60);
  const totalMinutes = totalTaskTime % 60;

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
          <h1 className="text-xl font-semibold">Task-Based Timetable</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Organize Your Tasks</h2>
            <p className="text-muted-foreground">
              AI will optimize your task sequence within the specified time frame
            </p>
          </div>

          {/* Time Frame */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Available Time Window
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={timeFrame.startTime}
                    onChange={(e) => setTimeFrame({...timeFrame, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={timeFrame.endTime}
                    onChange={(e) => setTimeFrame({...timeFrame, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Available Time:</span> {
                    (() => {
                      const start = new Date(`2000-01-01 ${timeFrame.startTime}`);
                      const end = new Date(`2000-01-01 ${timeFrame.endTime}`);
                      const minutes = (end.getTime() - start.getTime()) / (1000 * 60);
                      const hours = Math.floor(minutes / 60);
                      const mins = minutes % 60;
                      return `${hours}h ${mins}m`;
                    })()
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Task List */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Tasks & Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Task */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Add a new task..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 60})}
                    min="5"
                    max="480"
                  />
                  <Button onClick={addTask} className="gradient-primary text-white px-3">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card/50">
                    <div className="text-sm text-muted-foreground font-mono">
                      #{index + 1}
                    </div>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={task.estimatedTime}
                        onChange={(e) => updateTaskTime(task.id, parseInt(e.target.value) || 60)}
                        className="w-20 h-8 text-sm"
                        min="5"
                        max="480"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeTask(task.id)}
                      className="text-destructive hover:text-destructive p-1"
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

              {/* Summary */}
              {tasks.length > 0 && (
                <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                  <p className="text-sm">
                    <span className="font-medium">Total Task Time:</span> {totalHours}h {totalMinutes}m
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} • Drag to reorder priority
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            onClick={generateTimetable}
            className="w-full gradient-primary text-white"
            size="lg"
            disabled={tasks.length === 0}
          >
            Generate AI-Optimized Timetable
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TaskBasedSetup;