"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LayoutSettings } from '@/lib/types';
import { Settings, Rows, Columns, Edit3, Languages, StickyNote, CornerUpLeft } from 'lucide-react'; // Replaced Palette with Edit3 for title

interface LayoutSettingsPanelProps {
  layoutSettings: LayoutSettings;
  handleLayoutSettingsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | {name: string, value: string}) => void;
  T: any;
}

export const LayoutSettingsPanel: React.FC<LayoutSettingsPanelProps> = ({
  layoutSettings,
  handleLayoutSettingsChange,
  T,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center">
        <Settings size={20} className="mr-2" /> {T.layoutSettingsTitle}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="layoutRows" className="flex items-center"><Rows size={14} className="mr-1" />{T.rowsLabel}</Label>
          <Input id="layoutRows" type="number" name="rows" value={layoutSettings.rows} onChange={handleLayoutSettingsChange} min="1" />
        </div>
        <div>
          <Label htmlFor="layoutCols" className="flex items-center"><Columns size={14} className="mr-1" />{T.colsLabel}</Label>
          <Input id="layoutCols" type="number" name="cols" value={layoutSettings.cols} onChange={handleLayoutSettingsChange} min="1" />
        </div>
      </div>
      <div>
        <Label htmlFor="planTitle" className="flex items-center"><Edit3 size={14} className="mr-1" />{T.planTitleLabel}</Label>
        <Input id="planTitle" type="text" name="title" value={layoutSettings.title} onChange={handleLayoutSettingsChange} />
      </div>
      <div>
        <Label className="flex items-center"><CornerUpLeft size={14} className="mr-1" />{T.teacherDeskPosLabel}</Label>
        <Select
          name="teacherDeskPosition"
          value={layoutSettings.teacherDeskPosition}
          onValueChange={(value) => handleLayoutSettingsChange({ name: 'teacherDeskPosition', value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={T.selectPositionPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">{T.deskTop}</SelectItem>
            <SelectItem value="bottom">{T.deskBottom}</SelectItem>
            <SelectItem value="none">{T.deskNone}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="flex items-center"><Languages size={14} className="mr-1" />{T.studentNameDisplayLangLabel}</Label>
        <Select
          name="displayLanguage"
          value={layoutSettings.displayLanguage}
          onValueChange={(value) => handleLayoutSettingsChange({ name: 'displayLanguage', value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={T.selectLanguagePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english_chinese">{T.langEngAndChi}</SelectItem>
            <SelectItem value="english">{T.langEngOnly}</SelectItem>
            <SelectItem value="chinese">{T.langChiOnly}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="additionalNotes" className="flex items-center"><StickyNote size={14} className="mr-1" />{T.additionalNotesLabel}</Label>
        <Textarea id="additionalNotes" name="additionalNotes" value={layoutSettings.additionalNotes} onChange={handleLayoutSettingsChange} rows={2} />
      </div>
      {/* Apply button removed as per user request, settings apply on change */}
    </div>
  );
};
