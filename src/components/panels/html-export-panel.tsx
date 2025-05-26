"use client";
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileCode, ClipboardCopy, Download } from 'lucide-react';
import type { LayoutSettings, TeacherInfo, SeatingAssignment, Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface HtmlExportPanelProps {
  layoutSettings: LayoutSettings;
  teacherInfo: TeacherInfo;
  seatingAssignments: SeatingAssignment;
  getStudentById: (id: string | null) => Student | null;
  T: any;
}

export const HtmlExportPanel: React.FC<HtmlExportPanelProps> = ({
  layoutSettings,
  teacherInfo,
  seatingAssignments,
  getStudentById,
  T,
}) => {
  const [seatingPlanHTML, setSeatingPlanHTML] = useState('');
  const [showHTMLOutput, setShowHTMLOutput] = useState(false);
  const { toast } = useToast();

  const generateSeatingPlanHTMLContent = useCallback(() => {
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
        html += `<h4>${T.additionalNotesLabel.replace(':','')}</h4>`; // Remove colon for consistency
        html += `<p>${layoutSettings.additionalNotes}</p>`;
        html += `</div>`;
    }
    html += `</body></html>`;
    return html;
  }, [layoutSettings, teacherInfo, seatingAssignments, getStudentById, T]);

  const handleGenerateHTML = () => {
    setSeatingPlanHTML(generateSeatingPlanHTMLContent());
    setShowHTMLOutput(true);
  };

  const copyHTMLToClipboard = async () => {
    if (!seatingPlanHTML) {
        const currentHtml = generateSeatingPlanHTMLContent();
        setSeatingPlanHTML(currentHtml);
         if (!navigator.clipboard) {
            toast({ title: T.errorCopyingHTML, description: "Clipboard API not available.", variant: "destructive" });
            return;
        }
        try {
            await navigator.clipboard.writeText(currentHtml);
            toast({ title: T.copiedMessage });
        } catch (err) {
            console.error(T.errorCopyingHTML, err);
            toast({ title: T.errorCopyingHTML, description: String(err), variant: "destructive" });
        }
        return;
    }
    if (!navigator.clipboard) {
        toast({ title: T.errorCopyingHTML, description: "Clipboard API not available.", variant: "destructive" });
        return;
    }
    try {
        await navigator.clipboard.writeText(seatingPlanHTML);
        toast({ title: T.copiedMessage });
    } catch (err) {
        console.error(T.errorCopyingHTML, err);
        toast({ title: T.errorCopyingHTML, description: String(err), variant: "destructive" });
    }
  };

  const handleDownloadHTMLPage = () => {
    const htmlContent = seatingPlanHTML || generateSeatingPlanHTMLContent();
    if (!seatingPlanHTML) setSeatingPlanHTML(htmlContent); // Ensure it's set for next copy
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${layoutSettings.title.replace(/\s+/g, '_') || 'Seating_Plan'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <FileCode size={18} className="mr-2" /> {T.htmlOutputTitle}
        </h3>
        <Button onClick={handleGenerateHTML} variant="outline">
          <FileCode size={16} className="mr-1.5" /> {T.generateHtmlButton}
        </Button>
      </div>
      {showHTMLOutput && seatingPlanHTML && (
        <>
          <Textarea
            readOnly
            value={seatingPlanHTML}
            className="w-full h-40 font-mono text-xs bg-muted/50"
            aria-label={T.htmlOutputTitle}
          />
          <div className="flex space-x-2 mt-2">
            <Button onClick={copyHTMLToClipboard} variant="secondary">
              <ClipboardCopy size={16} className="mr-1.5" /> {T.copyHtmlButton}
            </Button>
            <Button onClick={handleDownloadHTMLPage} variant="secondary">
              <Download size={16} className="mr-1.5" /> {T.downloadHtmlButton}
            </Button>
          </div>
        </>
      )}
      {!showHTMLOutput && <p className="text-sm text-muted-foreground">{T.htmlOutputPlaceholder}</p>}
    </div>
  );
};
