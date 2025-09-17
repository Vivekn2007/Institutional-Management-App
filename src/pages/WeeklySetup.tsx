import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const WeeklySetup = () => {
  const navigate = useNavigate();
  
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  
  const [hasDayOff, setHasDayOff] = useState(true);
  const [dayOff, setDayOff] = useState("saturday");

  const weekdays = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" }
  ];

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day as keyof typeof prev]
    }));
  };

  const generateEmptyTimetable = () => {
    const activeDays = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day, _]) => day);
    
    // Store configuration for the weekly timetable generator
    const weeklyConfig = {
      selectedDays: activeDays,
      hasDayOff,
      dayOff: hasDayOff ? dayOff : null
    };
    
    localStorage.setItem("weeklyConfig", JSON.stringify(weeklyConfig));
    navigate("/weekly-timetable");
  };

  const selectedCount = Object.values(selectedDays).filter(Boolean).length;

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
          <h1 className="text-xl font-semibold">Weekly Timetable Setup</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Configure Your Week</h2>
            <p className="text-muted-foreground">
              Choose which days to include in your weekly schedule
            </p>
          </div>

          {/* Day Selection */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Active Days
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weekdays.map((day) => (
                  <div key={day.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.key}
                      checked={selectedDays[day.key as keyof typeof selectedDays]}
                      onCheckedChange={() => handleDayToggle(day.key)}
                    />
                    <Label 
                      htmlFor={day.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium">{selectedCount} days</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Day Off Configuration */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rest Day Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Designate a day off</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose one day as your official rest day
                  </p>
                </div>
                <Switch
                  checked={hasDayOff}
                  onCheckedChange={setHasDayOff}
                />
              </div>

              {hasDayOff && (
                <div className="space-y-2">
                  <Label>Which day would you like as your day off?</Label>
                  <Select value={dayOff} onValueChange={setDayOff}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {weekdays.map((day) => (
                        <SelectItem key={day.key} value={day.key}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Schedule Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekdays.map((day) => {
                  const isSelected = selectedDays[day.key as keyof typeof selectedDays];
                  const isDayOff = hasDayOff && dayOff === day.key;
                  
                  return (
                    <div
                      key={day.key}
                      className={`p-3 rounded-lg text-center text-sm ${
                        isSelected
                          ? isDayOff
                            ? 'bg-warning/20 border border-warning/30 text-warning-foreground'
                            : 'bg-primary/20 border border-primary/30 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="font-medium">{day.short}</div>
                      <div className="text-xs mt-1">
                        {!isSelected 
                          ? 'Off' 
                          : isDayOff 
                            ? 'Rest' 
                            : 'Active'
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            onClick={generateEmptyTimetable}
            className="w-full gradient-primary text-white"
            size="lg"
            disabled={selectedCount === 0}
          >
            Generate Empty Timetable
          </Button>

          {selectedCount === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Please select at least one day to continue
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default WeeklySetup;