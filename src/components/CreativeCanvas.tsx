import React, { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { AnalysisPanel } from './AnalysisPanel';
import { CanvasAsset } from './CanvasAsset';

// Mock Type
interface AssetItem {
    id: string;
    title: string;
    image: string;
    type: string;
    colors: string[];
}

// Mock Data local
const assetItems: AssetItem[] = [
    {
        id: "arch_1",
        title: "Architecture Ref",
        type: "Photography",
        image: "https://images.unsplash.com/photo-1541888087595-300435163a3d?q=80&w=800&auto=format&fit=crop",
        colors: ['#000000', '#FFFFFF', '#080808']
    },
    {
        id: "brand_1",
        title: "Minimalist Brand",
        type: "Identity",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
        colors: ["#FFFFFF", "#1A1A1A", "#E5E5E5"]
    }
];

export const CreativeCanvas: React.FC = () => {
    // 1. Lógica de Estado Global (Seleção)
    const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);

    // Controle de Zoom do Canvas
    const scale = useMotionValue(1);
    const [zoomLevel, setZoomLevel] = useState(100);

    const handleZoomIn = () => {
        const newScale = scale.get() + 0.1;
        scale.set(newScale);
        setZoomLevel(Math.round(newScale * 100));
    };

    const handleZoomOut = () => {
        const newScale = Math.max(0.1, scale.get() - 0.1);
        scale.set(newScale);
        setZoomLevel(Math.round(newScale * 100));
    };

    return (
        <>
            <div className="relative w-full h-screen bg-black overflow-hidden cursor-crosshair">
                {/* Grade de fundo infinita */}
                <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:40px_40px]" />

                {/* Espaço de Trabalho Arrastável */}
                <motion.div
                    drag
                    style={{ scale }}
                    dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
                    className="relative w-full h-full"
                >
                    {/* Renderizando itens do Canvas usando o Smart Snapping Asset */}
                    {assetItems.map((item, index) => (
                        <CanvasAsset
                            key={item.id}
                            item={item}
                            // O "Offset" inicial deve ser um múltiplo do grid (40)
                            defaultX={400 * (index + 1)}
                            defaultY={200 * (index + 1)}
                            onSelect={setSelectedAsset}
                        />
                    ))}

                    {/* Círculo de Luz Neon (Centro) */}
                    <motion.div
                        className="absolute w-12 h-12 rounded-full border border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] left-[50%] top-[50%] pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                </motion.div>

                {/* Toolbar Inferior (Zoom) */}
                <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-matteBlack px-4 py-2 border border-white/10 z-[40]">
                    <button onClick={handleZoomOut} className="text-white hover:text-white/70 transition-colors">-</button>
                    <span className="text-[10px] text-white font-mono">{zoomLevel}%</span>
                    <button onClick={handleZoomIn} className="text-white hover:text-white/70 transition-colors">+</button>
                </div>
            </div>

            {/* Painel que desliza da Direita com a Imagem "voando" do Canvas (Shared Layout Animation) */}
            <AnalysisPanel
                isOpen={!!selectedAsset}
                assetData={selectedAsset}
                onClose={() => setSelectedAsset(null)}
            />
        </>
    );
};
