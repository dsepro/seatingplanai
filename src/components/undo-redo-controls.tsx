"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2 } from 'lucide-react';

interface UndoRedoControlsProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  T: any; // Translated strings
}

export const UndoRedoControls: React.FC<UndoRedoControlsProps> = ({ undo, redo, canUndo, canRedo, T }) => {
  return (
    <div className="space-y-2">
       <h3 className="text-lg font-semibold text-foreground flex items-center">
          {T.undoRedoControlsTitle}
        </h3>
      <div className="flex space-x-2">
        <Button onClick={undo} disabled={!canUndo} variant="outline" className="flex-1">
          <Undo2 className="mr-2 h-4 w-4" /> {T.undoButton}
        </Button>
        <Button onClick={redo} disabled={!canRedo} variant="outline" className="flex-1">
          <Redo2 className="mr-2 h-4 w-4" /> {T.redoButton}
        </Button>
      </div>
    </div>
  );
};
