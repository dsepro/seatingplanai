"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentCard } from '@/components/student-card';
import type { Student, LayoutSettings, SeatingAssignment } from '@/lib/types';
import { UploadCloud, Users, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface StudentDataPanelProps {
  students: Student[];
  filteredStudents: Student[];
  studentDataPasted: string;
  setStudentDataPasted: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleImportPastedStudents: () => void;
  seatingAssignments: SeatingAssignment;
  layoutSettings: LayoutSettings;
  handleStudentCardClick: (student: Student) => void;
  selectedStudentForClickDrop: Student | null;
  T: any;
}

export const StudentDataPanel: React.FC<StudentDataPanelProps> = ({
  students,
  filteredStudents,
  studentDataPasted,
  setStudentDataPasted,
  searchTerm,
  setSearchTerm,
  handleImportPastedStudents,
  seatingAssignments,
  layoutSettings, // Not directly used for displayLang here, StudentCard handles it
  handleStudentCardClick,
  selectedStudentForClickDrop,
  T,
}) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center mb-2">
          <UploadCloud size={20} className="mr-2" /> {T.importStudentListTitle}
        </h3>
        <Textarea
          value={studentDataPasted}
          onChange={(e) => setStudentDataPasted(e.target.value)}
          placeholder={T.pasteStudentListPlaceholder}
          className="w-full h-40 text-sm"
          aria-label={T.importStudentListTitle}
        />
        <Button onClick={handleImportPastedStudents} className="w-full mt-2">
          <UploadCloud size={16} className="mr-2" /> {T.importAndReplaceButton}
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center mb-2">
          <Users size={20} className="mr-2" /> {T.currentStudentListTitle} ({students.filter(s => !seatingAssignments.flat().includes(s.id)).length} / {students.length})
        </h3>
        <div className="relative mb-2">
          <Input
            type="text"
            placeholder={T.searchStudentsPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8"
            aria-label={T.searchStudentsPlaceholder}
          />
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
        <ScrollArea className="h-72 md:h-96 rounded-md border bg-background">
          <div className="p-2 space-y-2">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(s => {
                const isSeated = seatingAssignments.flat().includes(s.id);
                return (
                  <StudentCard
                    key={s.id}
                    student={s}
                    isDraggable={!isSeated}
                    onClick={isSeated ? undefined : () => handleStudentCardClick(s)}
                    isSelected={selectedStudentForClickDrop?.id === s.id && !isSeated}
                    T={T}
                    isListItem={true}
                  />
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground p-4 text-center">{T.noStudentsMessage}</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
