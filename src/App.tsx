import { useState } from 'react';
import type { SimMode } from './types/sim';
import { Navbar } from './components/Navbar';
import { BallisticSim } from './components/simulations/BallisticSim';
import { OscillatorSim } from './components/simulations/OscillatorSim';
import { TitrationSim } from './components/simulations/TitrationSim';
import { ChaosSim } from './components/simulations/ChaosSim';
import { VeriLabExportModal } from './components/VeriLabExportModal';
import { Sparkles } from 'lucide-react';

export function App() {
  const [currentMode, setCurrentMode] = useState<SimMode>('ballistics');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportedDataset, setExportedDataset] = useState<{ t: number; x: number; y: number; vx: number; vy: number }[]>([]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Subheader Ecosystem Status */}
      <div className="border-b border-slate-900 bg-slate-900/30 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300">
              Bagian dari <strong>SteamCraft Ecosystem</strong> (<a href="https://steamcraft.online" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">steamcraft.online</a>)
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Target Subdomain: <code className="text-cyan-300 font-mono">sim.steamcraft.online</code></span>
          </div>

          {/* Mobile Mode Switcher */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setCurrentMode('ballistics')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'ballistics' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Proyektil
            </button>
            <button
              onClick={() => setCurrentMode('oscillator')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'oscillator' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Osilator
            </button>
            <button
              onClick={() => setCurrentMode('titration')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'titration' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Titrasi
            </button>
            <button
              onClick={() => setCurrentMode('chaos')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'chaos' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Chaos
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>Lead Developer: <strong className="text-slate-200">Muhammad Naza Firmansyah</strong></span>
          </div>
        </div>
      </div>

      {/* Main Simulation Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentMode === 'ballistics' && (
          <BallisticSim onDataGenerated={setExportedDataset} />
        )}
        {currentMode === 'oscillator' && (
          <OscillatorSim />
        )}
        {currentMode === 'titration' && (
          <TitrationSim />
        )}
        {currentMode === 'chaos' && (
          <ChaosSim />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>SteamSim Lab &bull; Created &amp; Developed by <strong>Muhammad Naza Firmansyah</strong> &bull; &copy; 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">SteamCraft</a>
            <a href="https://scholar.steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">PaperCraft AI</a>
            <a href="https://verilab.steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">VeriLab AI</a>
            <a href="https://portofolionaza.steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">Portofolio Naza</a>
          </div>
        </div>
      </footer>

      {/* Sensor Data Export Modal */}
      <VeriLabExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dataset={exportedDataset}
      />
    </div>
  );
}

export default App;
