"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Student, TeacherInfo, LayoutSettings, SeatingAssignment, AppLanguage, HistoryEntry } from '@/lib/types';
import { getTranslatedStrings, uiStrings } from '@/lib/i18n';
import { generatePresetStudentObjects, parsePastedStudentData, formatStudentObjectsToPastedString } from '@/lib/studentUtils';
import { suggestSeatingArrangements, type SuggestSeatingArrangementsInput } from '@/ai/flows/suggest-seating-arrangements';
import { useToast } from '@/hooks/use-toast';

const MAX_HISTORY_LENGTH = 20; // Max undo/redo steps

const initialTeacherInfoDefault: TeacherInfo = {
  className: 'Class 5A',
  teacherName: '鍾永老師, Mr. Chung',
  academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
};

const initialLayoutSettingsDefault: LayoutSettings = {
  rows: 5,
  cols: 8,
  title: '課室座位表', // Default to Chinese title
  teacherDeskPosition: 'top',
  displayLanguage: 'english_chinese',
  additionalNotes: '',
};


export const useSeatingPlan = (language: AppLanguage) => {
  const T = getTranslatedStrings(language);
  const { toast } = useToast();

  const [students, setStudentsState] = useState<Student[]>([]);
  const [teacherInfo, setTeacherInfoState] = useState<TeacherInfo>({ ...initialTeacherInfoDefault });
  const [layoutSettings, setLayoutSettingsState] = useState<LayoutSettings>({ ...initialLayoutSettingsDefault, title: T.planTitleLabel });
  
  const [seatingAssignments, setSeatingAssignmentsState] = useState<SeatingAssignment>([]);
  
  const [studentDataPasted, setStudentDataPasted] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentForClickDrop, setSelectedStudentForClickDrop] = useState<Student | null>(null);

  // AI Suggestion State
  const [aiCriteria, setAiCriteria] = useState('');
  const [aiReasoning, setAiReasoning] = useState('');
  const [isAiSuggestionLoading, setIsAiSuggestionLoading] = useState(false);

  // Undo/Redo State
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1); // Points to the current state in history

  const recordHistory = useCallback((currentAssignments: SeatingAssignment, currentStudents: Student[]) => {
    const newHistoryEntry = { assignments: currentAssignments, students: currentStudents }; // currentStudents might not be strictly needed if order is managed differently
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryEntry);
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory.shift(); // Remove oldest entry
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const setStudents = (newStudents: Student[] | ((prev: Student[]) => Student[])) => {
    setStudentsState(prevStudents => {
      const updatedStudents = typeof newStudents === 'function' ? newStudents(prevStudents) : newStudents;
      // When students list changes significantly (e.g. import), record history if needed
      // For now, history is mainly for assignments.
      return updatedStudents;
    });
  };
  
  const setSeatingAssignments = (newAssignments: SeatingAssignment | ((prev: SeatingAssignment) => SeatingAssignment)) => {
    setSeatingAssignmentsState(prevAssignments => {
      const updatedAssignments = typeof newAssignments === 'function' ? newAssignments(prevAssignments) : newAssignments;
      // Don't record history if assignments are identical or during undo/redo
      if (JSON.stringify(updatedAssignments) !== JSON.stringify(prevAssignments)) {
         // The `students` state reference here would be the one from the `useSeatingPlan` hook's scope
         // which should be up-to-date.
        recordHistory(updatedAssignments, students);
      }
      return updatedAssignments;
    });
  };


  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      const prevState = history[historyIndex - 1];
      setSeatingAssignmentsState(prevState.assignments); // Set state directly without re-recording
      // setStudentsState(prevState.students); // Optionally restore student list state too
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      const nextState = history[historyIndex + 1];
      setSeatingAssignmentsState(nextState.assignments); // Set state directly
      // setStudentsState(nextState.students);
    }
  };
  
  // Initialize app state
  useEffect(() => {
    setIsLoading(true);
    const currentClassName = teacherInfo.className || initialTeacherInfoDefault.className;
    const presetStudents = generatePresetStudentObjects(currentClassName);
    setStudentsState(presetStudents);
    setStudentDataPasted(formatStudentObjectsToPastedString(presetStudents));
    
    // Initialize layout title based on current language
    setLayoutSettingsState(prev => ({...prev, title: T.planTitleLabel || initialLayoutSettingsDefault.title}));

    const initialRows = layoutSettings.rows > 0 ? layoutSettings.rows : initialLayoutSettingsDefault.rows;
    const initialCols = layoutSettings.cols > 0 ? layoutSettings.cols : initialLayoutSettingsDefault.cols;
    const initialGrid = Array(initialRows).fill(null).map(() => Array(initialCols).fill(null));
    setSeatingAssignmentsState(initialGrid);
    recordHistory(initialGrid, presetStudents); // Initial history state
    setIsLoading(false);
  }, [T.planTitleLabel]); // Rerun if language changes title

  // Update grid size when rows/cols change in layoutSettings
  useEffect(() => {
    setSeatingAssignmentsState(prevAssignments => {
        const newRows = Number(layoutSettings.rows) || 1;
        const newCols = Number(layoutSettings.cols) || 1;
        const newGrid = Array(newRows).fill(null).map(() => Array(newCols).fill(null));

        if (prevAssignments && prevAssignments.length > 0 && prevAssignments[0]?.length > 0) {
            for (let r = 0; r < Math.min(newRows, prevAssignments.length); r++) {
                for (let c = 0; c < Math.min(newCols, prevAssignments[0].length); c++) {
                    newGrid[r][c] = prevAssignments[r][c];
                }
            }
        }
        // This change should also be part of history
        // The main setSeatingAssignments wrapper handles history recording
        return newGrid; 
    });
  }, [layoutSettings.rows, layoutSettings.cols]);


  const handleTeacherInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTeacherInfoState({ ...teacherInfo, [e.target.name]: e.target.value });
  };

  const handleLayoutSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: string }>) => {
    const { name, value } = 'target' in e ? e.target : e; // Handle custom select event
    setLayoutSettingsState(prev => ({
      ...prev,
      [name]: (name === 'rows' || name === 'cols') ? (parseInt(value, 10) > 0 ? parseInt(value, 10) : 1) : value
    }));
  };

  const reorderStudentToBottomOfList = useCallback((studentId: string) => {
    setStudentsState(prevStudents => {
        const studentIndex = prevStudents.findIndex(s => s.id === studentId);
        if (studentIndex === -1) return prevStudents;
        
        const studentToMove = prevStudents[studentIndex];
        const newList = [...prevStudents.slice(0, studentIndex), ...prevStudents.slice(studentIndex + 1)];
        newList.push(studentToMove);
        return newList;
    });
  }, []);

  const onDropStudentToSeat = useCallback((item: { student: Student, originalRow?: number, originalCol?: number }, targetRow: number, targetCol: number) => {
    const { student: draggedStudent, originalRow, originalCol } = item;

    if (!draggedStudent || !draggedStudent.id) {
        console.error("Dropped item is not a valid student:", item);
        return;
    }
    
    setSeatingAssignments(prevAssignments => {
        const newGrid = prevAssignments.map(r => [...r]);
        const studentInTargetCellId = newGrid[targetRow]?.[targetCol]; // Student ID in target cell

        // Clear student from original position (if it was on grid) or any other position
        if (originalRow !== undefined && originalCol !== undefined) { // Dragged from within grid
            newGrid[originalRow][originalCol] = null;
        } else { // Dragged from student list, remove if already seated elsewhere
            for (let r = 0; r < newGrid.length; r++) {
                for (let c = 0; c < newGrid[r].length; c++) {
                    if (newGrid[r][c] === draggedStudent.id) {
                        newGrid[r][c] = null;
                    }
                }
            }
        }
        
        // Place dragged student in target cell
        newGrid[targetRow][targetCol] = draggedStudent.id;

        // If there was a student in the target cell and dragged student came from grid (swap)
        if (studentInTargetCellId && originalRow !== undefined && originalCol !== undefined) {
            if (originalRow !== targetRow || originalCol !== targetCol) { // Not dropping on itself
                 newGrid[originalRow][originalCol] = studentInTargetCellId; // Place target cell student in original pos
            }
        }
        return newGrid;
    });
    reorderStudentToBottomOfList(draggedStudent.id);
    setSelectedStudentForClickDrop(null);
  }, [reorderStudentToBottomOfList, setSeatingAssignments]);

  const onRemoveStudentFromSeat = useCallback((studentIdToRemove?: string, rowIndex?: number, colIndex?: number) => {
    setSeatingAssignments(prevAssignments => {
        const newAssignments = prevAssignments.map(row => [...row]);
        let actualStudentIdToRemove = studentIdToRemove;

        if(rowIndex !== undefined && colIndex !== undefined && !actualStudentIdToRemove) {
             actualStudentIdToRemove = newAssignments[rowIndex][colIndex];
             newAssignments[rowIndex][colIndex] = null;
        } else if (actualStudentIdToRemove) {
            for (let r = 0; r < newAssignments.length; r++) {
                for (let c = 0; c < newAssignments[r].length; c++) {
                    if (newAssignments[r][c] === actualStudentIdToRemove) {
                        newAssignments[r][c] = null;
                        // Found and removed, break if only one instance expected
                        // If multiple instances allowed (not typical), remove this break
                        break; 
                    }
                }
                 if (newAssignments.flat().indexOf(actualStudentIdToRemove) === -1) break;
            }
        }
        
        if(actualStudentIdToRemove){
            setStudentsState(prevStudents => {
                const studentIndex = prevStudents.findIndex(s => s.id === actualStudentIdToRemove);
                if (studentIndex === -1) return prevStudents; // Should not happen
                
                // Move student to the beginning of the list
                const studentToMove = prevStudents[studentIndex];
                const newList = [studentToMove, ...prevStudents.slice(0, studentIndex), ...prevStudents.slice(studentIndex + 1)];
                return newList;
            });
        }
        return newAssignments;
    });
    setSelectedStudentForClickDrop(null);
  }, [setSeatingAssignments]);

  const clearAllSeats = () => {
    if (!window.confirm(T.confirmClearSeatsMessage)) return;
    const newRows = Number(layoutSettings.rows) || 1;
    const newCols = Number(layoutSettings.cols) || 1;
    setSeatingAssignments(Array(newRows).fill(null).map(() => Array(newCols).fill(null)));
    // Reset student list order to default (e.g., by rollNo)
    setStudentsState(prevStudents => [...prevStudents].sort((a,b) => (a.rollNo || '').localeCompare(b.rollNo || '', undefined, {numeric: true})));
    setSelectedStudentForClickDrop(null);
  };

  const autoAssignStudents = (method = 'alphabetical_english') => {
    let allStudentsList = [...students];
    const seatedStudentIds = new Set(seatingAssignments.flat().filter(id => id !== null));
    let assignableStudents = allStudentsList.filter(s => !seatedStudentIds.has(s.id));

    if (assignableStudents.length === 0) {
      toast({ title: T.noEmptySeatsMessage, variant: "default" });
      return;
    }

    if (method === 'alphabetical_english') {
        assignableStudents.sort((a, b) => {
            const nameA = `${a.englishName || ''} ${a.nickname || ''}`.trim();
            const nameB = `${b.englishName || ''} ${b.nickname || ''}`.trim();
            return nameA.localeCompare(nameB);
        });
    } else if (method === 'alphabetical_chinese') {
        assignableStudents.sort((a, b) => (a.chineseName || '').localeCompare(b.chineseName || '', 'zh-Hans-CN-u-co-pinyin'));
    } else if (method === 'roll_no') {
        assignableStudents.sort((a, b) => (a.rollNo || '').toString().localeCompare((b.rollNo || '').toString(), undefined, {numeric: true}));
    } else if (method === 'random') {
        assignableStudents.sort(() => Math.random() - 0.5);
    }

    const newGrid = seatingAssignments.map(row => [...row]);
    let studentIdx = 0;
    // Fill column by column
    for (let c = 0; c < layoutSettings.cols; c++) {
        for (let r = 0; r < layoutSettings.rows; r++) {
            if (studentIdx < assignableStudents.length && newGrid[r]?.[c] === null) {
                newGrid[r][c] = assignableStudents[studentIdx].id;
                reorderStudentToBottomOfList(assignableStudents[studentIdx].id);
                studentIdx++;
            }
        }
    }
    setSeatingAssignments(newGrid);
    setSelectedStudentForClickDrop(null);
  };

  const getStudentById = useCallback((id: string | null): Student | null => {
    if (!id) return null;
    return students.find(s => s.id === id) || null;
  }, [students]);

  const handleImportPastedStudents = async () => {
    if (!studentDataPasted.trim()) {
        toast({ title: T.errorPastingStudents, variant: "destructive" });
        return;
    }
    
    const newStudentsData = parsePastedStudentData(studentDataPasted, teacherInfo.className);

    if (newStudentsData.length === 0) {
        toast({ title: T.errorNoValidStudents, variant: "destructive" });
        return;
    }
    
    setStudents(newStudentsData);
    // After importing, clear all seats and reset student list order
    const newRows = Number(layoutSettings.rows) || 1;
    const newCols = Number(layoutSettings.cols) || 1;
    setSeatingAssignments(Array(newRows).fill(null).map(() => Array(newCols).fill(null)));

    toast({ title: T.importSuccessMessage });
    setSelectedStudentForClickDrop(null);
  };

  const assignStudentToFirstAvailableSeatVertically = (studentToAssign: Student) => {
    if (seatingAssignments.flat().includes(studentToAssign.id)) return; 

    let placed = false;
    const newAssignmentsResult = seatingAssignments.map(row => [...row]); // Work on a mutable copy

    for (let c = 0; c < (layoutSettings.cols || 0); c++) { 
        for (let r = 0; r < (layoutSettings.rows || 0); r++) { 
            if (newAssignmentsResult[r]?.[c] === null) { 
                newAssignmentsResult[r][c] = studentToAssign.id;
                placed = true;
                break;
            }
        }
        if (placed) break;
    }

    if (placed) {
        setSeatingAssignments(newAssignmentsResult);
        reorderStudentToBottomOfList(studentToAssign.id);
    } else {
        toast({ title: T.noEmptySeatsMessage, variant: "default" });
    }
    setSelectedStudentForClickDrop(null); 
  };

  const handleStudentCardClick = (clickedStudent: Student) => {
    if (seatingAssignments.flat().includes(clickedStudent.id)) {
        setSelectedStudentForClickDrop(null);
        return;
    }
    if (selectedStudentForClickDrop && selectedStudentForClickDrop.id === clickedStudent.id) {
        assignStudentToFirstAvailableSeatVertically(clickedStudent);
    } else {
        setSelectedStudentForClickDrop(clickedStudent);
    }
  };

  const handleSeatClick = (rowIndex: number, colIndex: number) => {
    if (selectedStudentForClickDrop && !seatingAssignments[rowIndex]?.[colIndex]) {
        const studentToPlace = selectedStudentForClickDrop;
        
        const newAssignments = seatingAssignments.map(r => [...r]);
        // Remove student from any previous seat if they were somehow there (should not happen if logic is correct)
        for (let r = 0; r < newAssignments.length; r++) {
            for (let c = 0; c < newAssignments[r].length; c++) {
                if (newAssignments[r][c] === studentToPlace.id) {
                    newAssignments[r][c] = null;
                }
            }
        }
        newAssignments[rowIndex][colIndex] = studentToPlace.id;
        setSeatingAssignments(newAssignments);

        reorderStudentToBottomOfList(studentToPlace.id);
        setSelectedStudentForClickDrop(null);
    } else if (selectedStudentForClickDrop && seatingAssignments[rowIndex]?.[colIndex]) {
        // Clicked an occupied seat while a student is selected, deselect the student
        setSelectedStudentForClickDrop(null);
    }
  };

  const filteredStudents = students.filter(s =>
    (s.englishName && s.englishName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.nickname && s.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.chineseName && s.chineseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.rollNo && s.rollNo.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGetAiSuggestion = async () => {
    setIsAiSuggestionLoading(true);
    setAiReasoning('');
    try {
      const aiInput: SuggestSeatingArrangementsInput = {
        students: students.map(s => ({ // Map to AI flow's StudentSchema
          id: s.id,
          englishName: s.englishName,
          nickname: s.nickname,
          chineseName: s.chineseName,
          rollNo: s.rollNo,
          studentClass: s.studentClass,
          role: s.role,
          performance: s.performance,
          behavior: s.behavior,
        })),
        criteria: aiCriteria,
        rows: layoutSettings.rows,
        cols: layoutSettings.cols,
      };
      const result = await suggestSeatingArrangements(aiInput);
      if (result.arrangement && result.arrangement.length > 0) {
        // Ensure the AI arrangement matches current dimensions, or pad/truncate.
        const newGrid = Array(layoutSettings.rows).fill(null).map((_, r) =>
          Array(layoutSettings.cols).fill(null).map((__, c) =>
            result.arrangement[r]?.[c] || null
          )
        );
        setSeatingAssignments(newGrid);
        setAiReasoning(result.reasoning);
        toast({ title: "AI suggestion applied!" });
      } else {
        toast({ title: "AI returned an empty arrangement.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast({ title: T.aiError, description: String(error), variant: "destructive" });
      setAiReasoning(`Error: ${String(error)}`);
    } finally {
      setIsAiSuggestionLoading(false);
    }
  };


  return {
    students,
    setStudents,
    teacherInfo,
    setTeacherInfo: setTeacherInfoState,
    handleTeacherInfoChange,
    layoutSettings,
    setLayoutSettings: setLayoutSettingsState,
    handleLayoutSettingsChange,
    seatingAssignments,
    setSeatingAssignments,
    studentDataPasted,
    setStudentDataPasted,
    searchTerm,
    setSearchTerm,
    isLoading,
    setIsLoading,
    selectedStudentForClickDrop,
    setSelectedStudentForClickDrop,
    onDropStudentToSeat,
    onRemoveStudentFromSeat,
    clearAllSeats,
    autoAssignStudents,
    getStudentById,
    handleImportPastedStudents,
    assignStudentToFirstAvailableSeatVertically,
    handleStudentCardClick,
    handleSeatClick,
    filteredStudents,
    T, // Translated strings
    // AI Suggestion related
    aiCriteria,
    setAiCriteria,
    aiReasoning,
    isAiSuggestionLoading,
    handleGetAiSuggestion,
    // Undo/Redo
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
