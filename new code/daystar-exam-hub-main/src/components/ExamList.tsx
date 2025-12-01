import { ExamCard } from './ExamCard';
import { EmptyState } from './EmptyState';
import { SkeletonGroup } from './SkeletonCard';
import { GroupedExams, Exam } from '@/types/exam';
import { useConflicts } from '@/hooks/useConflicts';
import { Star, Info, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExamListProps {
  groupedExams: GroupedExams[];
  loading: boolean;
  searchQuery: string;
  onToggleFavorite: (exam: Exam) => void;
  onPinMultiple: (exams: Exam[]) => void;
  isFavorite: (exam: Exam) => boolean;
}

export function ExamList({ groupedExams, loading, searchQuery, onToggleFavorite, onPinMultiple, isFavorite, favorites = [] }: ExamListProps & { favorites?: Exam[] }) {
  // Flatten exams for the table view
  const allExams = groupedExams.flatMap(group => group.exams);
  // Check conflicts: Search Results vs Pinned Exams (and Pinned vs Pinned)
  const { hard: hardConflicts, soft: softConflicts } = useConflicts(allExams, favorites);

  const hasSimilarConflicts = softConflicts.size > 0;

  const handlePinAll = () => {
    const unpinnedExams = allExams.filter(exam => !isFavorite(exam));

    if (unpinnedExams.length > 0) {
      onPinMultiple(unpinnedExams);
      toast({
        title: "Pinned All Results",
        description: `Successfully pinned ${unpinnedExams.length} exams to your favorites.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 px-4 max-w-4xl mx-auto">
        <SkeletonGroup />
        <SkeletonGroup />
      </div>
    );
  }

  if (groupedExams.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="bg-white/50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {searchQuery ? 'No exams found' : 'No exams to display'}
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {searchQuery
            ? `We couldn't find any exams matching "${searchQuery}". Try searching for a course code like "MAT120".`
            : "Use the search bar above to find your exams."}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-5xl mx-auto pb-8 animate-slide-up">
      {/* Actions & Tips Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Search Results
            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {allExams.length} found
            </span>
          </h2>
          {hasSimilarConflicts && (
            <div className="flex items-center gap-2 text-xs text-warning-foreground bg-warning/10 px-3 py-2 rounded-lg border border-warning/20">
              <Info className="w-4 h-4 shrink-0" />
              <p>
                <strong>Multiple sections detected.</strong> Please try to narrow down the search by including which section you belong to.
              </p>
            </div>
          )}
          {!hasSimilarConflicts && searchQuery && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Tip: Be specific (e.g., "ACS111A" vs "ACS111") to avoid mixing classes.
            </p>
          )}
        </div>

        {searchQuery && allExams.length > 0 && (
          <button
            onClick={handlePinAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
          >
            <Star className="w-4 h-4 fill-current" />
            Pin All Results
          </button>
        )}
      </div>

      <div className="grid gap-4 animate-slide-up">
        {allExams.map((exam, index) => {
          const conflictList = hardConflicts.get(exam.courseCode)
            ? Array.from(hardConflicts.get(exam.courseCode)!)
            : undefined;
          const isSoft = softConflicts.has(exam.courseCode);

          return (
            <div
              key={`${exam.courseCode}-${exam.date}-${exam.time}-${index}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }} // Stagger animation
            >
              <ExamCard
                exam={exam}
                isFavorite={isFavorite(exam)}
                onToggleFavorite={onToggleFavorite}
                conflict={conflictList}
                isSoftConflict={isSoft}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
