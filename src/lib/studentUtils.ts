
import type { Student } from './types';

// Preset student data strings
const presetStudentDataStrings = [
    "陳大文 Chan Tai Man, Sam, Monitor, High, Leader", 
    "李小芳 Lee Siu Fong, Jenny, Class Representative, Medium, Cooperative", 
    "黃志強 Wong Chi Keung, Alex, Sports Captain, Medium, Active",
    "吳麗珍 Ng Lai Chun, Angela, Librarian, High, Quiet", 
    "張國榮 Cheung Kwok Wing, Leslie, Music Club President, Medium, Creative", 
    "周嘉儀 Chow Ka Yee, Mandy, Vice Monitor, High, Responsible",
    "林志明 Lam Chi Ming, Jason, Debate Team Leader, High, Articulate", 
    "馬嘉豪 Ma Ka Ho, Kelvin, IT Prefect, Medium, Tech-savvy", 
    "鄭淑儀 Cheng Suk Yee, Fiona, Art Club Head, Medium, Artistic",
    "何建東 Ho Kin Tung, Michael, Scout Leader, Medium, Disciplined", 
    "劉美娟 Lau Mei Kuen, Karen, Environmental Ambassador, Medium, Passionate", 
    "楊子聰 Yeung Tsz Chung, Eric, Chess Club President, High, Strategic",
    "蔡麗雯 Choi Lai Man, Cindy, English Ambassador, Medium, Communicative", 
    "梁卓霖 Leung Cheuk Lam, Brian, Class Treasurer, Medium, Organized", 
    "謝偉倫 Tse Wai Lun, Henry, Discipline Prefect, Low, Needs Focus",
    "袁嘉敏 Yuen Ka Man, Nicole, Music Club Vice-President, Medium, Musical", 
    "曾志豪 Tsang Chi Ho, Peter, STEM Team Leader, High, Analytical", 
    "高靜雯 Ko Ching Man, Chloe, Head Girl, High, Leader",
    "方子軒 Fong Tsz Hin, Leo, Head Boy, High, Charismatic", 
    "胡慧婷 Wu Wai Ting, Emily, Red Cross Member, Medium, Helpful", 
    "鄧家俊 Tang Ka Chun, Ivan, Photography Club Member, Medium, Observant",
    "鍾麗莎 Chung Lai Sa, Lisa, Charity Committee Member, Medium, Kind", 
    "莫嘉豪 Mok Ka Ho, Derek, AV Crew, Low, Distracted", 
    "李寶兒 Lee Po Yi, Bella, Drama Club President, Medium, Expressive",
    "許志強 Hui Chi Keung, Marcus, Football Team Captain, Medium, Energetic", 
    "陸穎欣 Luk Wing Yan, Natalie, Library Assistant, High, Studious", 
    "方子健 Fong Tsz Kin, Thomas, Math Team Leader, High, Logical",
    "陳詠詩 Chan Wing Sze, Vivian, Chinese Debate Team, Medium, Eloquent", 
    "黃子倫 Wong Tsz Lun, Adrian, Science Prefect, High, Inquisitive", 
    "吳嘉怡 Ng Ka Yi, Michelle, Visual Arts Representative, Medium, Creative",
    "梁俊傑 Leung Chun Kit, Tony, Prefect, Medium, Dutiful", 
    "何靜儀 Ho Ching Yee, Queenie, Peer Mentor, High, Supportive", 
    "馮子謙 Fung Tsz Him, Andrew, Volunteer Team Leader, Medium, Proactive",
    "鄧麗文 Tang Lai Man, Sharon, House Captain (Blue House), Medium, Spirited", 
    "曾家寶 Tsang Ka Bo, Ricky, House Captain (Red House), Low, Playful", 
    "陳穎琳 Chan Wing Lam, Ivy, House Captain (Green House), Medium, Fair",
    "羅俊宇 Law Chun Yu, Gabriel, House Captain (Yellow House), High, Competitive", 
    "朱凱琳 Chu Hoi Lam, Janice, Choir Member, Medium, Harmonious", 
    "馬子豪 Ma Tsz Ho, Calvin, Table Tennis Team, Medium, Agile",
    "梁芷晴 Leung Tsz Ching, Mandy, Student Council Secretary, High, Diligent"
];

