import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, DoorOpen, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Room {
  id: string;
  room_number: string;
  location: string;
  capacity: number;
  room_type: string;
  facilities: string[];
}

interface Block {
  id: string;
  name: string;
  building: string;
  floor: number;
}

const FACILITY_OPTIONS = [
  "Projector",
  "Whiteboard",
  "Smart Board",
  "Air Conditioning",
  "WiFi",
  "Audio System",
  "Video Recording",
  "Lab Equipment",
];

const ROOM_TYPES = [
  "Lecture Hall",
  "Laboratory",
  "Tutorial Room",
  "Seminar Hall",
  "Conference Room",
  "Auditorium",
];

const RoomManagement = () => {
  const { blockId } = useParams();
  const [block, setBlock] = useState<Block | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [instituteId, setInstituteId] = useState<string>("");
  const [formData, setFormData] = useState({
    room_number: "",
    location: "",
    capacity: 30,
    room_type: "Lecture Hall",
    facilities: [] as string[],
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !blockId) return;

    const fetchData = async () => {
      // Get institute
      const { data: institute, error: instError } = await supabase
        .from("institutes")
        .select("id")
        .eq("admin_id", user.id)
        .single();

      if (instError || !institute) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load institute data",
        });
        return;
      }

      setInstituteId(institute.id);

      // Get block
      const { data: blockData, error: blockError } = await supabase
        .from("blocks")
        .select("*")
        .eq("id", blockId)
        .single();

      if (blockError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: blockError.message,
        });
        return;
      }

      setBlock(blockData);

      // Get rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("*")
        .eq("block_id", blockId)
        .order("room_number", { ascending: true });

      if (roomsError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: roomsError.message,
        });
        return;
      }

      setRooms(roomsData || []);
      setLoading(false);
    };

    fetchData();
  }, [user, blockId, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("rooms").insert({
      block_id: blockId,
      institute_id: instituteId,
      ...formData,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Room added successfully",
    });

    setFormData({
      room_number: "",
      location: "",
      capacity: 30,
      room_type: "Lecture Hall",
      facilities: [],
    });
    setShowForm(false);

    // Refresh rooms
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("block_id", blockId)
      .order("room_number", { ascending: true });

    if (data) setRooms(data);
  };

  const handleDelete = async (roomId: string) => {
    const { error } = await supabase.from("rooms").delete().eq("id", roomId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Room deleted successfully",
    });

    setRooms(rooms.filter((r) => r.id !== roomId));
    setDeleteDialog(null);
  };

  const toggleFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={async () => {
                if (block) {
                  const { data } = await supabase
                    .from("blocks")
                    .select("department_id")
                    .eq("id", block.id)
                    .single();
                  
                  if (data) navigate(`/institute/lecture-halls/${data.department_id}`);
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {block?.name} - Rooms
              </h1>
              <p className="text-white/80 mt-1">
                {block?.building && `${block.building} - `}Floor {block?.floor}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>

        {showForm && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>Add New Room</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room_number">Room Number*</Label>
                    <Input
                      id="room_number"
                      value={formData.room_number}
                      onChange={(e) =>
                        setFormData({ ...formData, room_number: e.target.value })
                      }
                      placeholder="e.g., 101, A-205"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g., East Wing, Ground Floor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity*</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: parseInt(e.target.value) })
                      }
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room_type">Room Type*</Label>
                    <Select
                      value={formData.room_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, room_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Facilities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {FACILITY_OPTIONS.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={formData.facilities.includes(facility)}
                          onCheckedChange={() => toggleFacility(facility)}
                        />
                        <label
                          htmlFor={facility}
                          className="text-sm cursor-pointer"
                        >
                          {facility}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Add Room</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card key={room.id} className="bg-white/95">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="h-5 w-5 text-primary" />
                    Room {room.room_number}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteDialog(room.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Type: <span className="font-medium">{room.room_type}</span>
                  </p>
                  {room.location && (
                    <p className="text-sm text-muted-foreground">
                      Location: <span className="font-medium">{room.location}</span>
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Capacity: <span className="font-medium">{room.capacity} students</span>
                  </p>
                  {room.facilities && room.facilities.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Facilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.facilities.map((facility) => (
                          <span
                            key={facility}
                            className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && !showForm && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No rooms added yet</p>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Room</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this room? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDialog && handleDelete(deleteDialog)}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default RoomManagement;
