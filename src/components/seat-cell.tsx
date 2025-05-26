"use client";
import React from 'react';
import { useDrop } from 'react-dnd';
import type { Student } from '@/lib/types';
import { ItemTypes } from '@/lib/types';
import { StudentCard } from './student-card';
import { cn } from '@/lib/utils';

interface SeatCellProps {
  rowIndex: number;
  colIndex: number;
  student: Student | null;
  onDropStudent: (item: { student: Student, originalRow?: number, originalCol?: number }, targetRow: number, targetCol: number) => void;
  onRemoveStudentFromSeat: (studentId?: string, rowIndex?: number, colIndex?: number) => void;
  T: any; // Translated strings
  onClick?: (rowIndex: number, colIndex: number) => void;
}

export const SeatCell: React.FC<SeatCellProps> = ({
  rowIndex,
  colIndex,
  student,
  onDropStudent,
  onRemoveStudentFromSeat,
  T,
  onClick,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.STUDENT,
    drop: (item: { student: Student, originalRow?: number, originalCol?: number }) => onDropStudent(item, rowIndex, colIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [rowIndex, colIndex, onDropStudent]);

  const cellClasses = cn(
    "border border-dashed border-border rounded-md min-h-[100px] w-full flex items-center justify-center relative",
    "transition-colors duration-150 ease-in-out",
    onClick && !student ? "cursor-pointer hover:bg-accent/20" : "",
    isOver && canDrop ? "bg-accent/30" : (student ? "bg-card" : "bg-background hover:bg-muted/50"),
  );

  return (
    <div
      ref={drop}
      onClick={onClick ? () => onClick(rowIndex, colIndex) : undefined}
      className={cellClasses}
      aria-label={student ? `Seat ${rowIndex+1}-${colIndex+1} occupied by ${student.englishName || student.chineseName}` : `Seat ${rowIndex+1}-${colIndex+1} empty`}
    >
      {student ? (
        <StudentCard
          student={student}
          isDraggable={true}
          originalRow={rowIndex}
          originalCol={colIndex}
          onRemove={() => onRemoveStudentFromSeat(student.id, rowIndex, colIndex)}
          T={T}
          isListItem={false}
        />
      ) : (
        <span className="text-muted-foreground text-xs">{T.emptySeatText}</span>
      )}
    </div>
  );
};
