import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloadProps {
    onComplete: () => void;
}

export const Preload: React.FC<PreloadProps> = ({ onComplete }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        // Simular o progresso do loading
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500); // Aguarda um momento antes de fechar
                    return 100;
                }
                return prev + 2; // Incremento
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    // Circunferência de um círculo com r=40 (2 * pi * r)
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (loadingProgress / 100) * circumference;

    return (
        <AnimatePresence>
            <motion.div
                className="preload-container"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}
            >
                <div style={{ position: 'relative', width: 120, height: 120 }}>
                    <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="#1A1A1A"
                            strokeWidth="4"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="#FFFFFF"
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{
                                filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))"
                            }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.1, ease: "linear" }}
                        />
                    </svg>
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: '14px'
                    }}>
                        {loadingProgress}%
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
