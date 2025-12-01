import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null; // Only show when offline (or maybe show a small green dot briefly?)

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-2 bg-daystar-navy text-white rounded-full shadow-lg border border-white/10">
                <WifiOff className="w-4 h-4 text-daystar-red" />
                <span className="text-sm font-medium">Offline Mode</span>
            </div>
        </div>
    );
}
