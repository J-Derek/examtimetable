import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { InstallPrompt } from '@/components/InstallPrompt';
import { ScrollToTop } from '@/components/ScrollToTop';
import { SearchBar } from '@/components/SearchBar';
import { ExamList } from '@/components/ExamList';
import { PinnedExams } from '@/components/PinnedExams';
import { DraftBanner } from '@/components/DraftBanner';
import { useExams, useFilteredExams, useGroupedExams } from '@/hooks/useExams';
import { useFavorites } from '@/hooks/useFavorites';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { exams, loading, error } = useExams();
  const { favorites, toggleFavorite, isFavorite, addMultipleFavorites } = useFavorites();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredExams = useFilteredExams(exams, debouncedSearchQuery);

  const displayedExams = showFavoritesOnly
    ? filteredExams.filter(exam => isFavorite(exam))
    : filteredExams;

  const groupedExams = useGroupedExams(displayedExams);

  return (
    <div className="min-h-screen bg-offwhite font-sans text-foreground">
      <Header />
      <OfflineIndicator />
      <InstallPrompt />
      <ScrollToTop />

      {/* Draft Warning Banner */}
      <DraftBanner />

      {/* Hero Section */}
      <Hero />

      {/* Search Section */}
      <section className="mb-8 -mt-4 px-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultsCount={displayedExams.length}
          totalCount={exams.length}
        />

        <div className="flex justify-center mt-4">
          <label className="flex items-center space-x-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="w-4 h-4 text-daystar-blue rounded border-gray-300 focus:ring-daystar-blue"
            />
            <span className="text-sm font-medium text-gray-700">Show My Units Only</span>
          </label>
        </div>
      </section>

      {/* Pinned Exams Section */}
      {!loading && (
        <PinnedExams
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {/* Results Section */}
      <main>
        <ExamList
          groupedExams={groupedExams}
          loading={loading}
          searchQuery={searchQuery}
          onToggleFavorite={toggleFavorite}
          onPinMultiple={addMultipleFavorites}
          isFavorite={isFavorite}
          favorites={favorites}
        />
      </main>

      {/* Footer */}
      <footer className="bg-daystar-navy text-white py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex justify-center">
            {/* ThemeToggle moved to Header */}
          </div>
          <p className="text-sm text-white/70">
            © 2025 Exam Timetable Service
          </p>
          <p className="text-xs text-white/50 mt-2">
            Created by <span className="text-white/80 font-medium">J-Derek</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
