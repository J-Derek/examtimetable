import { GraduationCap, Share2, Download } from "lucide-react";

interface HeaderProps {
    onShare: () => void;
    onDownload: () => void;
}

export function Header({ onShare, onDownload }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full bg-daystar-navy text-white shadow-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Logo Placeholder - Using Icon for now */}
                    <div className="bg-white/10 p-2 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-daystar-blue" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Exam Timetable Checker</h1>
                        <p className="text-xs text-white/70 font-medium">Find Your Schedule</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onShare}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Share App"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onDownload}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Download Timetable"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
