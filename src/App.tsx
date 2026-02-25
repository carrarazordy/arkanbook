import React, { useState, useEffect } from 'react';
import { PreloadNeon as Preload } from './components/PreloadNeon';
import { EntryVault } from './components/EntryVault';
import { Dashboard } from './components/Dashboard';
import { CreativeCanvas } from './components/CreativeCanvas';
import { PageTransition } from './components/PageTransition';

type Page = 'preload' | 'entry' | 'dashboard' | 'canvas';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('preload');

  // Skip preload for MVP demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('entry');
    }, 4000); // Wait for PreloadNeon animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white w-full overflow-hidden font-sans">
      <PageTransition keyPath={currentPage}>
        {currentPage === 'preload' && <Preload />}
        {currentPage === 'entry' && <EntryVault onSuccess={() => setCurrentPage('dashboard')} />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'canvas' && <CreativeCanvas />}
      </PageTransition>

      {/* Navegação Rápida (Apenas para demonstração MVP Vercel) */}
      {currentPage !== 'preload' && (
        <div className="fixed bottom-0 right-0 p-4 z-50 flex gap-2">
          <button onClick={() => setCurrentPage('entry')} className="text-[10px] bg-white/10 px-2 py-1 text-white border border-white/20 hover:bg-white hover:text-black transition">Auth</button>
          <button onClick={() => setCurrentPage('dashboard')} className="text-[10px] bg-white/10 px-2 py-1 text-white border border-white/20 hover:bg-white hover:text-black transition">Dashboard</button>
          <button onClick={() => setCurrentPage('canvas')} className="text-[10px] bg-white/10 px-2 py-1 text-white border border-white/20 hover:bg-white hover:text-black transition">Canvas</button>
        </div>
      )}
    </div>
  );
}

export default App;
