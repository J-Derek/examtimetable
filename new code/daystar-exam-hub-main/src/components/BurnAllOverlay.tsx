import { useState, useEffect } from 'react';
import { Flame, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BurnAllOverlayProps {
    onClose: () => void;
}

export function BurnAllOverlay({ onClose }: BurnAllOverlayProps) {
    const [step, setStep] = useState<'burning' | 'uninstall'>('burning');

    useEffect(() => {
        // Show burn animation for 3 seconds, then ask to uninstall
        const timer = setTimeout(() => {
            setStep('uninstall');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleUninstall = (confirm: boolean) => {
        if (confirm) {
            toast.success("Uninstalling... just kidding!", {
                description: "You finished all your exams! Go celebrate! 🎉",
                duration: 5000,
            });
        } else {
            toast.info("Keeping the app? Okay!", {
                description: "Maybe for next semester? 😉"
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white animate-in fade-in duration-500">
            {step === 'burning' && (
                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <Flame className="w-32 h-32 text-orange-500 animate-pulse drop-shadow-[0_0_50px_rgba(255,165,0,0.8)]" />
                        <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-ping" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 animate-pulse text-center px-4">
                        ALL EXAMS COOKED!
                    </h2>
                </div>
            )}

            {step === 'uninstall' && (
                <div className="bg-card text-card-foreground p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-orange-500/20 animate-in zoom-in-50 duration-300">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-4 bg-red-100 rounded-full text-red-600 mb-2">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold">Mission Complete!</h3>
                        <p className="text-muted-foreground">
                            You've successfully cooked all your units. Do you want to auto-uninstall the app now?
                        </p>
                        <div className="flex gap-4 w-full mt-4">
                            <button
                                onClick={() => handleUninstall(false)}
                                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                            >
                                Keep it
                            </button>
                            <button
                                onClick={() => handleUninstall(true)}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                            >
                                Auto-Uninstall
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
