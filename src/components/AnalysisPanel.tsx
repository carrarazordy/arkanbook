import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente do Painel de Análise
interface AnalysisPanelProps {
    isOpen: boolean;
    assetData: any;
    onClose: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ isOpen, assetData, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && assetData && (
                <motion.aside
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 150 }}
                    className="fixed right-0 top-0 w-[500px] h-full bg-matteBlack z-50 border-l border-white/10 flex flex-col"
                >
                    {/* Botão para fechar e voltar ao Canvas */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 left-[-40px] w-10 h-10 bg-white text-black flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                    >
                        ✕
                    </button>

                    {/* Imagem que 'veio' do Canvas com layoutId idêntico para a mágica de re-posição */}
                    <div className="w-full aspect-video overflow-hidden">
                        <motion.img
                            layoutId={`asset-${assetData.id}`}
                            src={assetData.image}
                            alt={assetData.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Detalhes que entram depois do slide-in */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }} // Espera a imagem chegar para mostrar o texto
                        className="p-10 flex flex-col flex-grow"
                    >
                        {/* Header da Análise */}
                        <div className="mb-12">
                            <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Visual Breakdown</span>
                            <h2 className="text-white text-4xl font-bold uppercase italic mt-2">
                                {assetData.title}
                            </h2>
                        </div>

                        {/* Technical Specs Logic */}
                        <div className="space-y-8 flex-grow">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/20 text-[9px] uppercase">Type</label>
                                    <p className="text-white font-mono text-sm uppercase">{assetData.type || "Interface"}</p>
                                </div>
                                <div>
                                    <label className="text-white/20 text-[9px] uppercase">Source</label>
                                    <p className="text-white font-mono text-sm underline cursor-pointer hover:text-white/70 transition-colors">Behance</p>
                                </div>
                            </div>

                            {/* Lógica de Cores - Extração Visual */}
                            {assetData.colors && (
                                <div>
                                    <label className="text-white/20 text-[9px] uppercase mb-4 block">Colors</label>
                                    <div className="flex gap-4">
                                        {assetData.colors.map((color: string) => (
                                            <div key={color} className="flex items-center gap-2">
                                                <div className="w-3 h-3 border border-white/20" style={{ background: color }} />
                                                <span className="text-[10px] font-mono text-white/60 uppercase">{color}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botão de Ação Final */}
                        <motion.button
                            whileHover={{ backgroundColor: '#fff', color: '#000' }}
                            className="w-full py-4 border border-white text-white text-[10px] uppercase font-bold tracking-widest transition-colors mt-auto"
                        >
                            Save to Collection
                        </motion.button>
                    </motion.div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};
