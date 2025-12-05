import { useState, useEffect, useCallback } from 'react';
import { Exam } from '@/types/exam';

const STORAGE_KEY = 'daystar-pinned-exams';

function getExamId(exam: Exam): string {
  return `${exam.courseCode}-${exam.date}-${exam.time}`;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Exam[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        } else {
          console.error('Invalid favorites data found, resetting.');
          setFavorites([]);
        }
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Save to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: Exam[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, []);

  const toggleFavorite = useCallback((exam: Exam) => {
    const examId = getExamId(exam);
    const exists = favorites.some(f => getExamId(f) === examId);

    if (exists) {
      saveFavorites(favorites.filter(f => getExamId(f) !== examId));
    } else {
      saveFavorites([...favorites, exam]);
    }
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((exam: Exam): boolean => {
    return favorites.some(f => getExamId(f) === getExamId(exam));
  }, [favorites]);

  const addMultipleFavorites = useCallback((newExams: Exam[]) => {
    // Filter out exams that are already favorites to avoid duplicates
    const uniqueNewExams = newExams.filter(exam =>
      !favorites.some(f => getExamId(f) === getExamId(exam))
    );

    if (uniqueNewExams.length > 0) {
      saveFavorites([...favorites, ...uniqueNewExams]);
    }
  }, [favorites, saveFavorites]);

  return { favorites, toggleFavorite, isFavorite, addMultipleFavorites };
}
