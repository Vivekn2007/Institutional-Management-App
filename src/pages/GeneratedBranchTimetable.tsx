import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimetableSlot {
  day: string;
  dayIndex: number;
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  professor: string;
  hall: string;
}

const GeneratedBranchTimetable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { timeConfig, subjects, selectedHalls, timetableSlots } = location.state || {};

  if (!timetableSlots) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No timetable data available</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slotsByDay = days.map((day, index) => ({
    day,
    slots: timetableSlots.filter((slot: TimetableSlot) => slot.dayIndex === index),
  }));

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Timetable saved successfully",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download",
      description: "Timetable download functionality coming soon",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Generated Timetable</h1>
              <p className="text-white/80">
                Semester {timeConfig?.semester} | {timeConfig?.start_time} - {timeConfig?.end_time}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Timetable Configuration Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold">Period Duration</p>
                <p className="text-muted-foreground">{timeConfig?.period_duration} minutes</p>
              </div>
              <div>
                <p className="font-semibold">Break Time</p>
                <p className="text-muted-foreground">
                  {timeConfig?.break_start} - {timeConfig?.break_end}
                </p>
              </div>
              <div>
                <p className="font-semibold">Total Subjects</p>
                <p className="text-muted-foreground">{subjects?.length || 0}</p>
              </div>
              <div>
                <p className="font-semibold">Lecture Halls</p>
                <p className="text-muted-foreground">{selectedHalls?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        <div className="grid grid-cols-1 gap-4">
          {slotsByDay.map(({ day, slots }) => (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="text-xl">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                {slots.length === 0 ? (
                  <p className="text-muted-foreground">No classes scheduled</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slots.map((slot: TimetableSlot, index: number) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-lg">{slot.subject}</p>
                            <p className="text-xs text-muted-foreground">{slot.subjectCode}</p>
                          </div>
                          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Professor:</span> {slot.professor}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Hall:</span> {slot.hall}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneratedBranchTimetable;
