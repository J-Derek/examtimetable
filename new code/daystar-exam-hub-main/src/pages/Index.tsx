import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { InstallPrompt } from '@/components/InstallPrompt';
import { ScrollToTop } from '@/components/ScrollToTop';
import { SearchBar } from '@/components/SearchBar';
import { ExamList } from '@/components/ExamList';
import { PinnedExams } from '@/components/PinnedExams';
import { DraftBanner } from '@/components/DraftBanner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useExams, useFilteredExams, useGroupedExams } from '@/hooks/useExams';
import { useFavorites } from '@/hooks/useFavorites';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { exams, loading, error } = useExams();
  const filteredExams = useFilteredExams(exams, searchQuery);
  const groupedExams = useGroupedExams(filteredExams);
  const { favorites, toggleFavorite, isFavorite, addMultipleFavorites } = useFavorites();

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
          resultsCount={filteredExams.length}
          totalCount={exams.length}
        />
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
        </div>
      </footer>
    </div>
  );
};

export default Index;
