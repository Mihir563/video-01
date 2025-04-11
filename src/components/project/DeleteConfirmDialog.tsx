import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  projectId: string | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteConfirmDialog({ 
  projectId, 
  onCancel, 
  onConfirm 
}: DeleteConfirmDialogProps) {
  if (!projectId) return null;
  
  return (
    <Dialog open={!!projectId} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl border border-white/10 bg-card/95 backdrop-blur-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive">
            Delete Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-200 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onConfirm(projectId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 