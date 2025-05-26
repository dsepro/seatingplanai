
"use client";
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentDataPanel } from '@/components/panels/student-data-panel';
import { TeacherInfoPanel } from '@/components/panels/teacher-info-panel';
import { LayoutSettingsPanel } from '@/components/panels/layout-settings-panel';
import { AutoAssignPanel } from '@/components/panels/auto-assign-panel';
// HtmlExportPanel removed from here
// InstructionsPanel removed from here
import type { useSeatingPlan } from '@/hooks/useSeatingPlan'; 
import { Users, UserCircle, Settings, ListChecks } from 'lucide-react'; // FileCode, HelpCircle removed

type SeatingPlanHook = ReturnType<typeof useSeatingPlan>;

interface SidebarLeftProps extends SeatingPlanHook {
  // T is already in SeatingPlanHook
}

export const SidebarLeft: React.FC<SidebarLeftProps> = (props) => {
  const {
    T,
  } = props;


  // Grouping panels with titles for clarity
  // InstructionsPanel removed from this group
  // HtmlExportPanel removed from this group
  const panelGroups = [
    { title: T.studentDataTab, Icon: Users, Component: StudentDataPanel, id: "studentData" },
    { title: T.teacherInfoTab, Icon: UserCircle, Component: TeacherInfoPanel, id: "teacherInfo" },
    { title: T.layoutSettingsTab, Icon: Settings, Component: LayoutSettingsPanel, id: "layoutSettings" },
    { title: T.autoAssignTab, Icon: ListChecks, Component: AutoAssignPanel, id: "autoAssign" },
    // { title: T.htmlExportTab, Icon: FileCode, Component: HtmlExportPanel, id: "htmlExport" }, // Removed
    // { title: T.instructionsTab, Icon: HelpCircle, Component: InstructionsPanel, id: "instructions" }, // Removed
  ];

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] bg-card p-3 md:p-4 print:hidden border-r flex flex-col flex-shrink-0">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-1">
          {panelGroups.map(({ title, Icon, Component, id }) => (
            <section key={id} aria-labelledby={`${id}-panel-title`}>
              {/* We can use the panel's internal h3 as the title, or add one here if needed */}
              {/* Example of adding a title here if panels don't have their own distinct one for this view:
              <h2 id={`${id}-panel-title`} className="text-lg font-semibold text-foreground mb-2 flex items-center">
                <Icon size={20} className="mr-2 text-primary" /> {title}
              </h2>
              */}
              <Component {...props} />
            </section>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};

