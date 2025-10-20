import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, GripVertical, Trash2, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Branch {
  id: string;
  name: string;
  code: string;
  total_semesters: number;
}

interface LectureHall {
  id: string;
  name: string;
  capacity: number;
  building: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  professor_name: string;
  hours_per_week: number;
  priority: number;
}

const BranchTimetableSetup = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [lectureHalls, setLectureHalls] = useState<LectureHall[]>([]);
  const [selectedHalls, setSelectedHalls] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  
  const [timeConfig, setTimeConfig] = useState({
    start_time: "09:00",
    end_time: "17:00",
    period_duration: 60,
    break_start: "13:00",
    break_end: "14:00",
    semester: 1,
  });

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    professor_name: "",
    hours_per_week: 3,
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !branchId) return;

    const fetchData = async () => {
      // Get branch
      const { data: branchData } = await supabase
        .from("branches")
        .select("*, departments(institute_id)")
        .eq("id", branchId)
        .single();

      if (branchData) {
        setBranch(branchData);

        // Get lecture halls for the institute
        const { data: hallsData } = await supabase
          .from("lecture_halls")
          .select("*")
          .eq("institute_id", branchData.departments.institute_id);

        if (hallsData) setLectureHalls(hallsData);
      }
    };

    fetchData();
  }, [user, branchId]);

  const handleAddSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      ...subjectForm,
      priority: subjects.length + 1,
    };
    setSubjects([...subjects, newSubject]);
    setSubjectForm({ name: "", code: "", professor_name: "", hours_per_week: 3 });
    setShowSubjectForm(false);
    toast({
      title: "Success",
      description: "Subject added successfully",
    });
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id).map((s, index) => ({
      ...s,
      priority: index + 1,
    })));
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newSubjects = [...subjects];
    const draggedSubject = newSubjects[draggedItem];
    newSubjects.splice(draggedItem, 1);
    newSubjects.splice(index, 0, draggedSubject);
    
    // Update priorities
    const updatedSubjects = newSubjects.map((s, i) => ({
      ...s,
      priority: i + 1,
    }));
    
    setSubjects(updatedSubjects);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleGenerateTimetable = async () => {
    if (selectedHalls.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one lecture hall",
      });
      return;
    }

    if (subjects.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one subject",
      });
      return;
    }

    try {
      // Generate timetable slots
      const timetableSlots = generateTimetableSlots();
      
      toast({
        title: "Success",
        description: `Generated timetable with ${timetableSlots.length} slots`,
      });

      // Navigate to view the generated timetable
      navigate(`/institute/branches/${branchId}/timetable`, {
        state: {
          timeConfig,
          subjects,
          selectedHalls: lectureHalls.filter(h => selectedHalls.includes(h.id)),
          timetableSlots,
        },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate timetable",
      });
    }
  };

  const generateTimetableSlots = () => {
    const slots = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Calculate total periods per day
    const startMinutes = parseInt(timeConfig.start_time.split(":")[0]) * 60 + parseInt(timeConfig.start_time.split(":")[1]);
    const endMinutes = parseInt(timeConfig.end_time.split(":")[0]) * 60 + parseInt(timeConfig.end_time.split(":")[1]);
    const breakStartMinutes = parseInt(timeConfig.break_start.split(":")[0]) * 60 + parseInt(timeConfig.break_start.split(":")[1]);
    const breakEndMinutes = parseInt(timeConfig.break_end.split(":")[0]) * 60 + parseInt(timeConfig.break_end.split(":")[1]);
    
    const totalMinutes = endMinutes - startMinutes - (breakEndMinutes - breakStartMinutes);
    const periodsPerDay = Math.floor(totalMinutes / timeConfig.period_duration);
    
    // Distribute subjects across the week based on priority and hours per week
    let subjectIndex = 0;
    const sortedSubjects = [...subjects].sort((a, b) => a.priority - b.priority);
    
    for (let day = 0; day < days.length; day++) {
      let currentTime = startMinutes;
      
      for (let period = 0; period < periodsPerDay; period++) {
        // Check if it's break time
        if (currentTime >= breakStartMinutes && currentTime < breakEndMinutes) {
          currentTime = breakEndMinutes;
          continue;
        }
        
        const subject = sortedSubjects[subjectIndex % sortedSubjects.length];
        const hall = lectureHalls.find(h => selectedHalls.includes(h.id));
        
        const startHour = Math.floor(currentTime / 60);
        const startMin = currentTime % 60;
        const endTime = currentTime + timeConfig.period_duration;
        const endHour = Math.floor(endTime / 60);
        const endMin = endTime % 60;
        
        slots.push({
          day: days[day],
          dayIndex: day,
          startTime: `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(2, "0")}`,
          endTime: `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`,
          subject: subject.name,
          subjectCode: subject.code,
          professor: subject.professor_name,
          hall: hall?.name || "TBA",
        });
        
        currentTime += timeConfig.period_duration;
        subjectIndex++;
      }
    }
    
    return slots;
  };

  if (!branch) {
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
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Timetable Setup</h1>
              <p className="text-white/80">{branch.name} - {branch.code}</p>
            </div>
          </div>
          <Button onClick={handleGenerateTimetable} size="lg">
            <Calendar className="h-5 w-5 mr-2" />
            Generate Timetable
          </Button>
        </div>

        {/* Time Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Time Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Semester *</Label>
                <Select
                  value={timeConfig.semester.toString()}
                  onValueChange={(value) =>
                    setTimeConfig({ ...timeConfig, semester: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: branch.total_semesters }, (_, i) => i + 1).map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={timeConfig.start_time}
                  onChange={(e) => setTimeConfig({ ...timeConfig, start_time: e.target.value })}
                />
              </div>
              <div>
                <Label>End Time *</Label>
                <Input
                  type="time"
                  value={timeConfig.end_time}
                  onChange={(e) => setTimeConfig({ ...timeConfig, end_time: e.target.value })}
                />
              </div>
              <div>
                <Label>Period Duration (minutes) *</Label>
                <Input
                  type="number"
                  value={timeConfig.period_duration}
                  onChange={(e) =>
                    setTimeConfig({ ...timeConfig, period_duration: parseInt(e.target.value) })
                  }
                  min="30"
                  max="120"
                />
              </div>
              <div>
                <Label>Break Start *</Label>
                <Input
                  type="time"
                  value={timeConfig.break_start}
                  onChange={(e) => setTimeConfig({ ...timeConfig, break_start: e.target.value })}
                />
              </div>
              <div>
                <Label>Break End *</Label>
                <Input
                  type="time"
                  value={timeConfig.break_end}
                  onChange={(e) => setTimeConfig({ ...timeConfig, break_end: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lecture Halls Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Available Lecture Halls</CardTitle>
          </CardHeader>
          <CardContent>
            {lectureHalls.length === 0 ? (
              <p className="text-muted-foreground">No lecture halls available. Please add lecture halls first.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lectureHalls.map((hall) => (
                  <div key={hall.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={hall.id}
                      checked={selectedHalls.includes(hall.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedHalls([...selectedHalls, hall.id]);
                        } else {
                          setSelectedHalls(selectedHalls.filter((id) => id !== hall.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={hall.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {hall.name} - {hall.building} (Capacity: {hall.capacity})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subjects & Priority */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Subjects & Priority</CardTitle>
            <Button onClick={() => setShowSubjectForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <p className="text-muted-foreground">No subjects added yet. Click "Add Subject" to start.</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Drag to reorder subjects by priority (higher priority subjects get better time slots)
                </p>
                {subjects.map((subject, index) => (
                  <div
                    key={subject.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-4 p-4 bg-card border rounded-lg cursor-move transition-all ${
                      draggedItem === index ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-semibold">{subject.name}</p>
                        <p className="text-xs text-muted-foreground">Code: {subject.code}</p>
                      </div>
                      <div>
                        <p className="text-sm">Professor: {subject.professor_name}</p>
                      </div>
                      <div>
                        <p className="text-sm">Hours/Week: {subject.hours_per_week}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">Priority: {subject.priority}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Subject Dialog */}
        <Dialog open={showSubjectForm} onOpenChange={setShowSubjectForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Enter the subject details. The priority will be set based on the order of addition.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject Name *</Label>
                <Input
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div>
                <Label>Subject Code *</Label>
                <Input
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  placeholder="e.g., CS201"
                />
              </div>
              <div>
                <Label>Professor Name *</Label>
                <Input
                  value={subjectForm.professor_name}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, professor_name: e.target.value })
                  }
                  placeholder="e.g., Dr. John Smith"
                />
              </div>
              <div>
                <Label>Hours Per Week *</Label>
                <Input
                  type="number"
                  value={subjectForm.hours_per_week}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, hours_per_week: parseInt(e.target.value) })
                  }
                  min="1"
                  max="10"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSubject} className="flex-1">
                  Add Subject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSubjectForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BranchTimetableSetup;
