"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TeacherInfo } from '@/lib/types';
import { User } from 'lucide-react';

interface TeacherInfoPanelProps {
  teacherInfo: TeacherInfo;
  handleTeacherInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  T: any;
}

export const TeacherInfoPanel: React.FC<TeacherInfoPanelProps> = ({
  teacherInfo,
  handleTeacherInfoChange,
  T,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center">
        <User size={20} className="mr-2" /> {T.teacherAndClassInfoTitle}
      </h3>
      <div>
        <Label htmlFor="className">{T.classNameLabel}</Label>
        <Input id="className" type="text" name="className" value={teacherInfo.className} onChange={handleTeacherInfoChange} />
      </div>
      <div>
        <Label htmlFor="teacherName">{T.teacherNameLabel}</Label>
        <Input id="teacherName" type="text" name="teacherName" value={teacherInfo.teacherName} onChange={handleTeacherInfoChange} />
      </div>
      <div>
        <Label htmlFor="academicYear">{T.academicYearLabel}</Label>
        <Input id="academicYear" type="text" name="academicYear" value={teacherInfo.academicYear} onChange={handleTeacherInfoChange} />
      </div>
    </div>
  );
};
