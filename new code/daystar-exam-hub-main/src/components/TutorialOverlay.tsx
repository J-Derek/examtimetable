import { useState, useEffect } from 'react';
import { X, Search, Star } from 'lucide-react';

export function TutorialOverlay() {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            // Small delay to let the UI load
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('hasSeenTutorial', 'true');
    };

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            handleDismiss();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                    <div className="flex justify-center">
                        {step === 1 ? (
                            <div className="p-4 bg-daystar-blue/10 rounded-full">
                                <Search className="w-12 h-12 text-daystar-blue" />
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-100 rounded-full">
                                <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">
                            {step === 1 ? "Search for your Units" : "Save to My Units"}
                        </h3>
                        <p className="text-gray-600">
                            {step === 1
                                ? "Start by typing your course code (e.g., MAT120A) in the search bar to find your exams."
                                : "Click the star icon next to any exam to add it to your personal list for quick access."}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-4 py-2.5 bg-daystar-navy text-white font-medium rounded-xl hover:bg-daystar-navy/90 transition-colors shadow-lg shadow-daystar-navy/20"
                        >
                            {step === 1 ? "Next" : "Got it!"}
                        </button>
                    </div>

                    <div className="flex justify-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full transition-colors ${step === 1 ? 'bg-daystar-blue' : 'bg-gray-200'}`} />
                        <div className={`w-2 h-2 rounded-full transition-colors ${step === 2 ? 'bg-daystar-blue' : 'bg-gray-200'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
