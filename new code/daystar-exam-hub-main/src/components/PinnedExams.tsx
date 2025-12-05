import { Exam } from '@/types/exam';
import { ExamTable } from './ExamTable';
import { Star, AlertTriangle } from 'lucide-react';
import { useConflicts } from '@/hooks/useConflicts';

interface PinnedExamsProps {
  favorites: Exam[];
  onToggleFavorite: (exam: Exam) => void;
  isFavorite: (exam: Exam) => boolean;
  isCooked: (exam: Exam) => boolean;
  onToggleCooked: (exam: Exam) => void;
}

export function PinnedExams({ favorites, onToggleFavorite, isFavorite, isCooked, onToggleCooked }: PinnedExamsProps) {
  // Only check conflicts within the pinned exams themselves
  const { hard: hardConflicts, soft: softConflicts } = useConflicts([], favorites);
  const hasConflicts = hardConflicts.size > 0;
  const hasSoftConflicts = softConflicts.size > 0;

  if (favorites.length === 0) {
    return null;
  }

  return (
    <section className="px-4 max-w-5xl mx-auto mb-8 animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-warning/20">
            <Star className="h-5 w-5 text-warning fill-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              My Units
            </h2>
            <p className="text-sm text-muted-foreground">
              {favorites.length} unit{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>

        {hasConflicts && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-sm font-medium animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <span>Conflicts Detected!</span>
          </div>
        )}

        {!hasConflicts && hasSoftConflicts && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 text-warning-foreground rounded-lg text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>Check for section overlaps</span>
          </div>
        )}
      </div>

      <ExamTable
        exams={favorites}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
        conflicts={hardConflicts}
        isCooked={isCooked}
        onToggleCooked={onToggleCooked}
      />
    </section>
  );
}
