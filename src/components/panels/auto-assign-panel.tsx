"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListChecks, Users, RotateCcw } from 'lucide-react'; // Replaced LayoutList with ListChecks

interface AutoAssignPanelProps {
  autoAssignStudents: (method: string) => void;
  clearAllSeats: () => void;
  T: any;
}

export const AutoAssignPanel: React.FC<AutoAssignPanelProps> = ({
  autoAssignStudents,
  clearAllSeats,
  T,
}) => {
  const [autoAssignMethod, setAutoAssignMethod] = useState('alphabetical_english');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center">
        <ListChecks size={20} className="mr-2" /> {T.autoAssignTitle}
      </h3>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">{T.assignmentMethodLabel}</label>
        <Select value={autoAssignMethod} onValueChange={setAutoAssignMethod}>
          <SelectTrigger>
            <SelectValue placeholder={T.selectMethodPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetical_english">{T.assignAlphaEng}</SelectItem>
            <SelectItem value="alphabetical_chinese">{T.assignAlphaChi}</SelectItem>
            <SelectItem value="roll_no">{T.assignClassNo}</SelectItem>
            <SelectItem value="random">{T.assignRandom}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => autoAssignStudents(autoAssignMethod)} className="w-full">
        <Users size={16} className="mr-2" /> {T.autoAssignButton}
      </Button>
      <Button onClick={clearAllSeats} variant="destructive" className="w-full">
        <RotateCcw size={16} className="mr-2" /> {T.clearAllSeatsButton}
      </Button>
    </div>
  );
};
