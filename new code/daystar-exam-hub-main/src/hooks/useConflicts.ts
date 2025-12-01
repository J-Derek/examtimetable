import { useMemo } from 'react';
import { Exam } from '@/types/exam';

export function useConflicts(searchExams: Exam[], pinnedExams: Exam[]) {
    return useMemo(() => {
        const hard = new Map<string, Set<string>>();
        const soft = new Set<string>();

        // 1. Check conflicts WITHIN pinned exams (Critical)
        // Group pinned by date
        const pinnedByDate: Record<string, Exam[]> = {};
        pinnedExams.forEach(exam => {
            if (!pinnedByDate[exam.date]) pinnedByDate[exam.date] = [];
            pinnedByDate[exam.date].push(exam);
        });

        // Check pinned vs pinned
        Object.values(pinnedByDate).forEach(dayExams => {
            for (let i = 0; i < dayExams.length; i++) {
                for (let j = i + 1; j < dayExams.length; j++) {
                    checkConflict(dayExams[i], dayExams[j], hard, soft);
                }
            }
        });

        // 2. Check search results AGAINST pinned exams (Advisory)
        // We do NOT check search vs search (too slow and confusing)
        if (pinnedExams.length > 0) {
            searchExams.forEach(searchExam => {
                // Only check if we have pinned exams on this date
                const dayPinned = pinnedByDate[searchExam.date];
                if (dayPinned) {
                    dayPinned.forEach(pinnedExam => {
                        checkConflict(searchExam, pinnedExam, hard, soft);
                    });
                }
            });
        }

        return { hard, soft };
    }, [searchExams, pinnedExams]);
}

function checkConflict(examA: Exam, examB: Exam, hard: Map<string, Set<string>>, soft: Set<string>) {
    // Ignore if it's the same course (normalize to handle spacing differences)
    const codeA = examA.courseCode.replace(/\s+/g, '').toUpperCase();
    const codeB = examB.courseCode.replace(/\s+/g, '').toUpperCase();

    if (codeA === codeB) return;

    if (doTimesOverlap(examA.time, examB.time)) {
        // Check if codes are similar (differ only by last character)
        const isSimilar = codeA.slice(0, -1) === codeB.slice(0, -1);

        if (isSimilar) {
            soft.add(examA.courseCode);
            soft.add(examB.courseCode);
        } else {
            // Add to hard conflicts map
            if (!hard.has(examA.courseCode)) hard.set(examA.courseCode, new Set());
            if (!hard.has(examB.courseCode)) hard.set(examB.courseCode, new Set());

            hard.get(examA.courseCode)?.add(examB.courseCode);
            hard.get(examB.courseCode)?.add(examA.courseCode);
        }
    }
}

function doTimesOverlap(timeA: string, timeB: string): boolean {
    // Parse "2:00PM-4:00PM" -> [14*60, 16*60]
    const rangeA = parseTimeRange(timeA);
    const rangeB = parseTimeRange(timeB);

    if (!rangeA || !rangeB) return false;

    return rangeA.start < rangeB.end && rangeA.end > rangeB.start;
}

function parseTimeRange(timeStr: string): { start: number; end: number } | null {
    try {
        const parts = timeStr.split('-');
        if (parts.length < 2) return null;

        const start = parseMinutes(parts[0]);
        const end = parseMinutes(parts[1]);

        return { start, end };
    } catch (e) {
        return null;
    }
}

function parseMinutes(time: string): number {
    const match = time.match(/(\d+):(\d+)(AM|PM)/i);
    if (!match) return 0;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const isPM = match[3].toUpperCase() === 'PM';

    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return hours * 60 + minutes;
}
