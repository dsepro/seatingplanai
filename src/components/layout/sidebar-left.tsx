"use client";
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentDataPanel } from '@/components/panels/student-data-panel';
import { TeacherInfoPanel } from '@/components/panels/teacher-info-panel';
import { LayoutSettingsPanel } from '@/components/panels/layout-settings-panel';
import { AutoAssignPanel } from '@/components/panels/auto-assign-panel';
import { AiSuggestionsPanel } from '@/components/panels/ai-suggestions-panel';
import { HtmlExportPanel } from '@/components/panels/html-export-panel';
import { InstructionsPanel } from '@/components/panels/instructions-panel';
import { UndoRedoControls } from '@/components/undo-redo-controls';
import type { useSeatingPlan } from '@/hooks/useSeatingPlan'; // For type
import { Users, UserCircle, Settings, ListChecks, Wand2, FileCode, HelpCircle, History } from 'lucide-react';

type SeatingPlanHook = ReturnType<typeof useSeatingPlan>;

interface SidebarLeftProps extends SeatingPlanHook {
  // T is already in SeatingPlanHook
}

export const SidebarLeft: React.FC<SidebarLeftProps> = (props) => {
  const {
    students,
    filteredStudents,
    studentDataPasted,
    setStudentDataPasted,
    searchTerm,
    setSearchTerm,
    handleImportPastedStudents,
    seatingAssignments,
    layoutSettings,
    handleLayoutSettingsChange,
    handleStudentCardClick,
    selectedStudentForClickDrop,
    teacherInfo,
    handleTeacherInfoChange,
    autoAssignStudents,
    clearAllSeats,
    aiCriteria,
    setAiCriteria,
    aiReasoning,
    isAiSuggestionLoading,
    handleGetAiSuggestion,
    getStudentById, // for HTML Export
    undo,
    redo,
    canUndo,
    canRedo,
    T,
  } = props;

  const tabCommonClass = "text-xs px-2 py-1.5 sm:text-sm sm:px-3 sm:py-2 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary";
  const iconCommonClass = "mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4";

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] bg-card p-3 md:p-4 space-y-1 overflow-y-auto print:hidden border-r flex-shrink-0">
      <Tabs defaultValue="studentData" className="w-full">
        <ScrollArea className="pr-2 -mr-2"> {/* Offset scrollbar for better look */}
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 h-auto mb-2">
            <TabsTrigger value="studentData" className={tabCommonClass}><Users className={iconCommonClass} />{T.studentDataTab}</TabsTrigger>
            <TabsTrigger value="teacherInfo" className={tabCommonClass}><UserCircle className={iconCommonClass} />{T.teacherInfoTab}</TabsTrigger>
            <TabsTrigger value="layoutSettings" className={tabCommonClass}><Settings className={iconCommonClass} />{T.layoutSettingsTab}</TabsTrigger>
            <TabsTrigger value="autoAssign" className={tabCommonClass}><ListChecks className={iconCommonClass} />{T.autoAssignTab}</TabsTrigger>
            <TabsTrigger value="aiSuggestions" className={tabCommonClass}><Wand2 className={iconCommonClass} />{T.aiSuggestionsTab}</TabsTrigger>
            <TabsTrigger value="history" className={tabCommonClass}><History className={iconCommonClass} />{T.undoRedoControlsTitle}</TabsTrigger>
            <TabsTrigger value="htmlExport" className={tabCommonClass}><FileCode className={iconCommonClass} />{T.htmlExportTab}</TabsTrigger>
            <TabsTrigger value="instructions" className={tabCommonClass}><HelpCircle className={iconCommonClass} />{T.instructionsTab}</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <ScrollArea className="h-[calc(100vh-180px)] md:h-[calc(100vh-160px)]"> {/* Adjusted height */}
          <div className="p-1">
          <TabsContent value="studentData">
            <StudentDataPanel {...props} />
          </TabsContent>
          <TabsContent value="teacherInfo">
            <TeacherInfoPanel {...props} />
          </TabsContent>
          <TabsContent value="layoutSettings">
            <LayoutSettingsPanel {...props} />
          </TabsContent>
          <TabsContent value="autoAssign">
            <AutoAssignPanel {...props} />
          </TabsContent>
          <TabsContent value="aiSuggestions">
            <AiSuggestionsPanel {...props} />
          </TabsContent>
          <TabsContent value="history">
            <UndoRedoControls undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} T={T} />
          </TabsContent>
          <TabsContent value="htmlExport">
            <HtmlExportPanel
              layoutSettings={layoutSettings}
              teacherInfo={teacherInfo}
              seatingAssignments={seatingAssignments}
              getStudentById={getStudentById}
              T={T}
            />
          </TabsContent>
          <TabsContent value="instructions">
            <InstructionsPanel T={T} />
          </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </aside>
  );
};
