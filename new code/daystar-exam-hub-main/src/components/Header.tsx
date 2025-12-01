import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
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

                {/* Optional: Right side actions (e.g. User Profile or Help) */}
                {/* Optional: Right side actions (e.g. User Profile or Help) */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-sm text-white/60">
                        September 2025 Semester
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
