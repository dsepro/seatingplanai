
import type { LayoutSettings, TeacherInfo, SeatingAssignment, Student } from '@/lib/types';

export const generateSeatingPlanHTMLContentForWindow = (
  layoutSettings: LayoutSettings,
  teacherInfo: TeacherInfo,
  seatingAssignments: SeatingAssignment,
  getStudentById: (id: string | null) => Student | null,
  T: any // Translated strings
): string => {
    let html = `<html><head><meta charset="UTF-8"><title>${layoutSettings.title}</title>`;
    html += `<style>
        body { font-family: Arial, 'Microsoft JhengHei', 'Heiti TC', sans-serif; margin: 20px; background-color: #fff; color: #000; }
        h2 { text-align: center; }
        p.info { text-align: center; font-size: 0.9em; color: #555; }
        .teacher-desk { border: 1px solid #ccc; background-color: #e9e9e9; padding: 10px; text-align: center; margin-bottom: 15px; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-top: 15px; }
        td { border: 1px dashed #aaa; padding: 8px; text-align: center; vertical-align: top; min-height: 80px; height: 80px; width: ${100 / (layoutSettings.cols || 1)}%; overflow: hidden; font-size: 0.8em; box-sizing: border-box; }
        .student-name-en { font-weight: bold; display: block; margin-bottom: 2px; font-size: 0.9em; }
        .student-name-ch { color: #333; display: block; margin-bottom: 2px; font-size: 0.9em; }
        .student-roll { color: #666; font-size: 0.8em; display: block; }
        .student-role { font-style: italic; color: #777; display: block; font-size: 0.8em; }
        .notes { margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
        .notes h4 { margin-bottom: 5px; }
        .notes p { font-size: 0.9em; white-space: pre-wrap; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style></head><body>`;
    html += `<h2>${layoutSettings.title}</h2>`;
    html += `<p class="info">`;
    html += `${T.classNameLabel}: ${teacherInfo.className} | ${T.teacherNameLabel}: ${teacherInfo.teacherName} | ${T.academicYearLabel}: ${teacherInfo.academicYear}`;
    html += `</p>`;

    if (layoutSettings.teacherDeskPosition === 'top') {
        html += `<div class="teacher-desk">${T.teacherDeskText}</div>`;
    }

    html += `<table><tbody>`;
    for (let r = 0; r < layoutSettings.rows; r++) {
        html += `<tr>`;
        for (let c = 0; c < layoutSettings.cols; c++) {
            const studentId = seatingAssignments[r]?.[c];
            const student = studentId ? getStudentById(studentId) : null;
            html += `<td>`;
            if (student) {
                const displayEnglish = student.nickname ? `${student.englishName} (${student.nickname})` : student.englishName;
                if (layoutSettings.displayLanguage === 'english' || layoutSettings.displayLanguage === 'english_chinese') {
                     html += `<span class="student-name-en">${displayEnglish || ''}</span>`;
                }
                if (layoutSettings.displayLanguage === 'chinese' || layoutSettings.displayLanguage === 'english_chinese') {
                    html += `<span class="student-name-ch">${student.chineseName || ''}</span>`;
                }
                 html += `<span class="student-roll">(${student.rollNo || 'N/A'})</span>`;
                if (student.role) html += `<span class="student-role">${student.role}</span>`;
            } else {
                html += `&nbsp;`;
            }
            html += `</td>`;
        }
        html += `</tr>`;
    }
    html += `</tbody></table>`;

    if (layoutSettings.teacherDeskPosition === 'bottom') {
        html += `<div class="teacher-desk" style="margin-top: 15px;">${T.teacherDeskText}</div>`;
    }

    if (layoutSettings.additionalNotes) {
        html += `<div class="notes">`;
        html += `<h4>${T.additionalNotesLabel.replace(':','')}</h4>`;
        html += `<p>${layoutSettings.additionalNotes}</p>`;
        html += `</div>`;
    }
    html += `</body></html>`;
    return html;
};
