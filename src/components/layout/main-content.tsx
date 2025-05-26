
"use client";
import React from 'react';
import { SeatingGrid } from '@/components/seating-grid';
import { InstructionsPanel } from '@/components/panels/instructions-panel'; 
import { HtmlExportPanel } from '@/components/panels/html-export-panel'; // Added import
import type { useSeatingPlan } from '@/hooks/useSeatingPlan';

type SeatingPlanHook = ReturnType<typeof useSeatingPlan>;

interface MainContentProps extends SeatingPlanHook {
  // Props passed from useSeatingPlan
}

export const MainContent: React.FC<MainContentProps> = (props) => {
  const {
    seatingAssignments,
    layoutSettings,
    getStudentById,
    onDropStudentToSeat,
    onRemoveStudentFromSeat,
    handleSeatClick,
    selectedStudentForClickDrop,
    teacherInfo, 
    T,
    // students, // No longer needed to be explicitly passed if props are spread
  } = props;

  return (
    <main className="flex-1 p-3 md:p-6 overflow-y-auto bg-muted/30 print:overflow-visible print:bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 md:mb-6 print:mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground print:text-xl">{layoutSettings.title}</h2>
            <p className="text-xs md:text-sm text-muted-foreground print:text-xs">
                {T.classNameLabel}: {teacherInfo.className} | {T.teacherNameLabel}: {teacherInfo.teacherName} | {T.academicYearLabel}: {teacherInfo.academicYear}
            </p>
        </div>

        {layoutSettings.teacherDeskPosition === 'top' && (
            <div className="p-2 mb-3 md:mb-4 text-sm text-center border rounded-md bg-card text-card-foreground print:hidden">
                {T.teacherDeskText}
            </div>
        )}

        <div className="p-2 md:p-4 rounded-lg shadow-lg border bg-card print:shadow-none print:border-none print:p-0">
          <SeatingGrid
            seatingAssignments={seatingAssignments}
            layoutSettings={layoutSettings}
            getStudentById={getStudentById}
            onDropStudent={onDropStudentToSeat}
            onRemoveStudentFromSeat={onRemoveStudentFromSeat}
            T={T}
            handleSeatClick={handleSeatClick}
            selectedStudentForClickDrop={selectedStudentForClickDrop}
          />
        </div>

        {layoutSettings.teacherDeskPosition === 'bottom' && (
             <div className="p-2 mt-3 md:mt-4 text-sm text-center border rounded-md bg-card text-card-foreground print:hidden">
                {T.teacherDeskText}
            </div>
        )}

        <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg shadow-md border bg-card">
          <InstructionsPanel T={T} />
        </div>

        <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg shadow-md border bg-card">
          <HtmlExportPanel {...props} />
        </div>

        {layoutSettings.additionalNotes && (
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t print:mt-4 print:pt-2 print:border-gray-300">
                <h4 className="font-semibold text-sm md:text-base text-foreground print:text-sm">{T.additionalNotesLabel.replace(':','')}</h4>
                <p className="text-xs md:text-sm text-muted-foreground whitespace-pre-wrap print:text-xs">{layoutSettings.additionalNotes}</p>
            </div>
        )}
      </div>
    </main>
  );
};
