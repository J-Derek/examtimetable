export function LoadingScreen() {
    return (
        <div className="min-h-screen bg-offwhite flex flex-col items-center justify-center p-4">
            <div className="relative flex flex-col items-center gap-6 animate-fade-in">
                {/* Daystar Logo Shadow/Pulse */}
                <div className="absolute -inset-4 bg-daystar-navy/5 blur-3xl rounded-full w-48 h-48 animate-pulse" />

                {/* Custom Dot Circle Animation */}
                <div className="relative w-16 h-16">
                    <svg className="animate-spin w-full h-full text-daystar-navy" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>

                <p className="text-daystar-navy/70 font-medium animate-pulse text-lg tracking-wide">
                    Loading Exam Hub...
                </p>
            </div>
        </div>
    );
}
