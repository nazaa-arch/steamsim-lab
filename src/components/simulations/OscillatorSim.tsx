import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, RotateCcw, Waves } from 'lucide-react';
import type { OscillatorParams } from '../../types/sim';

export const OscillatorSim: React.FC = () => {
  const [params, setParams] = useState<OscillatorParams>({
    mass: 1.0,
    springConstant: 16.0,
    damping: 0.4,
    drivingForce: 5.0,
    drivingFreq: 4.0
  });

  const [isRunning, setIsRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Natural frequency omega_0 = sqrt(k / m)
  const naturalFreq = Math.round(Math.sqrt(params.springConstant / params.mass) * 100) / 100;
  // Damping ratio zeta = gamma / (2 * sqrt(m * k))
  const dampingRatio = Math.round((params.damping / (2 * Math.sqrt(params.mass * params.springConstant))) * 100) / 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let x = 0.5; // displacement
    let v = 0.0; // velocity
    const dt = 0.02;

    const trail: { x: number; v: number; t: number }[] = [];

    const loop = () => {
      if (isRunning) {
        // RK2 integration of m x'' + gamma x' + k x = F0 cos(omega t)
        const fDrive = params.drivingForce * Math.cos(params.drivingFreq * t);
        const a = (fDrive - params.damping * v - params.springConstant * x) / params.mass;
        v += a * dt;
        x += v * dt;
        t += dt;

        trail.push({ x, v, t });
        if (trail.length > 300) trail.shift();
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Physical Spring & Mass drawing on Left Side
      const originX = 140;
      const originY = 50;
      const massScale = 50;
      const bobY = Math.min(h - 50, Math.max(90, 160 + x * massScale));

      // Draw spring coils
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      const coils = 12;
      const springLength = bobY - originY - 20;
      for (let i = 0; i <= coils; i++) {
        const py = originY + (i / coils) * springLength;
        const px = originX + (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(px, py);
      }
      ctx.lineTo(originX, bobY - 20);
      ctx.stroke();

      // Top ceiling
      ctx.fillStyle = '#475569';
      ctx.fillRect(originX - 35, originY - 10, 70, 10);

      // Mass block
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(originX - 25, bobY - 20, 50, 40);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(originX - 25, bobY - 20, 50, 40);

      // Text on mass
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${params.mass} kg`, originX, bobY + 4);

      // Phase Space Portrait (v vs x) on Right Side
      const pCenterX = w - 180;
      const pCenterY = h / 2;
      const pScale = 25;

      ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const px = pCenterX + trail[i].x * pScale;
        const py = pCenterY - trail[i].v * pScale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Phase space current dot
      ctx.beginPath();
      ctx.arc(pCenterX + x * pScale, pCenterY - v * pScale, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      // Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Fisik Pegas', originX - 30, originY - 16);
      ctx.fillText('Potret Ruang Fasa (v vs x)', pCenterX - 60, 25);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [params, isRunning]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Simulation Viewport */}
      <div className="lg:col-span-8 bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Osilator Harmonik Teredam &amp; Terpaksa (Damped Driven Harmonic)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>{isRunning ? 'Jeda Simulasi' : 'Jalankan'}</span>
            </button>
            <button
              onClick={() => {
                setParams({
                  mass: 1.0,
                  springConstant: 16.0,
                  damping: 0.4,
                  drivingForce: 5.0,
                  drivingFreq: 4.0
                });
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 w-full bg-slate-950/90 rounded-xl border border-slate-800 overflow-hidden relative min-h-[340px]">
          <canvas
            ref={canvasRef}
            width={720}
            height={360}
            className="w-full h-full block"
          />
        </div>

        {/* Real-time Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Frekuensi Alami (ω₀)</div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">{naturalFreq} rad/s</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Frekuensi Gaya Pendorong (ω)</div>
            <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">{params.drivingFreq} rad/s</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Rasio Redaman (&zeta;)</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{dampingRatio}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Kondisi Resonansi</div>
            <div className={`text-xs font-bold font-mono mt-1 ${Math.abs(params.drivingFreq - naturalFreq) < 0.3 ? 'text-rose-400' : 'text-slate-400'}`}>
              {Math.abs(params.drivingFreq - naturalFreq) < 0.3 ? 'RESONANSI AKTIF ⚠️' : 'Off-Resonance'}
            </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="lg:col-span-4 bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono">
              Parameter Sistem Dinamik
            </h4>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Konstanta Pegas (k)</span>
              <span className="font-mono text-cyan-400 font-bold">{params.springConstant} N/m</span>
            </div>
            <input
              type="range"
              min="4"
              max="40"
              value={params.springConstant}
              onChange={(e) => setParams({ ...params, springConstant: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Massa Beban (m)</span>
              <span className="font-mono text-indigo-400 font-bold">{params.mass} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.5"
              value={params.mass}
              onChange={(e) => setParams({ ...params, mass: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Koefisien Redaman (γ)</span>
              <span className="font-mono text-emerald-400 font-bold">{params.damping} N·s/m</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.0"
              step="0.05"
              value={params.damping}
              onChange={(e) => setParams({ ...params, damping: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Frekuensi Gaya Pendorong (ω)</span>
              <span className="font-mono text-rose-400 font-bold">{params.drivingFreq} rad/s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.2"
              value={params.drivingFreq}
              onChange={(e) => setParams({ ...params, drivingFreq: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs text-slate-400">
          <div className="font-mono text-slate-200 font-semibold text-[11px]">Eksplorasi Fenomena:</div>
          <p className="text-[11px] leading-relaxed">
            Sesuaikan &omega; mendekati &omega;₀ ({naturalFreq} rad/s) untuk mengamati ledakan amplitudo resonansi. Potret ruang fasa kanan melingkar membentuk siklus batas (*limit cycle*).
          </p>
        </div>
      </div>
    </div>
  );
};
