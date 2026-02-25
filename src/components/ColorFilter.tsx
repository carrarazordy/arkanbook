import React from 'react';
import { motion } from 'framer-motion';

interface ColorFilterProps {
    activeColor: string | null;
    setActiveColor: (color: string | null) => void;
}

export const ColorFilter: React.FC<ColorFilterProps> = ({ activeColor, setActiveColor }) => {
    const palette = ["#FFFFFF", "#000000", "#FF3E00", "#00FF66", "#4D4D4D"]; // Cores extraídas do banco

    return (
        <div className="flex items-center gap-4 py-8 border-b border-white/5 mb-8">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Filter by Palette</span>
            <div className="flex gap-2">
                {palette.map((color) => (
                    <motion.button
                        key={color}
                        onClick={() => setActiveColor(activeColor === color ? null : color)}
                        whileHover={{ scale: 1.2 }}
                        className="w-4 h-4 rounded-full border border-white/10 transition-all cursor-none"
                        style={{ backgroundColor: color }}
                    >
                        {activeColor === color && (
                            <motion.div
                                layoutId="activeFilter"
                                className="w-6 h-6 border border-white rounded-full -ml-[5px] -mt-[5px]"
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
