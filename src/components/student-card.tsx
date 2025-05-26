"use client";
import React from 'react';
import { useDrag } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import type { Student } from '@/lib/types';
import { ItemTypes } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StudentCardProps {
  student: Student;
  isDraggable: boolean;
  onRemove?: (studentId: string) => void;
  isListItem: boolean;
  T: any; // Translated strings
  originalRow?: number;
  originalCol?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isDraggable,
  onRemove,
  isListItem,
  T,
  originalRow,
  originalCol,
  onClick,
  isSelected,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STUDENT,
    item: { student, originalRow, originalCol },
    canDrag: isDraggable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [student, isDraggable, originalRow, originalCol]);

  const displayEnglishName = student.nickname ? `${student.englishName} (${student.nickname})` : student.englishName;
  
  const cardClasses = cn(
    "p-2 border rounded-md shadow-sm flex flex-col justify-between text-xs bg-card text-card-foreground",
    isDraggable ? "cursor-grab" : "opacity-70 cursor-not-allowed",
    isListItem && isSelected && "ring-2 ring-primary",
    !isListItem && "min-h-[80px] h-full", // Ensure card in grid fills cell
    isDragging && "opacity-50"
  );

  return (
    <div
      ref={isDraggable ? drag : null}
      onClick={onClick}
      className={cardClasses}
      title={`${student.englishName || ''} ${student.nickname || ''} ${student.chineseName || ''} - ${student.rollNo || ''} - ${student.role || ''}`}
    >
      <div>
        <p className="font-semibold truncate text-sm">{displayEnglishName || 'N/A'}</p>
        <p className="text-muted-foreground truncate">{student.chineseName || ''} ({student.rollNo || 'N/A'})</p>
        {student.role && <p className="text-muted-foreground opacity-80 truncate italic text-xs">{student.role}</p>}
      </div>
      {onRemove && !isListItem && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click event if removing from seat
            onRemove(student.id);
          }}
          className="mt-1 text-destructive hover:text-destructive/80 self-start"
          title={T.instrRemoveFromSeat}
          aria-label={T.instrRemoveFromSeat}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};
