import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const MonthlyTimetable = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample events for demonstration
  const [events] = useState({
    "2024-01-15": [{ title: "Team Meeting", time: "10:00 AM", type: "work" }],
    "2024-01-16": [{ title: "Project Review", time: "2:00 PM", type: "work" }],
    "2024-01-20": [{ title: "Learning Session", time: "9:00 AM", type: "skill" }],
    "2024-01-22": [{ title: "Personal Time", time: "All day", type: "personal" }],
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getDateKey = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-primary/10 text-primary border-primary/20';
      case 'skill': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'personal': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted';
    }
  };

  const handleDateClick = (day: number) => {
    const dateKey = getDateKey(day);
    navigate("/task-detail", { 
      state: { 
        date: dateKey,
        isNewTask: true 
      } 
    });
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
          <h1 className="text-xl font-semibold">Monthly Calendar</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Calendar View</h2>
            <p className="text-muted-foreground">
              Organize your schedule with a comprehensive monthly overview
            </p>
          </div>

          {/* Calendar Card */}
          <Card className="gradient-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{monthYear}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth(1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Weekday Headers */}
                {weekdays.map((day) => (
                  <div 
                    key={day}
                    className="p-2 text-center font-medium text-muted-foreground border-b"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2 h-24" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateKey = getDateKey(day);
                  const dayEvents = events[dateKey] || [];
                  const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                  return (
                    <div 
                      key={day}
                      className={`p-2 h-24 border border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                        isToday ? 'bg-primary/5 border-primary/30' : ''
                      }`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-primary' : ''
                      }`}>
                        {day}
                        {isToday && (
                          <span className="ml-1 text-xs bg-primary text-primary-foreground px-1 rounded">
                            Today
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={`text-xs p-1 rounded truncate ${getEventColor(event.type)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary/20 border border-primary/30"></div>
                  <span className="text-sm">Work & Professional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-secondary/20 border border-secondary/30"></div>
                  <span className="text-sm">Skill Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-success/20 border border-success/30"></div>
                  <span className="text-sm">Personal Time</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate("/task-detail", { state: { isNewTask: true } })}
              className="gradient-primary text-white gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Add New Event
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonthlyTimetable;