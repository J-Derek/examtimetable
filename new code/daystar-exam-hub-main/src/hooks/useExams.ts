import { useState, useEffect, useMemo } from 'react';
import { Exam, GroupedExams } from '@/types/exam';
import { sortByDate, formatExamDate, getDayOfWeek } from '@/lib/dateUtils';

const API_URL = '/exam_data.json';

// Mock data for development/demo
const MOCK_DATA: Exam[] = [
  { courseCode: "MAT120A", venue: "LR12", date: "MONDAY 08/12/25", time: "2:00PM-4:00PM", campus: "ATHI RIVER" },
  { courseCode: "CCS101", venue: "LR8", date: "MONDAY 08/12/25", time: "8:00AM-10:00AM", campus: "ATHI RIVER" },
  { courseCode: "PHY110", venue: "SCI LAB 2", date: "MONDAY 08/12/25", time: "11:00AM-1:00PM", campus: "ATHI RIVER" },
  { courseCode: "ENG101", venue: "LR15", date: "TUESDAY 09/12/25", time: "8:00AM-10:00AM", campus: "ATHI RIVER" },
  { courseCode: "BIO120", venue: "BIO LAB 1", date: "TUESDAY 09/12/25", time: "2:00PM-4:00PM", campus: "NAIROBI" },
  { courseCode: "CHE100", venue: "CHEM LAB", date: "WEDNESDAY 10/12/25", time: "8:00AM-10:00AM", campus: "ATHI RIVER" },
  { courseCode: "ICT200", venue: "COMP LAB 3", date: "WEDNESDAY 10/12/25", time: "11:00AM-1:00PM", campus: "NAIROBI" },
  { courseCode: "COM150", venue: "LR20", date: "THURSDAY 11/12/25", time: "2:00PM-4:00PM", campus: "ATHI RIVER" },
  { courseCode: "PSY101", venue: "LR5", date: "FRIDAY 12/12/25", time: "8:00AM-10:00AM", campus: "NAIROBI" },
  { courseCode: "SOC110", venue: "LR7", date: "FRIDAY 12/12/25", time: "11:00AM-1:00PM", campus: "ATHI RIVER" },
];

export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true);
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch timetable');
        }

        const data = await response.json();
        setExams(data);
        setError(null);
      } catch (err) {
        console.log('Using mock data (API unavailable)');
        // Use mock data if API fails
        setExams(MOCK_DATA);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  return { exams, loading, error };
}

export const useFilteredExams = (
  exams: Exam[] | undefined,
  favorites: Exam[] | undefined,
  searchQuery: string
) => {
  const sourceExams = favorites || exams || [];

  return useMemo(() => {
    // Safety check: ensure sourceExams is iterable
    if (!Array.isArray(sourceExams)) return [];

    if (!searchQuery.trim()) return sourceExams;

    // Split query by commas, spaces, or pipes to support multiple units
    const terms = searchQuery
      .toLowerCase()
      .split(/[\s,|+\n]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (terms.length === 0) return sourceExams;

    return sourceExams.filter((exam) => {
      // Safety: Skip null/undefined exams
      if (!exam) return false;

      // Simple, safe string concatenation and checking
      const examString = (
        (exam.courseCode || '') + ' ' +
        (exam.venue || '') + ' ' +
        (exam.date || '') + ' ' +
        (exam.campus || '')
      ).toLowerCase();

      // Match if ANY term is found in the exam string (OR logic)
      return terms.some(term => examString.includes(term));
    });
  }, [sourceExams, searchQuery]);
};

export function useGroupedExams(exams: Exam[]): GroupedExams[] {
  return useMemo(() => {
    // Safety check
    if (!Array.isArray(exams)) return [];

    const grouped = exams.reduce((acc, exam) => {
      if (!exam) return acc;
      const date = exam.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(exam);
      return acc;
    }, {} as Record<string, Exam[]>);

    // Sort dates and create grouped array
    return Object.keys(grouped)
      .sort(sortByDate)
      .map(date => ({
        date,
        formattedDate: `${getDayOfWeek(date)} Exams`,
        exams: grouped[date].sort((a, b) => {
          // Sort by time within each day (convert to 24h for proper sorting)
          const parseTime = (t: string) => {
            const match = t.match(/(\d+):(\d+)(AM|PM)/i);
            if (!match) return 0;
            let hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const isPM = match[3].toUpperCase() === 'PM';
            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
            return hours * 60 + minutes;
          };
          return parseTime(a.time) - parseTime(b.time);
        }),
      }));
  }, [exams]);
}
