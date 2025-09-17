import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Upload, 
  Link as LinkIcon, 
  PenTool, 
  Volume2, 
  Camera,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TaskDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const taskFromState = location.state?.task;
  
  const [taskData, setTaskData] = useState({
    title: taskFromState?.activity || "",
    description: "",
    notes: "",
    alarmTone: "default",
    attachments: [] as string[],
    links: [] as string[],
    startPhoto: null as File | null,
    endPhoto: null as File | null
  });

  const [newLink, setNewLink] = useState("");
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const alarmTones = [
    { value: "default", label: "Default Tone" },
    { value: "gentle", label: "Gentle Chime" },
    { value: "energetic", label: "Energetic Beep" },
    { value: "nature", label: "Nature Sounds" },
    { value: "classical", label: "Classical Music" }
  ];

  const handleSave = () => {
    if (!taskData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Missing title",
        description: "Please enter a task title"
      });
      return;
    }

    toast({
      title: "Task saved!",
      description: "Your task details have been updated successfully."
    });
    
    navigate(-1);
  };

  const addLink = () => {
    if (newLink.trim()) {
      setTaskData({
        ...taskData,
        links: [...taskData.links, newLink]
      });
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    setTaskData({
      ...taskData,
      links: taskData.links.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = (type: 'attachment' | 'startPhoto' | 'endPhoto') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'attachment' ? '*' : 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (type === 'attachment') {
          setTaskData({
            ...taskData,
            attachments: [...taskData.attachments, file.name]
          });
        } else {
          setTaskData({
            ...taskData,
            [type]: file
          });
        }
        toast({
          title: "File uploaded",
          description: `${file.name} has been attached to this task.`
        });
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Task Details</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gradient-primary text-white">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Subject/Task Title</Label>
                <Input
                  id="title"
                  value={taskData.title}
                  onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                  placeholder="Enter task title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskData.description}
                  onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                  placeholder="Describe what this task involves..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={taskData.notes}
                  onChange={(e) => setTaskData({...taskData, notes: e.target.value})}
                  placeholder="Add any additional notes, reminders, or important details..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resources & Attachments */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Resources & Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Attachments */}
              <div className="space-y-3">
                <Label>File Attachments</Label>
                <Button 
                  variant="outline" 
                  onClick={() => handleFileUpload('attachment')}
                  className="w-full gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Files
                </Button>
                {taskData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {taskData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{file}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setTaskData({
                            ...taskData, 
                            attachments: taskData.attachments.filter((_, i) => i !== index)
                          })}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="space-y-3">
                <Label>Useful Links</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a URL..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                  />
                  <Button onClick={addLink} variant="outline">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                {taskData.links.length > 0 && (
                  <div className="space-y-2">
                    {taskData.links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm truncate">{link}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeLink(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Whiteboard */}
              <div className="space-y-3">
                <Label>Quick Whiteboard</Label>
                <Button 
                  variant="outline" 
                  onClick={() => setShowWhiteboard(!showWhiteboard)}
                  className="w-full gap-2"
                >
                  <PenTool className="h-4 w-4" />
                  {showWhiteboard ? "Hide Whiteboard" : "Open Whiteboard"}
                </Button>
                {showWhiteboard && (
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center bg-muted/20">
                    <PenTool className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Whiteboard feature coming soon!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Task Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Alarm Tone */}
              <div className="space-y-2">
                <Label>Alarm Tone</Label>
                <Select value={taskData.alarmTone} onValueChange={(value) => setTaskData({...taskData, alarmTone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alarmTones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          {tone.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Task Photos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Task Start Photo</Label>
                  <Button 
                    variant="outline" 
                    onClick={() => handleFileUpload('startPhoto')}
                    className="w-full gap-2 h-20 flex-col"
                  >
                    <Camera className="h-6 w-6" />
                    {taskData.startPhoto ? taskData.startPhoto.name : "Upload Start Photo"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Task End Photo</Label>
                  <Button 
                    variant="outline" 
                    onClick={() => handleFileUpload('endPhoto')}
                    className="w-full gap-2 h-20 flex-col"
                  >
                    <Camera className="h-6 w-6" />
                    {taskData.endPhoto ? taskData.endPhoto.name : "Upload End Photo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TaskDetail;