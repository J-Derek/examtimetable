import { useState, useEffect } from 'react';
import { Exam } from '@/types/exam';
import { toast } from 'sonner';

export function useCookedExams() {
    const [cookedExams, setCookedExams] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('cooked-exams');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setCookedExams(parsed);
                } else {
                    setCookedExams([]);
                }
            }
        } catch (e) {
            console.error(e);
            setCookedExams([]);
        }
    }, []);

    const toggleCooked = (exam: Exam) => {
        const examId = `${exam.courseCode}-${exam.date}-${exam.time}`;
        setCookedExams(prev => {
            const newCooked = prev.includes(examId)
                ? prev.filter(id => id !== examId)
                : [...prev, examId];

            localStorage.setItem('cooked-exams', JSON.stringify(newCooked));

            if (!prev.includes(examId)) {
                toast.success("Exam marked as Cooked! 🔥", {
                    description: "Great job completing your exam!",
                    duration: 3000,
                });
            }

            return newCooked;
        });
    };

    const isCooked = (exam: Exam) => {
        const examId = `${exam.courseCode}-${exam.date}-${exam.time}`;
        return cookedExams.includes(examId);
    };

    const resetCooked = () => {
        setCookedExams([]);
        localStorage.removeItem('cooked-exams');
    };

    return { cookedExams, toggleCooked, isCooked, resetCooked };
}