export const generatePresetStudentObjects = (className = 'Class 5A'): Student[] => {
    return presetStudentDataStrings.map((line, index) => {
        const parts = line.split(',').map(s => s.trim());
        const nameSection = parts[0] || '';
        let nickname = parts.length > 1 ? parts[1] : ''; // Changed const to let
        const roleOrChineseName = parts.length > 2 ? parts[2] : ''; // This could be role or Chinese name based on original logic ambiguity
        const classNoOrRole = parts.length > 3 ? parts[3] : (index + 1).toString().padStart(2, '0');
        const roleOrPerformance = parts.length > 4 ? parts[4] : '';
        const performanceOrBehavior = parts.length > 5 ? parts[5] : '';
        const behavior = parts.length > 6 ? parts[6] : '';


        let chineseName = '';
        let englishFullName = '';
        let studentRole = '';
        let studentPerformance: Student['performance'] = undefined;
        let studentBehavior = '';
        let studentRollNo = (index + 1).toString().padStart(2, '0');


        const nameMatch = nameSection.match(/^([\u4e00-\u9fa5]+)\s*(.*)$/);
        if (nameMatch) {
            chineseName = nameMatch[1].trim();
            englishFullName = nameMatch[2].trim();
        } else {
            englishFullName = nameSection.trim();
        }

        // Heuristic to assign parts based on common patterns in example
        // This parsing is complex due to ambiguous format.
        // Assuming format: Eng Name, Nickname, Chi Name, (RollNo), Role, Performance, Behavior
        if (parts.length === 7) {
            // Eng, Nick, Chi, (Roll), Role, Perf, Behav
            englishFullName = parts[0];
            nickname = parts[1];
            chineseName = parts[2];
            studentRollNo = parts[3].replace(/[()]/g, '');
            studentRole = parts[4];
            studentPerformance = parts[5] as Student['performance'];
            studentBehavior = parts[6];
        } else if (parts.length === 6) {
            // Eng, Nick, Chi, (Roll), Role, Perf (missing behavior) OR Eng, Chi, (Roll), Role, Perf, Behav (missing nickname)
            // Prioritize with nickname
            if (parts[1].length < 10 && !(/[\u4e00-\u9fa5]/.test(parts[1]))) { // Likely nickname
                englishFullName = parts[0];
                nickname = parts[1];
                chineseName = parts[2];
                studentRollNo = parts[3].replace(/[()]/g, '');
                studentRole = parts[4];
                studentPerformance = parts[5] as Student['performance'];
            } else { // Likely no nickname
                englishFullName = parts[0];
                chineseName = parts[1];
                studentRollNo = parts[2].replace(/[()]/g, '');
                studentRole = parts[3];
                studentPerformance = parts[4] as Student['performance'];
                studentBehavior = parts[5];
            }
        } else if (parts.length === 5) { // Eng, Nick, Chi, (Roll), Role (from original example)
             englishFullName = parts[0];
             nickname = parts[1];
             chineseName = roleOrChineseName; // parts[2]
             studentRollNo = classNoOrRole.replace(/[()]/g, ''); // parts[3]
             studentRole = roleOrPerformance; // parts[4]
        } else if (parts.length === 4) { // Eng, Chi, (Roll), Role
            englishFullName = parts[0];
            chineseName = parts[1]; // nickname was parts[1] here
            studentRollNo = parts[2].replace(/[()]/g, '');
            studentRole = parts[3];
        } else if (parts.length === 3) { // Eng, Chi, (Roll)
            englishFullName = parts[0];
            chineseName = parts[1];
            studentRollNo = parts[2].replace(/[()]/g, '');
        }
        // Fallback for fewer parts
        else {
            studentRole = roleOrChineseName; // Default if fewer parts
        }


        return {
            id: crypto.randomUUID(), 
            englishName: englishFullName.trim(), 
            nickname: nickname.trim(),
            chineseName: chineseName.trim(),
            rollNo: studentRollNo.trim(),
            studentClass: className,
            role: studentRole.trim(),
            performance: studentPerformance as Student['performance'] || undefined,
            behavior: studentBehavior.trim() || undefined,
        };
    });
};


export const formatStudentObjectsToPastedString = (studentObjects: Student[]): string => {
    return studentObjects.map(student => {
        let line = student.englishName || '';
        if (student.nickname) line += `, ${student.nickname}`;
        line += `, ${student.chineseName || ''}`;
        line += `, (${student.rollNo || ''})`; 
        if (student.role) line += `, ${student.role}`;
        if (student.performance) line += `, ${student.performance}`;
        if (student.behavior) line += `, ${student.behavior}`;
        return line;
    }).join('\n');
};

export const parsePastedStudentData = (pastedData: string, className: string): Student[] => {
    const lines = pastedData.trim().split('\n');
    return lines.map((line, index) => {
        const parts = line.split(',').map(s => s.trim());
        
        let englishName = '';
        let nickname = '';
        let chineseName = '';
        let rollNo = (index + 1).toString().padStart(2, '0'); 
        let role = '';
        let performance: Student['performance'] = undefined;
        let behavior = '';

        // This parsing logic needs to be robust for various inputs.
        // Based on placeholder: Eng, Nick, Chi, (Roll), Role, Perf, Behav
        if (parts.length > 0) englishName = parts[0];
        if (parts.length > 1) nickname = parts[1];
        if (parts.length > 2) chineseName = parts[2];
        if (parts.length > 3) {
            const rollMatch = parts[3].match(/\(([^)]+)\)/);
            if (rollMatch) rollNo = rollMatch[1]; else rollNo = parts[3] || rollNo;
        }
        if (parts.length > 4) role = parts[4];
        if (parts.length > 5) performance = parts[5] as Student['performance'];
        if (parts.length > 6) behavior = parts[6];

        // A simple heuristic if nickname is missing but other fields are present
        if (parts.length === 6 && /[\u4e00-\u9fa5]/.test(parts[1])) { // Eng, Chi, (Roll), Role, Perf, Behav
            nickname = '';
            chineseName = parts[1];
            const rollMatch = parts[2].match(/\(([^)]+)\)/);
            if (rollMatch) rollNo = rollMatch[1]; else rollNo = parts[2] || rollNo;
            role = parts[3];
            performance = parts[4] as Student['performance'];
            behavior = parts[5];
        } else if (parts.length === 5 && /[\u4e00-\u9fa5]/.test(parts[1])) { // Eng, Chi, (Roll), Role, Perf
             nickname = '';
             chineseName = parts[1];
             const rollMatch = parts[2].match(/\(([^)]+)\)/);
             if (rollMatch) rollNo = rollMatch[1]; else rollNo = parts[2] || rollNo;
             role = parts[3];
             performance = parts[4]as Student['performance'];
        }


        if (!englishName && !chineseName) return null;

        return {
            id: crypto.randomUUID(), 
            englishName: englishName.trim(),
            nickname: nickname.trim(),
            chineseName: chineseName.trim(),
            rollNo: rollNo.trim().replace(/[()]/g, ''), 
            studentClass: className,
            role: role.trim(),
            performance: performance || undefined,
            behavior: behavior.trim() || undefined,
        };
    }).filter(s => s !== null) as Student[]; 
};

