import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorFilter } from './ColorFilter';
import { BookmarkCard } from './BookmarkCard';

interface LibraryItem {
    id: string;
    title: string;
    category: string;
    image: string;
    tags: string[];
    colors: string[];
}

const bookmarks: LibraryItem[] = [
    { id: "ref_822", title: "Fluid Motion", category: "Interaction", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop", tags: ["#Digital", "#Motion"], colors: ["#FFFFFF", "#1A1A1A", "#E5E5E5"] },
    { id: "ref_823", title: "System Layouts", category: "Visual Identity", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", tags: ["#Grid", "#UI"], colors: ["#000000", "#FF3E00"] },
    { id: "ref_824", title: "Neon Gradients", category: "Interface Theory", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop", tags: ["#Color", "#Theory"], colors: ["#00FF66", "#000000"] },
    { id: "ref_825", title: "Kinetic Type", category: "Interaction", image: "https://images.unsplash.com/photo-1561089489-08174cbce471?q=80&w=800&auto=format&fit=crop", tags: ["#Typography", "#Motion"], colors: ["#FFFFFF", "#000000", "#4D4D4D"] }
];

const categories = ["All", "Visual Identity", "Interface Theory", "Interaction", "Collection"];

export const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [activeColor, setActiveColor] = useState<string | null>(null);

    // Filtragem combinada: categoria/sidebar + cor selecionada
    const byCategory = activeTab === "All"
        ? bookmarks
        : bookmarks.filter(item => item.category === activeTab || (activeTab === "Collection" && item.id));

    const filteredItems = activeColor
        ? byCategory.filter(item => item.colors.includes(activeColor))
        : byCategory;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000000', color: '#FFFFFF', fontFamily: "Public Sans, sans-serif" }}>
            {/* Sidebar Navigation */}
            <aside style={{ width: '250px', padding: '40px', borderRight: '1px solid #1A1A1A' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '40px', letterSpacing: '1px' }}>LIBRARY</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                color: activeTab === cat ? '#FFFFFF' : '#4D4D4D',
                                cursor: 'none',
                                padding: '8px 0',
                                fontSize: '14px',
                                fontFamily: "IBM Plex Mono, monospace",
                                position: 'relative',
                                transition: 'color 0.3s ease'
                            }}
                        >
                            {activeTab === cat && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    style={{
                                        position: 'absolute',
                                        left: '-20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '2px',
                                        height: '100%',
                                        backgroundColor: '#FFFFFF',
                                        boxShadow: '0 0 8px rgba(255,255,255,0.8)'
                                    }}
                                />
                            )}
                            {cat}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Grid area */}
            <main style={{ flex: 1, padding: '40px' }}>
                {/* Color Filter */}
                <ColorFilter activeColor={activeColor} setActiveColor={setActiveColor} />

                <AnimatePresence mode="popLayout">
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {filteredItems.map(item => (
                            <BookmarkCard key={item.id} {...item} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
