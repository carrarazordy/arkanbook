import React, { useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { AnalysisPanel } from './AnalysisPanel';
import { CanvasAsset } from './CanvasAsset';

interface AssetItem {
    id: string;
    title: string;
    image: string;
    type: string;
    colors: string[];
    x: number;
    y: number;
}

const initialAssetItems: AssetItem[] = [
    {
        id: "arch_1",
        title: "Architecture Ref",
        type: "Photography",
        image: "https://images.unsplash.com/photo-1541888087595-300435163a3d?q=80&w=800&auto=format&fit=crop",
        colors: ['#000000', '#FFFFFF', '#080808'],
        x: 400,
        y: 200
    },
    {
        id: "brand_1",
        title: "Minimalist Brand",
        type: "Identity",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
        colors: ["#FFFFFF", "#1A1A1A", "#E5E5E5"],
        x: 880,
        y: 400
    },
    {
        id: "fashion_1",
        title: "Editorial layout",
        type: "UI / Web",
        image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop",
        colors: ["#FFFFFF", "#1A1A1A"],
        x: 200,
        y: 600
    }
];

export const CreativeCanvas: React.FC = () => {
    // 1. Estados vitais
    const [assets, setAssets] = useState<AssetItem[]>(initialAssetItems);
    const [selectedAssetForAnalysis, setSelectedAssetForAnalysis] = useState<AssetItem | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // 2. Marquee Selection State (A Caixa Pontilhada Neon)
    const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const startPoint = useRef({ x: 0, y: 0 });

    // Referência fixa de posições para garantir pureza do offset sem acúmulo de deltas
    const dragInitialPositions = useRef<{ [id: string]: { x: number, y: number } }>({});

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

    const handleDragStart = () => {
        const initialPositions: { [id: string]: { x: number, y: number } } = {};
        assets.forEach(a => {
            initialPositions[a.id] = { x: a.x, y: a.y };
        });
        dragInitialPositions.current = initialPositions;
    };

    // Função de Arrastar em Grupo (Lógica Corrigida: Offset em vez de delta iterativo)
    const handleGroupDrag = (draggedId: string, event: any, info: any) => {
        const { offset } = info;
        const isDraggingSelected = selectedIds.includes(draggedId);

        setAssets(prev => prev.map(asset => {
            if ((isDraggingSelected && selectedIds.includes(asset.id)) || asset.id === draggedId) {
                const initialPos = dragInitialPositions.current[asset.id];
                if (initialPos) {
                    return {
                        ...asset,
                        x: initialPos.x + offset.x / scale.get(),
                        y: initialPos.y + offset.y / scale.get()
                    };
                }
            }
            return asset;
        }));
    };

    // Função para encostar no GRID no momento que soltar o mouse (Smart Snapping)
    const handleDragEnd = (draggedId: string, event: any, info: any) => {
        const GRID_SIZE = 40;
        const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

        const isDraggingSelected = selectedIds.includes(draggedId);

        setAssets(prev => prev.map(asset => {
            if ((isDraggingSelected && selectedIds.includes(asset.id)) || asset.id === draggedId) {
                const initialPos = dragInitialPositions.current[asset.id];
                if (initialPos) {
                    return {
                        ...asset,
                        x: snapToGrid(initialPos.x + info.offset.x / scale.get()),
                        y: snapToGrid(initialPos.y + info.offset.y / scale.get())
                    };
                }
            }
            return asset;
        }));
    };

    // Início da Lógica da Caixa Marquee
    const startSelection = (e: React.MouseEvent) => {
        // Previne ativar a caixa se clicar nas cartas (com a classe custom)
        if ((e.target as HTMLElement).closest('.canvas-asset')) return;

        setIsSelecting(true);
        setSelectedIds([]); // limpa a seleção

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale.get();
        const y = (e.clientY - rect.top) / scale.get();

        startPoint.current = { x, y };
        setSelectionBox({ x, y, width: 0, height: 0 });
    };

    const updateSelection = (e: React.MouseEvent) => {
        if (!isSelecting) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const currentX = (e.clientX - rect.left) / scale.get();
        const currentY = (e.clientY - rect.top) / scale.get();

        const x = Math.min(startPoint.current.x, currentX);
        const y = Math.min(startPoint.current.y, currentY);
        const width = Math.abs(currentX - startPoint.current.x);
        const height = Math.abs(currentY - startPoint.current.y);

        setSelectionBox({ x, y, width, height });

        // Cálculos de colisão para capturar cards dentro da Box
        const newSelectedIds = assets.filter(asset => {
            const assetX = asset.x;
            const assetY = asset.y;
            const assetW = 400;
            const assetH = 225; // Aspect-video ratio roughly

            return (
                assetX < x + width &&
                assetX + assetW > x &&
                assetY < y + height &&
                assetY + assetH > y
            );
        }).map(a => a.id);

        setSelectedIds(newSelectedIds);
    };

    const finishSelection = () => {
        setIsSelecting(false);
        setSelectionBox(null);
    };

    // Linhas de constelação (Visual de Conexão)
    const renderConstellationLines = () => {
        if (selectedIds.length < 2) return null;
        const selectedGroup = assets.filter(a => selectedIds.includes(a.id));
        const lines = [];

        for (let i = 0; i < selectedGroup.length - 1; i++) {
            const start = selectedGroup[i];
            const end = selectedGroup[i + 1];
            // Encontra o centro do card (W:400 H:aprox 280 contendo imagem+texto)
            const startX = start.x + 200;
            const startY = start.y + 140;
            const endX = end.x + 200;
            const endY = end.y + 140;

            lines.push(
                <line
                    key={`line-${i}`}
                    x1={startX} y1={startY}
                    x2={endX} y2={endY}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="0.5"
                />
            );
        }
        return (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                {lines}
            </svg>
        );
    };

    return (
        <>
            <div
                className="relative w-full h-screen bg-black overflow-hidden cursor-crosshair select-none"
            >
                {/* Menu Grupo (Topo) - Estética Fashion-Tech */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: selectedIds.length > 1 ? 0 : -50, opacity: selectedIds.length > 1 ? 1 : 0 }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 z-[80] bg-matteBlack border border-white/20 px-6 py-3 shadow-[0_0_15px_rgba(255,255,255,0.2)] flex flex-col items-center gap-1"
                >
                    <span className="text-white font-serif tracking-widest text-[10px] uppercase">
                        [ Group Selection: {selectedIds.length} Items ]
                    </span>
                    <button
                        onClick={() => setSelectedIds([])}
                        className="text-[8px] text-white/50 hover:text-white uppercase transition"
                    >
                        Dismiss
                    </button>
                </motion.div>

                {/* Área captando a Caixa de Seleção */}
                <div
                    onMouseDown={startSelection}
                    onMouseMove={updateSelection}
                    onMouseUp={finishSelection}
                    className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:40px_40px]"
                />

                {/* Espaço de Trabalho */}
                <motion.div
                    style={{ scale }}
                    className="relative w-full h-full pointer-events-none"
                >
                    {/* Linhas Conectando a seleção */}
                    {renderConstellationLines()}

                    {/* Renderizando itens em Grupo ou Independentes */}
                    {assets.map((item) => (
                        <div key={item.id} className="pointer-events-auto">
                            <CanvasAsset
                                item={item}
                                x={item.x}
                                y={item.y}
                                isSelected={selectedIds.includes(item.id)}
                                onSelect={(asset, isMulti) => {
                                    if (isMulti) {
                                        setSelectedIds(prev => prev.includes(asset.id) ? prev.filter(id => id !== asset.id) : [...prev, asset.id]);
                                    } else {
                                        setSelectedIds([asset.id]);
                                        setSelectedAssetForAnalysis(asset);
                                    }
                                }}
                                onDragStart={handleDragStart}
                                onDrag={(e, info) => handleGroupDrag(item.id, e, info)}
                                onDragEnd={(e, info) => handleDragEnd(item.id, e, info)}
                            />
                        </div>
                    ))}

                    {/* Feedback Marquee Selection Box */}
                    {selectionBox && (
                        <motion.div
                            className="absolute border border-dashed border-white/40 bg-white/5 z-50 pointer-events-none"
                            style={{
                                left: selectionBox.x,
                                top: selectionBox.y,
                                width: selectionBox.width,
                                height: selectionBox.height
                            }}
                        />
                    )}
                </motion.div>

                {/* Toolbar Inferior (Zoom) */}
                <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-matteBlack px-4 py-2 border border-white/10 z-[60] pointer-events-auto">
                    <button onClick={handleZoomOut} className="text-white hover:text-white/70 transition-colors">-</button>
                    <span className="text-[10px] text-white font-mono">{zoomLevel}%</span>
                    <button onClick={handleZoomIn} className="text-white hover:text-white/70 transition-colors">+</button>
                </div>
            </div>

            {/* Painel que desliza da Direita com a Imagem "voando" */}
            <AnalysisPanel
                isOpen={!!selectedAssetForAnalysis}
                assetData={selectedAssetForAnalysis}
                onClose={() => setSelectedAssetForAnalysis(null)}
            />
        </>
    );
};
