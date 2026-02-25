import React from 'react';
import { motion } from 'framer-motion';

interface BookmarkCardProps {
    title: string;
    category: string;
    image: string;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ title, category, image }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover="hover"
            className="relative overflow-hidden bg-matteBlack aspect-[3/4] cursor-none"
        >
            {/* Imagem com Zoom */}
            <motion.img
                src={image}
                variants={{ hover: { scale: 1.1 } }}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
            {/* Overlay de Texto */}
            <motion.div
                variants={{
                    initial: { y: 20, opacity: 0 },
                    hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent"
            >
                <p className="font-mono text-[10px] text-white/60 uppercase">{category}</p>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
            </motion.div>
        </motion.div>
    );
};
