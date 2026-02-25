import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GRID_SIZE = 40;
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

interface CanvasAssetProps {
    item: any;
    defaultX: number;
    defaultY: number;
    onSelect: (item: any) => void;
}

export const CanvasAsset: React.FC<CanvasAssetProps> = ({ item, defaultX, defaultY, onSelect }) => {
    const [isDragging, setIsDragging] = useState(false);

    // Posição interna que gerencia o snapping manual
    const [position, setPosition] = useState({ x: defaultX, y: defaultY });
    const [isSnapped, setIsSnapped] = useState(false);

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(event, info) => {
                setIsDragging(false);

                // Calculamos a nova posição baseada no offset do drag + posição anterior
                const newX = snapToGrid(position.x + info.offset.x);
                const newY = snapToGrid(position.y + info.offset.y);

                setPosition({ x: newX, y: newY });

                // Dispara o glow de "snapped" momentaneamente
                setIsSnapped(true);
                setTimeout(() => setIsSnapped(false), 200);
            }}
            // Controla a posição visual pós-drag via animate (força o snap fluido)
            animate={{
                x: position.x,
                y: position.y,
                // Glow na borda (se snapped = box-shadow; senão normal)
                boxShadow: isSnapped ? "0 0 10px white" : "0 0 0px transparent"
            }}
            // Transição rápida para a força de sucção "snappando"
            transition={{
                x: { type: "spring", stiffness: 300, damping: 25 },
                y: { type: "spring", stiffness: 300, damping: 25 },
                boxShadow: { duration: 0.2 }
            }}
            whileDrag={{ scale: 1.02, zIndex: 10 }}
            layoutId={`asset-container-${item.id}`} // Mantém o vínculo Layout com o Painel
            className="absolute bg-matteBlack p-1 cursor-grab active:cursor-grabbing group shadow-md"
            // Ao invés da left/top do CSS (desativada pois usamos x/y do framer para o snap), passamos absolute 0 e animamos o transform
            style={{ left: 0, top: 0, width: '400px' }}
        >
            {/* Guias de Alinhamento (Visível apenas durante o arrasto) */}
            {isDragging && (
                <>
                    {/* Guia Horizontal (X) */}
                    <div className="absolute top-0 left-[-2000px] right-[-2000px] border-t border-white/20 z-[-1]" />
                    {/* Guia Vertical (Y) */}
                    <div className="absolute left-0 top-[-2000px] bottom-[-2000px] border-l border-white/20 z-[-1]" />
                </>
            )}

            <div className="relative overflow-hidden w-full aspect-video" onClick={() => onSelect(item)}>
                <motion.img
                    layoutId={`asset-${item.id}`} // Segredo transição Shared Layout
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                    draggable={false}
                />

                {/* Linha neon que brilha no clique */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileTap={{ opacity: 1, scale: 1.05 }}
                    className="absolute inset-0 border border-white shadow-[0_0_15px_white] pointer-events-none"
                />
            </div>

            {/* Header info */}
            <div className="p-4 border-t border-white/10" onClick={() => onSelect(item)}>
                <h2 className="text-white font-bold uppercase tracking-widest text-xs pointer-events-none">
                    {item.title}
                </h2>
            </div>
        </motion.div>
    );
};
