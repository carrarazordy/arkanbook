import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
    const [isHovering, setIsHovering] = useState(false);

    // Valores de posição do mouse
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Configuração de "Spring" para um movimento fluido e luxuoso
    const springConfig = { damping: 25, stiffness: 150 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        // Lógica para detectar se o mouse está sobre algo clicável (botões, cards)
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('button, a, .interactive-card')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
                // Ao invés de x/y no style com framer-motion costuma ser melhor margin 
                // ou translate direto no element, mas seguindo a lógica solicitada:
                x: '-50%',
                y: '-50%',
            }}
            animate={{
                scale: isHovering ? 2.5 : 1,
                opacity: 1,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        />
    );
};
