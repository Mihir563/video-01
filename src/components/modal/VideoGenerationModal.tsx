import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormModal = ({
  isOpen,
  onClose,
  
}: FormModalProps) => {
 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-indigo-900 to-black border border-indigo-500 shadow-2xl shadow-indigo-500/50 rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
        
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
