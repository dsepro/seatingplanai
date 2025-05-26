
export interface Student {
  id: string;
  englishName?: string;
  nickname?: string;
  chineseName?: string;
  rollNo?: string;
  studentClass?: string;
  role?: string;
  // Fields for AI suggestions (kept for potential future use, but not currently active)
  performance?: 'high' | 'medium' | 'low' | string; 
  behavior?: string; 
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

// HistoryEntry is no longer needed as history feature is removed.
// export interface HistoryEntry {
//   assignments: SeatingAssignment;
//   students: Student[]; 
// }
