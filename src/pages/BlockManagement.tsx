import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, Building, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
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

interface Block {
  id: string;
  name: string;
  building: string;
  floor: number;
  room_count?: number;
}

interface Branch {
  id: string;
  name: string;
  code: string;
}

const BlockManagement = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [instituteId, setInstituteId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    floor: 1,
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !branchId) return;

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

      // Get branch
      const { data: branchData, error: branchError } = await supabase
        .from("branches")
        .select("*")
        .eq("id", branchId)
        .single();

      if (branchError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: branchError.message,
        });
        return;
      }

      setBranch(branchData);

      // Get blocks with room counts
      const { data: blocksData, error: blocksError } = await supabase
        .from("blocks")
        .select("*")
        .eq("branch_id", branchId)
        .order("created_at", { ascending: false });

      if (blocksError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: blocksError.message,
        });
        return;
      }

      // Get room counts
      const blocksWithCounts = await Promise.all(
        (blocksData || []).map(async (block) => {
          const { count } = await supabase
            .from("rooms")
            .select("id", { count: "exact", head: true })
            .eq("block_id", block.id);

          return { ...block, room_count: count || 0 };
        })
      );

      setBlocks(blocksWithCounts);
      setLoading(false);
    };

    fetchData();
  }, [user, branchId, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("blocks").insert({
      branch_id: branchId,
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
      description: "Block added successfully",
    });

    setFormData({ name: "", building: "", floor: 1 });
    setShowForm(false);

    // Refresh blocks
    const { data } = await supabase
      .from("blocks")
      .select("*")
      .eq("branch_id", branchId)
      .order("created_at", { ascending: false });

    if (data) {
      const blocksWithCounts = await Promise.all(
        data.map(async (block) => {
          const { count } = await supabase
            .from("rooms")
            .select("id", { count: "exact", head: true })
            .eq("block_id", block.id);

          return { ...block, room_count: count || 0 };
        })
      );
      setBlocks(blocksWithCounts);
    }
  };

  const handleDelete = async (blockId: string) => {
    const { error } = await supabase.from("blocks").delete().eq("id", blockId);

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
      description: "Block deleted successfully",
    });

    setBlocks(blocks.filter((b) => b.id !== blockId));
    setDeleteDialog(null);
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
                const { data: branchData } = await supabase
                  .from("branches")
                  .select("department_id")
                  .eq("id", branchId)
                  .single();
                
                if (branchData) {
                  navigate(`/institute/departments/${branchData.department_id}/branches`);
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {branch?.name} - Blocks
              </h1>
              <p className="text-white/80 mt-1">Manage blocks for this branch</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>

        {showForm && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle>Add New Block</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Block Name*</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Block A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData({ ...formData, building: e.target.value })
                      }
                      placeholder="e.g., Main Building"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor Number</Label>
                    <Input
                      id="floor"
                      type="number"
                      value={formData.floor}
                      onChange={(e) =>
                        setFormData({ ...formData, floor: parseInt(e.target.value) })
                      }
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Block</Button>
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
          {blocks.map((block) => (
            <Card
              key={block.id}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white/95"
              onClick={() => navigate(`/institute/blocks/${block.id}/rooms`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    {block.name}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteDialog(block.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {block.building && (
                    <p className="text-sm text-muted-foreground">
                      Building: <span className="font-medium">{block.building}</span>
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Floor: <span className="font-medium">{block.floor}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rooms: <span className="font-medium">{block.room_count}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {blocks.length === 0 && !showForm && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No blocks added yet</p>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Block</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this block? This will also delete all rooms in this block.
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

export default BlockManagement;
