"use client";
import React from 'react';
import { HelpCircle } from 'lucide-react'; // Using HelpCircle for instructions

interface InstructionsPanelProps {
  T: any;
}

export const InstructionsPanel: React.FC<InstructionsPanelProps> = ({ T }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground flex items-center">
        <HelpCircle size={20} className="mr-2" /> {T.instructionsTitle}
      </h3>
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5">
        <li>{T.instrPrefill}</li>
        <li>{T.instrImport}</li>
        <li>{T.instrTeacherInfo}</li>
        <li>{T.instrDragDrop}</li>
        <li>{T.instrClickDrop}</li>
        <li>{T.instrDoubleClickAssign}</li>
        <li>{T.instrRemoveFromSeat}</li>
        <li>{T.instrAutoAssign}</li>
        <li>{T.instrLayout}</li>
        <li>{T.instrAiSuggest}</li>
        <li>{T.instrUndoRedo}</li>
        <li>{T.instrOpenPlanInNewWindow}</li>
        <li>{T.instrHtmlExport}</li>
      </ul>
    </div>
  );
};
