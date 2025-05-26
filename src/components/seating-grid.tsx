"use client";
import React from 'react';
import type { Student, SeatingAssignment, LayoutSettings } from '@/lib/types';
import { SeatCell } from './seat-cell';

interface SeatingGridProps {
  seatingAssignments: SeatingAssignment;
  layoutSettings: LayoutSettings;
  getStudentById: (id: string | null) => Student | null;
  onDropStudent: (item: { student: Student, originalRow?: number, originalCol?: number }, targetRow: number, targetCol: number) => void;
  onRemoveStudentFromSeat: (studentId?: string, rowIndex?: number, colIndex?: number) => void;
  T: any; // Translated strings
  handleSeatClick: (rowIndex: number, colIndex: number) => void;
  selectedStudentForClickDrop: Student | null;
}

export const SeatingGrid: React.FC<SeatingGridProps> = ({
  seatingAssignments,
  layoutSettings,
  getStudentById,
  onDropStudent,
  onRemoveStudentFromSeat,
  T,
  handleSeatClick,
  selectedStudentForClickDrop,
}) => {
  if (!seatingAssignments || seatingAssignments.length === 0 || !seatingAssignments[0] || seatingAssignments[0].length === 0) {
    return <p className="text-center text-muted-foreground p-10">{T.gridEmptyMessage}</p>;
  }

  const numRows = seatingAssignments.length;
  const numCols = seatingAssignments[0].length;

  return (
    <div className="grid gap-1 md:gap-2 w-full print:gap-1" style={{ gridTemplateRows: `repeat(${numRows}, minmax(100px, auto))`}}>
      {seatingAssignments.map((row, rowIndex) => (
        <div key={rowIndex} className="grid gap-1 md:gap-2" style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}>
          {row.map((studentId, colIndex) => {
            const student = getStudentById(studentId);
            return (
              <SeatCell
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                student={student}
                onDropStudent={onDropStudent}
                onRemoveStudentFromSeat={onRemoveStudentFromSeat}
                T={T}
                onClick={selectedStudentForClickDrop && !student ? handleSeatClick : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
