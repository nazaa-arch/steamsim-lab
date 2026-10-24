import React from 'react';
import { Orbit, Compass, Activity, FlaskConical, ExternalLink, ShieldCheck, Microscope, FileText, Download } from 'lucide-react';
import type { SimMode } from '../types/sim';

interface NavbarProps {
  currentMode: SimMode;
  onSelectMode: (mode: SimMode) => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenExportModal
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Orbit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">SteamSim<span className="text-cyan-400">.Lab</span></span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive Virtual Science &amp; Simulation Studio
            </p>
          </div>
        </div>

        {/* Simulation Selector Pills */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onSelectMode('ballistics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'ballistics'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Fisika: Proyektil</span>
          </button>

          <button
            onClick={() => onSelectMode('oscillator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'oscillator'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Osilator Harmonik</span>
          </button>

          <button
            onClick={() => onSelectMode('titration')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'titration'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Kimia: Titrasi pH</span>
          </button>

          <button
            onClick={() => onSelectMode('chaos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'chaos'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Matematika: Chaos</span>
          </button>
        </div>

        {/* Ecosystem Subdomain Badges & Export */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <a
              href="https://scholar.steamcraft.online"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-[11px]"
              title="PaperCraft AI"
            >
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>scholar</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <a
              href="https://verilab.steamcraft.online"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-[11px]"
              title="VeriLab AI"
            >
              <Microscope className="w-3 h-3 text-emerald-400" />
              <span>verilab</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <a
              href="https://portofolionaza.steamcraft.online"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-[11px]"
              title="Portofolio Naza"
            >
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>portofolionaza</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Data Sensor (CSV)</span>
          </button>
        </div>

      </div>
    </header>
  );
};
