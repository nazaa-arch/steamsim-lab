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
    <div className="min-h-screen flex flex-col bg-[#f3f6fb] text-[#111d2d] selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Subheader Ecosystem Status */}
      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-700">
              Bagian dari <strong>SteamCraft Ecosystem</strong> (<a href="https://steamcraft.online" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">steamcraft.online</a>)
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-300">Target Subdomain: <code className="text-blue-700 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">sim.steamcraft.online</code></span>
          </div>

          {/* Mobile Mode Switcher */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setCurrentMode('ballistics')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'ballistics' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
            >
              Proyektil
            </button>
            <button
              onClick={() => setCurrentMode('oscillator')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'oscillator' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
            >
              Osilator
            </button>
            <button
              onClick={() => setCurrentMode('titration')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'titration' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
            >
              Titrasi
            </button>
            <button
              onClick={() => setCurrentMode('chaos')}
              className={`px-2.5 py-1 rounded-lg ${currentMode === 'chaos' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-300'}`}
            >
              Chaos
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <span>Lead Developer: <strong className="text-slate-900 font-semibold">Muhammad Naza Firmansyah</strong></span>
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
      <footer className="border-t border-slate-200 bg-white py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>SteamSim Lab &bull; Created &amp; Developed by <strong>Muhammad Naza Firmansyah</strong> &bull; &copy; 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="https://steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">SteamCraft</a>
            <a href="https://scholar.steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">PaperCraft AI</a>
            <a href="https://verilab.steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-teal-600 transition-colors">VeriLab AI</a>
            <a href="https://portofolionaza.steamcraft.online" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Portofolio Naza</a>
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
