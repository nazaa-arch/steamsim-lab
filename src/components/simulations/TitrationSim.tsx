import React, { useState, useEffect, useRef } from 'react';
import { FlaskConical, Beaker, CheckCircle2, RotateCcw } from 'lucide-react';
import type { TitrationParams } from '../../types/sim';

export const TitrationSim: React.FC = () => {
  const [params, setParams] = useState<TitrationParams>({
    acidType: 'weak',
    acidConc: 0.1,
    acidVol: 25.0,
    baseConc: 0.1,
    pKa: 4.76
  });

  const [addedBase, setAddedBase] = useState<number>(20.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate Equivalence Volume V_eq = (C_acid * V_acid) / C_base
  const vEq = (params.acidConc * params.acidVol) / params.baseConc;

  // Compute pH at addedBase volume
  const calculatePH = (vb: number) => {
    const va = params.acidVol;
    const ca = params.acidConc;
    const cb = params.baseConc;
    const molesAcid = (ca * va) / 1000;
    const molesBase = (cb * vb) / 1000;
    const totalVol = (va + vb) / 1000; // Liters

    if (vb === 0) {
      if (params.acidType === 'strong') {
        return Math.max(0, -Math.log10(ca));
      } else {
        const Ka = Math.pow(10, -params.pKa);
        const hConc = Math.sqrt(Ka * ca);
        return -Math.log10(hConc);
      }
    }

    if (molesBase < molesAcid) {
      // Before equivalence point
      if (params.acidType === 'strong') {
        const excessH = (molesAcid - molesBase) / totalVol;
        return Math.max(0, -Math.log10(excessH));
      } else {
        // Henderson-Hasselbalch: pH = pKa + log([A-] / [HA])
        const aMinus = molesBase;
        const ha = molesAcid - molesBase;
        return params.pKa + Math.log10(aMinus / ha);
      }
    } else if (Math.abs(molesBase - molesAcid) < 1e-6) {
      // Equivalence Point
      if (params.acidType === 'strong') {
        return 7.0;
      } else {
        // Hydrolysis of acetate: [OH-] = sqrt(Kb * [A-])
        const Ka = Math.pow(10, -params.pKa);
        const Kb = 1e-14 / Ka;
        const cSalt = molesAcid / totalVol;
        const ohConc = Math.sqrt(Kb * cSalt);
        const pOH = -Math.log10(ohConc);
        return 14 - pOH;
      }
    } else {
      // Past equivalence point (excess NaOH)
      const excessOH = (molesBase - molesAcid) / totalVol;
      const pOH = -Math.log10(excessOH);
      return Math.min(14, 14 - pOH);
    }
  };

  const currentPH = Math.round(calculatePH(addedBase) * 100) / 100;

  // Render Titration Curve Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const marginLeft = 40;
    const marginBottom = 30;
    const plotW = w - marginLeft - 20;
    const plotH = h - marginBottom - 20;

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let ph = 0; ph <= 14; ph += 2) {
      const y = h - marginBottom - (ph / 14) * plotH;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${ph}`, marginLeft - 6, y + 3);
    }

    for (let vol = 0; vol <= 50; vol += 10) {
      const x = marginLeft + (vol / 50) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - marginBottom);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${vol} mL`, x, h - 10);
    }

    // Phenolphthalein Transition Range (pH 8.2 - 10.0) highlight
    const y82 = h - marginBottom - (8.2 / 14) * plotH;
    const y100 = h - marginBottom - (10.0 / 14) * plotH;
    ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
    ctx.fillRect(marginLeft, y100, plotW, y82 - y100);

    // Compute and plot full titration curve
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let vb = 0; vb <= 50; vb += 0.2) {
      const ph = calculatePH(vb);
      const px = marginLeft + (vb / 50) * plotW;
      const py = h - marginBottom - (ph / 14) * plotH;
      if (vb === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Equivalence Point marker
    const eqPH = calculatePH(vEq);
    const eqX = marginLeft + (vEq / 50) * plotW;
    const eqY = h - marginBottom - (eqPH / 14) * plotH;
    ctx.beginPath();
    ctx.arc(eqX, eqY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Current operating point marker
    const curX = marginLeft + (addedBase / 50) * plotW;
    const curY = h - marginBottom - (currentPH / 14) * plotH;
    ctx.beginPath();
    ctx.arc(curX, curY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [params, addedBase, currentPH, vEq]);

  // Indicator color in beaker
  const getBeakerColor = () => {
    if (currentPH < 8.2) return 'rgba(56, 189, 248, 0.2)'; // Clear/Cyan
    if (currentPH >= 8.2 && currentPH <= 10.0) {
      const alpha = 0.2 + ((currentPH - 8.2) / 1.8) * 0.6;
      return `rgba(244, 63, 94, ${alpha})`; // Soft pink to vivid magenta
    }
    return 'rgba(225, 29, 72, 0.85)'; // Intense Fuchsia/Pink
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Simulation Viewport */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Kurva Titrasi Asam-Basa Kuantitatif &amp; Buffer Kapasitas</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddedBase(25.0)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-slate-600 text-xs font-mono flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Titik Ekuivalen</span>
            </button>
          </div>
        </div>

        {/* Canvas & Visual Beaker Split */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1">
          {/* Curve Canvas (9 cols) */}
          <div className="sm:col-span-9 bg-white rounded-xl border border-slate-200 overflow-hidden relative min-h-[300px]">
            <canvas
              ref={canvasRef}
              width={540}
              height={320}
              className="w-full h-full block"
            />
            <div className="absolute top-2 right-2 bg-white backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-pink-300 border border-pink-500/20">
              Daerah Indikator PP (pH 8.2 - 10)
            </div>
          </div>

          {/* Visual Beaker Container (3 cols) */}
          <div className="sm:col-span-3 bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-between">
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Warna Larutan</span>
              <div className="text-xl font-black font-mono text-slate-900 mt-1">pH {currentPH}</div>
            </div>

            {/* Beaker Flask SVG Simulation */}
            <div className="relative w-28 h-36 flex items-end justify-center">
              <div
                className="w-24 h-24 rounded-b-2xl border-2 border-slate-400 transition-colors duration-500 relative overflow-hidden flex items-end"
                style={{ backgroundColor: getBeakerColor() }}
              >
                {/* Liquid surface wave */}
                <div className="w-full h-2 bg-white/20 animate-pulse" />
              </div>
              <div className="absolute -top-1 w-12 h-10 border-t-2 border-x-2 border-slate-400 rounded-t" />
            </div>

            <div className="text-[10px] text-center text-slate-500 font-mono">
              Indikator: <strong className="text-pink-400">Phenolphthalein</strong>
            </div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Volume Basa Ditambahkan</div>
            <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">{addedBase} mL</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Titik Ekuivalen (V_eq)</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">{vEq} mL</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">pH Saat Ini</div>
            <div className="text-lg font-bold font-mono text-pink-400 mt-0.5">{currentPH}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Status Titrasi</div>
            <div className="text-xs font-bold font-mono text-emerald-400 mt-1">
              {addedBase < vEq ? 'Pra-Ekuivalen' : addedBase === vEq ? 'TITIK EKUIVALEN' : 'Pasca-Ekuivalen'}
            </div>
          </div>
        </div>
      </div>

      {/* Sliders & Controls */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Beaker className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 font-mono">
              Parameter Titrasi Kimia
            </h4>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Jenis Asam yang Dianalisis</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setParams({ ...params, acidType: 'weak', pKa: 4.76 })}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  params.acidType === 'weak'
                    ? 'bg-cyan-600 text-slate-900 shadow'
                    : 'bg-slate-100 text-slate-700 text-slate-500 hover:text-slate-900'
                }`}
              >
                Asam Lemah (CH₃COOH)
              </button>
              <button
                onClick={() => setParams({ ...params, acidType: 'strong' })}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  params.acidType === 'strong'
                    ? 'bg-cyan-600 text-slate-900 shadow'
                    : 'bg-slate-100 text-slate-700 text-slate-500 hover:text-slate-900'
                }`}
              >
                Asam Kuat (HCl)
              </button>
            </div>
          </div>

          {/* Slider for Adding Titrant NaOH */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-semibold">Teteskan Titran NaOH (0 - 50 mL)</span>
              <span className="font-mono text-blue-600 font-bold">{addedBase} mL</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={addedBase}
              onChange={(e) => setAddedBase(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Konsentrasi Titran NaOH (M)</span>
              <span className="font-mono text-emerald-400 font-bold">{params.baseConc} M</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={params.baseConc}
              onChange={(e) => setParams({ ...params, baseConc: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Volume Sampel Asam (V_a)</span>
              <span className="font-mono text-indigo-400 font-bold">{params.acidVol} mL</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="5"
              value={params.acidVol}
              onChange={(e) => setParams({ ...params, acidVol: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Persamaan Henderson-Hasselbalch:
          </div>
          <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-cyan-300 text-center">
            pH = pKa + log([A⁻] / [HA])
          </div>
        </div>
      </div>
    </div>
  );
};
