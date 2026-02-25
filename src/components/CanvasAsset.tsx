import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GRID_SIZE = 40;
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

interface CanvasAssetProps {
    item: any;
    x: number;
    y: number;
    isSelected: boolean;
    onSelect: (item: any, multi: boolean) => void;
    onDragStart: () => void;
    onDrag: (event: any, info: any) => void;
    onDragEnd: (event: any, info: any) => void;
}

export const CanvasAsset: React.FC<CanvasAssetProps> = ({ item, x, y, isSelected, onSelect, onDragStart, onDrag, onDragEnd }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isSnapped, setIsSnapped] = useState(false);

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragStart={() => {
                setIsDragging(true);
                onDragStart();
            }}
            onDrag={(e, info) => {
                // Se é parte da seleção, avisa o pai para mover todo o grupo
                if (isSelected) {
                    onDrag(e, info);
                } else {
                    // Mover individualmente se nÃ£o estÃ¡ selecionado globalmente
                    onDrag(e, info);
                }
            }}
            onDragEnd={(event, info) => {
                setIsDragging(false);
                setIsSnapped(true); // Feedback visual no momento do "suction/snap"
                setTimeout(() => setIsSnapped(false), 200);
                onDragEnd(event, info);
            }}
            // Animação sempre reflete o estado do pai (X e Y unificados)
            animate={{
                x: x,
                y: y,
                // Glow na borda se Snapped, ou brilho contínuo se Selected
                boxShadow: isSnapped ? "0 0 10px white" : (isSelected ? "0 0 15px rgba(255,255,255,0.7)" : "0 0 0px transparent")
            }}
            transition={{
                x: { type: "tween", duration: 0 }, // Drag instantâneo ao arrastar o grupo
                y: { type: "tween", duration: 0 },
                boxShadow: { duration: 0.2 }
            }}
            whileDrag={{ scale: 1.02, zIndex: 50 }}
            layoutId={`asset-container-${item.id}`} // Mantém o vínculo Layout com o Painel
            className={`canvas-asset absolute bg-matteBlack p-1 cursor-grab active:cursor-grabbing group shadow-md ${isSelected ? 'z-40' : 'z-10'}`}
            style={{ left: 0, top: 0, width: '400px' }}
            onClick={(e) => {
                // Permite multiselect se segurar o shift, ou envia pra ser aberto no Panel
                onSelect(item, e.shiftKey);
            }}
        >
            {/* Guias de Alinhamento (Visíveis apenas durante o arrasto) */}
            {isDragging && (
                <>
                    <div className="absolute top-0 left-[-2000px] right-[-2000px] border-t border-white/20 z-[-1]" />
                    <div className="absolute left-0 top-[-2000px] bottom-[-2000px] border-l border-white/20 z-[-1]" />
                </>
            )}

            <div className="relative overflow-hidden w-full aspect-video">
                <motion.img
                    layoutId={`asset-${item.id}`}
                    src={item.image}
                    alt={item.title}
                    // A imagem fica colorida se estiver selecionada no grupo
                    className={`w-full h-full object-cover transition-all duration-700 pointer-events-none ${isSelected ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                    draggable={false}
                />

                {/* Linha neon que brilha no clique */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileTap={{ opacity: 1, scale: 1.05 }}
                    className="absolute inset-0 border border-white shadow-[0_0_15px_white] pointer-events-none"
                />
            </div>

            <div className="p-4 border-t border-white/10">
                <h2 className="text-white font-bold uppercase tracking-widest text-xs pointer-events-none">
                    {item.title}
                </h2>
            </div>
        </motion.div>
    );
};
