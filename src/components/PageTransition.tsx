import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.02 }
};

const pageTransition = {
    type: "tween",
    ease: [0.87, 0, 0.13, 1], // Expo easing para toque de luxo
    duration: 0.8
};

interface PageTransitionProps {
    children: React.ReactNode;
    keyPath?: string; // Para identificar a página na AnimatePresence
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, keyPath }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={keyPath}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen bg-black"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
