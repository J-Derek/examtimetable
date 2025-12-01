import { Search, Calendar } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
        {searchQuery ? (
          <Search className="h-10 w-10 text-primary/60" />
        ) : (
          <Calendar className="h-10 w-10 text-primary/60" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {searchQuery ? 'No exams found' : 'No exams available'}
      </h3>
      
      <p className="text-muted-foreground max-w-sm">
        {searchQuery ? (
          <>
            We couldn't find any exams matching "<span className="font-medium text-foreground">{searchQuery}</span>". 
            Try a different course code or venue.
          </>
        ) : (
          'The exam timetable is currently empty. Please check back later.'
        )}
      </p>
    </div>
  );
}
