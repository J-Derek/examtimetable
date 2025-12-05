import { useState, useEffect } from 'react';
import { Mail, MessageCircle, Twitter, Copy, Check, Download, Image as ImageIcon, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { InstallPrompt } from '@/components/InstallPrompt';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { ScrollToTop } from '@/components/ScrollToTop';
import { SearchBar } from '@/components/SearchBar';
import { ExamList } from '@/components/ExamList';
import { PinnedExams } from '@/components/PinnedExams';
import { LoadingScreen } from '../components/LoadingScreen';
import { BurnAllOverlay } from '@/components/BurnAllOverlay';
import '../fire-styles.css';

import { useExams, useFilteredExams, useGroupedExams } from '@/hooks/useExams';
import { useFavorites } from '@/hooks/useFavorites';
import { useCookedExams } from '../hooks/useCookedExams';
import { useDebounce } from '../hooks/useDebounce';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [showBurnAll, setShowBurnAll] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { exams, loading, error } = useExams();
  const { favorites, toggleFavorite, isFavorite, addMultipleFavorites } = useFavorites();
  const { isCooked, toggleCooked, cookedExams } = useCookedExams();

  // Check for Burn All Condition
  useEffect(() => {
    if (favorites.length > 0 && favorites.every(exam => isCooked(exam))) {
      setShowBurnAll(true);
    }
  }, [favorites, cookedExams]);

  // Filter based on debounced query
  const displayedExams = useFilteredExams(
    showFavoritesOnly ? undefined : exams,
    showFavoritesOnly ? favorites : undefined,
    debouncedSearchQuery
  );

  // Limit displayed results to prevent rendering lag
  const MAX_DISPLAY = 50;
  const isTruncated = displayedExams.length > MAX_DISPLAY;
  const limitedExams = displayedExams.slice(0, MAX_DISPLAY);

  const groupedExams = useGroupedExams(limitedExams);

  const handleEmailClick = () => {
    navigator.clipboard.writeText("jdmacharia995@gmail.com");
    toast.success("Email address copied to clipboard!", {
      description: "jdmacharia995@gmail.com"
    });
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/254735319205", "_blank");
    setShowWhatsAppDialog(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daystar Exam Hub',
          text: 'Check your exam timetable easily with Exam Hub!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowShareDialog(true);
    }
  };

  const handleDownloadClick = () => {
    if (favorites.length === 0) {
      toast.warning("Nothing to download!", {
        description: "Pin some units to your 'My Units' list first."
      });
      return;
    }
    setShowDownloadDialog(true);
  };

  const downloadImage = async () => {
    const element = document.getElementById('my-units-capture');
    if (!element) return;

    toast.info("Generating image...", { duration: 2000 });
    setShowDownloadDialog(false);

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const link = document.createElement('a');
      link.download = `my-exams-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success("Image downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image.");
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('my-units-capture');
    if (!element) return;

    toast.info("Generating PDF...", { duration: 2000 });
    setShowDownloadDialog(false);

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2 // Higher scale for better PDF quality
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`my-exams-${new Date().toISOString().split('T')[0]}.pdf`);

      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-offwhite font-sans text-foreground">
      <Header onShare={handleShare} onDownload={handleDownloadClick} />

      <div id="timetable-content">
        <OfflineIndicator />
        <InstallPrompt />
        <TutorialOverlay />
        <ScrollToTop />

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
          <div id="my-units-capture" className="bg-transparent">
            {/* The wrapper div ensures html2canvas captures the right background */}
            <PinnedExams
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              isCooked={isCooked}
              onToggleCooked={toggleCooked}
            />
          </div>
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
            isCooked={isCooked}
            onToggleCooked={toggleCooked}
            totalMatchCount={displayedExams.length}
            visibleMatchCount={limitedExams.length}
          />

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-daystar-navy text-white py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex justify-center flex-col items-center gap-4">
            <button
              onClick={() => setShowContact(!showContact)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              {showContact ? (
                <>Hide Contact Developer <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show Contact Developer <ChevronDown className="w-4 h-4" /></>
              )}
            </button>

            {showContact && (
              <div className="flex gap-4 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={handleEmailClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm backdrop-blur-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>jdmacharia995</span>
                </button>

                <button
                  onClick={() => setShowWhatsAppDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-full transition-colors text-sm backdrop-blur-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-white/70 pt-4 border-t border-white/10">
            © 2025 Exam Timetable Service
          </p>
          <p className="text-xs text-white/50 mt-2">
            Created by <span className="text-white/80 font-medium">J-Derek</span>
          </p>
        </div>
      </footer>

      <AlertDialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Open WhatsApp?</AlertDialogTitle>
            <AlertDialogDescription>
              This will open a WhatsApp chat with the developer (0735319205).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWhatsAppClick} className="bg-green-600 hover:bg-green-700">
              Open Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Download Choice Dialog */}
      <AlertDialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download My Units</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a format for your pinned exam timetable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-center py-4">
            <button onClick={downloadImage} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">Image (PNG)</span>
            </button>
            <button onClick={downloadPDF} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm">PDF Document</span>
            </button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Options Dialog */}
      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Exam Hub</AlertDialogTitle>
            <AlertDialogDescription>
              Share the link with your friends!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-center py-4 flex-wrap">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Copied to clipboard!");
                setShowShareDialog(false);
              }}
              className="flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-xl hover:bg-muted transition-colors"
            >
              <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
                <Copy className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Copy Link</span>
            </button>

            <button
              onClick={() => {
                window.open(`https://wa.me/?text=${encodeURIComponent('Check out Daystar Exam Hub: ' + window.location.href)}`, '_blank');
                setShowShareDialog(false);
              }}
              className="flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-xl hover:bg-muted transition-colors"
            >
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">WhatsApp</span>
            </button>

            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out Daystar Exam Hub: ' + window.location.href)}`, '_blank');
                setShowShareDialog(false);
              }}
              className="flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-xl hover:bg-muted transition-colors"
            >
              <div className="p-3 bg-black text-white rounded-full">
                <Twitter className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">X (Twitter)</span>
            </button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showBurnAll && <BurnAllOverlay onClose={() => setShowBurnAll(false)} />}
    </div>
  );
}
