
import type { Student } from './types';

// Preset student data strings, simplified without performance/behavior
const presetStudentDataStrings = [
    "陳大文 Chan Tai Man, Sam, Monitor", 
    "李小芳 Lee Siu Fong, Jenny, Class Representative", 
    "黃志強 Wong Chi Keung, Alex, Sports Captain",
    "吳麗珍 Ng Lai Chun, Angela, Librarian", 
    "張國榮 Cheung Kwok Wing, Leslie, Music Club President", 
    "周嘉儀 Chow Ka Yee, Mandy, Vice Monitor",
    "林志明 Lam Chi Ming, Jason, Debate Team Leader", 
    "馬嘉豪 Ma Ka Ho, Kelvin, IT Prefect", 
    "鄭淑儀 Cheng Suk Yee, Fiona, Art Club Head",
    "何建東 Ho Kin Tung, Michael, Scout Leader", 
    "劉美娟 Lau Mei Kuen, Karen, Environmental Ambassador", 
    "楊子聰 Yeung Tsz Chung, Eric, Chess Club President",
    "蔡麗雯 Choi Lai Man, Cindy, English Ambassador", 
    "梁卓霖 Leung Cheuk Lam, Brian, Class Treasurer", 
    "謝偉倫 Tse Wai Lun, Henry, Discipline Prefect",
    "袁嘉敏 Yuen Ka Man, Nicole, Music Club Vice-President", 
    "曾志豪 Tsang Chi Ho, Peter, STEM Team Leader", 
    "高靜雯 Ko Ching Man, Chloe, Head Girl",
    "方子軒 Fong Tsz Hin, Leo, Head Boy", 
    "胡慧婷 Wu Wai Ting, Emily, Red Cross Member", 
    "鄧家俊 Tang Ka Chun, Ivan, Photography Club Member",
    "鍾麗莎 Chung Lai Sa, Lisa, Charity Committee Member", 
    "莫嘉豪 Mok Ka Ho, Derek, AV Crew", 
    "李寶兒 Lee Po Yi, Bella, Drama Club President",
    "許志強 Hui Chi Keung, Marcus, Football Team Captain", 
    "陸穎欣 Luk Wing Yan, Natalie, Library Assistant", 
    "方子健 Fong Tsz Kin, Thomas, Math Team Leader",
    "陳詠詩 Chan Wing Sze, Vivian, Chinese Debate Team", 
    "黃子倫 Wong Tsz Lun, Adrian, Science Prefect", 
    "吳嘉怡 Ng Ka Yi, Michelle, Visual Arts Representative",
    "梁俊傑 Leung Chun Kit, Tony, Prefect", 
    "何靜儀 Ho Ching Yee, Queenie, Peer Mentor", 
    "馮子謙 Fung Tsz Him, Andrew, Volunteer Team Leader",
    "鄧麗文 Tang Lai Man, Sharon, House Captain (Blue House)", 
    "曾家寶 Tsang Ka Bo, Ricky, House Captain (Red House)", 
    "陳穎琳 Chan Wing Lam, Ivy, House Captain (Green House)",
    "羅俊宇 Law Chun Yu, Gabriel, House Captain (Yellow House)", 
    "朱凱琳 Chu Hoi Lam, Janice, Choir Member", 
    "馬子豪 Ma Tsz Ho, Calvin, Table Tennis Team",
    "梁芷晴 Leung Tsz Ching, Mandy, Student Council Secretary"
];

export const generatePresetStudentObjects = (className = 'Class 5A'): Student[] => {
    return presetStudentDataStrings.map((line, index) => {
        const parts = line.split(',').map(s => s.trim());
        
        const nameSection = parts[0] || '';
        const nickname = parts[1] || '';
        const role = parts[2] || '';
        
        let chineseName = '';
        let englishFullName = '';
        
        const nameMatch = nameSection.match(/^([\u4e00-\u9fa5]+)\s*(.*)$/);
        if (nameMatch) {
            chineseName = nameMatch[1].trim();
            englishFullName = nameMatch[2].trim();
        } else {
            englishFullName = nameSection.trim();
        }

        return {
            id: crypto.randomUUID(), 
            englishName: englishFullName,
            nickname: nickname,
            chineseName: chineseName,
            rollNo: (index + 1).toString().padStart(2, '0'),
            studentClass: className,
            role: role,
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

        // Based on placeholder: Eng, Nick, Chi, (Roll), Role
        if (parts.length > 0) englishName = parts[0];
        if (parts.length > 1) nickname = parts[1];
        if (parts.length > 2) chineseName = parts[2];
        if (parts.length > 3) {
            const rollMatch = parts[3].match(/\(([^)]+)\)/);
            if (rollMatch) rollNo = rollMatch[1]; else rollNo = parts[3] || rollNo;
        }
        if (parts.length > 4) role = parts[4];
        
        // A simple heuristic if nickname is missing but other fields are present
        if (parts.length === 4 && /[\u4e00-\u9fa5]/.test(parts[1])) { // Eng, Chi, (Roll), Role
            nickname = '';
            chineseName = parts[1];
            const rollMatch = parts[2].match(/\(([^)]+)\)/);
            if (rollMatch) rollNo = rollMatch[1]; else rollNo = parts[2] || rollNo;
            role = parts[3];
        } else if (parts.length === 3 && /[\u4e00-\u9fa5]/.test(parts[1])) { // Eng, Chi, (Roll)
             nickname = '';
             chineseName = parts[1];
             const rollMatch = parts[2].match(/\(([^)]+)\)/);
             if (rollMatch) rollNo = rollMatch[1]; else rollNo = parts[2] || rollNo;
             role = '';
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
        };
    }).filter(s => s !== null) as Student[]; 
};
