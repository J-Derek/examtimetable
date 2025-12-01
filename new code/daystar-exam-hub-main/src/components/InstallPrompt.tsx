import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-daystar-navy text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full">
                    <Download className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-semibold">Install App</h3>
                    <p className="text-sm text-white/80">Add to home screen for quick access</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleInstallClick}
                    className="px-3 py-1.5 bg-white text-daystar-navy rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
                >
                    Install
                </button>
                <button
                    onClick={() => setShowPrompt(false)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
