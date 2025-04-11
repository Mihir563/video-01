// 5. EmptyProjectsState.tsx (components/projects/EmptyProjectsState.tsx)
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyProjectsState() {
  return (
    <div className="grid-item p-8 rounded-xl text-center">
      <div className="flex flex-col items-center justify-center py-10">
        <AlertCircle className="w-16 h-16 text-muted mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
        <p className="text-muted-foreground mb-6">You haven't created any projects yet.</p>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => window.location.href = '/'}
        >
          Create Your First Project
        </Button>
      </div>
    </div>
  );
}
