
export interface Student {
  id: string;
  englishName?: string;
  nickname?: string;
  chineseName?: string;
  rollNo?: string;
  studentClass?: string;
  role?: string;
}

export interface TeacherInfo {
  className: string;
  teacherName: string;
  academicYear: string;
}

export interface LayoutSettings {
  rows: number;
  cols: number;
  title: string;
  teacherDeskPosition: 'top' | 'bottom' | 'none';
  displayLanguage: 'english_chinese' | 'english' | 'chinese';
  additionalNotes: string;
}

export type SeatingAssignment = (string | null)[][]; // 2D array of student IDs or null

export const ItemTypes = {
  STUDENT: 'student',
};

export type AppLanguage = 'en' | 'zh';

export type ThemeMode = 'light' | 'dark';
