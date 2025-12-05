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

export function useFilteredExams(exams: Exam[], searchQuery: string) {
  const filteredExams = useMemo(() => {
    if (!searchQuery.trim()) return exams;

    const terms = searchQuery.toLowerCase().split(/[,\n|]+/).map(t => t.trim()).filter(Boolean);

    return exams.filter(exam => {
      return terms.some(term =>
        exam.courseCode.toLowerCase().includes(term) ||
        exam.venue.toLowerCase().includes(term) ||
        exam.date.toLowerCase().includes(term) ||
        (exam.campus && exam.campus.toLowerCase().includes(term))
      );
    });
  }, [exams, searchQuery]);

  return filteredExams;
}

export function useGroupedExams(exams: Exam[]): GroupedExams[] {
  return useMemo(() => {
    const grouped = exams.reduce((acc, exam) => {
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
