import React from 'react';
import { motion } from 'framer-motion';

export const PreloadNeon: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <div className="relative flex items-center justify-center">
                {/* Círculo Neon */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-[1px] border-white border-t-transparent rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
                {/* Logo Central Pequeno */}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute font-bold tracking-[0.2em] text-white text-[10px] uppercase"
                >
                    Arkanbook
                </motion.span>
            </div>
        </div>
    );
};
