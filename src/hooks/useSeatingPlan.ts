"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Student, TeacherInfo, LayoutSettings, SeatingAssignment, AppLanguage } from '@/lib/types';
import { getTranslatedStrings } from '@/lib/i18n';
import { generatePresetStudentObjects, parsePastedStudentData, formatStudentObjectsToPastedString } from '@/lib/studentUtils';
// Removed AI flow import: import { suggestSeatingArrangements, type SuggestSeatingArrangementsInput } from '@/ai/flows/suggest-seating-arrangements';
import { useToast } from '@/hooks/use-toast';

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

  // Removed AI Suggestion State
  // Removed History State

  const setStudents = (newStudents: Student[] | ((prev: Student[]) => Student[])) => {
    setStudentsState(prevStudents => {
      const updatedStudents = typeof newStudents === 'function' ? newStudents(prevStudents) : newStudents;
      return updatedStudents;
    });
  };
  
  const setSeatingAssignments = (newAssignments: SeatingAssignment | ((prev: SeatingAssignment) => SeatingAssignment)) => {
    setSeatingAssignmentsState(prevAssignments => {
      const updatedAssignments = typeof newAssignments === 'function' ? newAssignments(prevAssignments) : newAssignments;
      return updatedAssignments;
    });
  };

  // Initialize app state
  useEffect(() => {
    setIsLoading(true);
    const currentClassName = teacherInfo.className || initialTeacherInfoDefault.className;
    const presetStudents = generatePresetStudentObjects(currentClassName);
    setStudentsState(presetStudents);
    setStudentDataPasted(formatStudentObjectsToPastedString(presetStudents));
    
    setLayoutSettingsState(prev => ({...prev, title: T.planTitleLabel || initialLayoutSettingsDefault.title}));

    const initialRows = layoutSettings.rows > 0 ? layoutSettings.rows : initialLayoutSettingsDefault.rows;
    const initialCols = layoutSettings.cols > 0 ? layoutSettings.cols : initialLayoutSettingsDefault.cols;
    const initialGrid = Array(initialRows).fill(null).map(() => Array(initialCols).fill(null));
    setSeatingAssignmentsState(initialGrid);
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
        return newGrid; 
    });
  }, [layoutSettings.rows, layoutSettings.cols]);


  const handleTeacherInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTeacherInfoState({ ...teacherInfo, [e.target.name]: e.target.value });
  };

  const handleLayoutSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: string }>) => {
    const { name, value } = 'target' in e ? e.target : e; 
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
        const studentInTargetCellId = newGrid[targetRow]?.[targetCol]; 

        if (originalRow !== undefined && originalCol !== undefined) { 
            newGrid[originalRow][originalCol] = null;
        } else { 
            for (let r = 0; r < newGrid.length; r++) {
                for (let c = 0; c < newGrid[r].length; c++) {
                    if (newGrid[r][c] === draggedStudent.id) {
                        newGrid[r][c] = null;
                    }
                }
            }
        }
        
        newGrid[targetRow][targetCol] = draggedStudent.id;

        if (studentInTargetCellId && originalRow !== undefined && originalCol !== undefined) {
            if (originalRow !== targetRow || originalCol !== targetCol) { 
                 newGrid[originalRow][originalCol] = studentInTargetCellId; 
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
                        break; 
                    }
                }
                 if (newAssignments.flat().indexOf(actualStudentIdToRemove) === -1) break;
            }
        }
        
        if(actualStudentIdToRemove){
            setStudentsState(prevStudents => {
                const studentIndex = prevStudents.findIndex(s => s.id === actualStudentIdToRemove);
                if (studentIndex === -1) return prevStudents; 
                
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
    const newRows = Number(layoutSettings.rows) || 1;
    const newCols = Number(layoutSettings.cols) || 1;
    setSeatingAssignments(Array(newRows).fill(null).map(() => Array(newCols).fill(null)));

    toast({ title: T.importSuccessMessage });
    setSelectedStudentForClickDrop(null);
  };

  const assignStudentToFirstAvailableSeatVertically = (studentToAssign: Student) => {
    if (seatingAssignments.flat().includes(studentToAssign.id)) return; 

    let placed = false;
    const newAssignmentsResult = seatingAssignments.map(row => [...row]); 

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
        setSelectedStudentForClickDrop(null);
    }
  };

  const filteredStudents = students.filter(s =>
    (s.englishName && s.englishName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.nickname && s.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.chineseName && s.chineseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.rollNo && s.rollNo.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
  };
};
