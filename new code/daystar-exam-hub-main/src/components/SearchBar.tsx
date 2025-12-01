import { Search, X } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount: number;
  totalCount: number;
}

export function SearchBar({ value, onChange, resultsCount, totalCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus search on mount for better UX
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for exams (e.g., MAT120A, ENG111B)..."
          className="w-full pl-12 pr-12 py-4 bg-card text-foreground placeholder:text-muted-foreground rounded-2xl border border-border shadow-card focus:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 text-base"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="mt-3 text-center">
        <p className="text-sm text-muted-foreground">
          {value ? (
            <>
              Showing <span className="font-medium text-foreground">{resultsCount}</span> of {totalCount} exams
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">{totalCount}</span> exams available
            </>
          )}
        </p>
      </div>
    </div>
  );
}
