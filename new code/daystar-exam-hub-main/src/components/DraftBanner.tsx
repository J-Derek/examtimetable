import { AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DraftBanner() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const isHidden = localStorage.getItem('draft-banner-hidden');
        if (isHidden) {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('draft-banner-hidden', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="bg-warning/15 border-b border-warning/20 px-4 py-3 relative animate-fade-in">
            <div className="max-w-5xl mx-auto flex items-start gap-3 pr-8">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm text-warning-foreground">
                    <p className="font-bold mb-1">⚠️ DRAFT TIMETABLE - DO NOT MAKE DECISIONS YET</p>
                    <p>
                        This is a <strong>DRAFT</strong>. Students and Lecturers are requested to report any conflicts & omissions
                        (including capacity issues) by <strong>Monday, 1st December 2025</strong>.
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-3 text-warning-foreground/60 hover:text-warning-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
