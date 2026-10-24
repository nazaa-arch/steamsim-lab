import React, { useState, useEffect, useRef } from 'react';
import { Orbit, Play, RotateCcw, Shuffle } from 'lucide-react';
import type { ChaosParams } from '../../types/sim';

export const ChaosSim: React.FC = () => {
  const [params, setParams] = useState<ChaosParams>({
    l1: 110,
    l2: 100,
    m1: 10,
    m2: 10,
    theta1: Math.PI / 2,
    theta2: Math.PI / 2
  });

  const [isRunning, setIsRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t1 = params.theta1;
    let t2 = params.theta2;
    let w1 = 0; // angular velocity 1
    let w2 = 0; // angular velocity 2
    const g = 9.81 * 80; // gravity scaled
    const dt = 0.04;

    const trail: { x: number; y: number }[] = [];

    const loop = () => {
      if (isRunning) {
        const { l1, l2, m1, m2 } = params;

        // Equations of motion for double pendulum
        const num1 = -g * (2 * m1 + m2) * Math.sin(t1) - m2 * g * Math.sin(t1 - 2 * t2) - 2 * Math.sin(t1 - t2) * m2 * (w2 * w2 * l2 + w1 * w1 * l1 * Math.cos(t1 - t2));
        const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2));
        const alpha1 = num1 / den1;

        const num2 = 2 * Math.sin(t1 - t2) * (w1 * w1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(t1) + w2 * w2 * l2 * m2 * Math.cos(t1 - t2));
        const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2));
        const alpha2 = num2 / den2;

        w1 += alpha1 * dt;
        w2 += alpha2 * dt;
        t1 += w1 * dt;
        t2 += w2 * dt;

        // Slight numerical damping to stabilize
        w1 *= 0.9995;
        w2 *= 0.9995;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const originX = w / 2;
      const originY = 110;

      const x1 = originX + params.l1 * Math.sin(t1);
      const y1 = originY + params.l1 * Math.cos(t1);

      const x2 = x1 + params.l2 * Math.sin(t2);
      const y2 = y1 + params.l2 * Math.cos(t2);

      trail.push({ x: x2, y: y2 });
      if (trail.length > 250) trail.shift();

      // Render chaotic luminous trail
      ctx.lineWidth = 1.5;
      for (let i = 1; i < trail.length; i++) {
        const alpha = (i / trail.length) * 0.9;
        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }

      // Rod 1
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Rod 2
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Pivot
      ctx.beginPath();
      ctx.arc(originX, originY, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#64748b';
      ctx.fill();

      // Bob 1
      ctx.beginPath();
      ctx.arc(x1, y1, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bob 2
      ctx.beginPath();
      ctx.arc(x2, y2, 11, 0, 2 * Math.PI);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [params, isRunning]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Simulation Viewport */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Bandul Ganda Kaotik (Double Pendulum Chaos Theory)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>{isRunning ? 'Jeda Simulasi' : 'Jalankan'}</span>
            </button>
            <button
              onClick={() => {
                setParams({
                  ...params,
                  theta1: (Math.random() - 0.5) * Math.PI * 1.5,
                  theta2: (Math.random() - 0.5) * Math.PI * 1.5
                });
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-slate-600 text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Acak Posisi Awal"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Acak Sudut</span>
            </button>
            <button
              onClick={() => {
                setParams({
                  l1: 110,
                  l2: 100,
                  m1: 10,
                  m2: 10,
                  theta1: Math.PI / 2,
                  theta2: Math.PI / 2
                });
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-slate-600"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 overflow-hidden relative min-h-[340px]">
          <canvas
            ref={canvasRef}
            width={720}
            height={360}
            className="w-full h-full block"
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Derajat Kebebasan</div>
            <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">2 DOF (&theta;₁, &theta;₂)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Sifat Sistem</div>
            <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">Non-Linear / Kaotik</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Eksponen Lyapunov</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">&lambda; &gt; 0</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Integritas Energi</div>
            <div className="text-xs font-bold font-mono text-amber-400 mt-1">Konservatif (Lagrangian)</div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Orbit className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 font-mono">
              Parameter Bandul Ganda
            </h4>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Panjang Lengan 1 (L₁)</span>
              <span className="font-mono text-blue-600 font-bold">{params.l1} px</span>
            </div>
            <input
              type="range"
              min="60"
              max="150"
              value={params.l1}
              onChange={(e) => setParams({ ...params, l1: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Panjang Lengan 2 (L₂)</span>
              <span className="font-mono text-indigo-400 font-bold">{params.l2} px</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              value={params.l2}
              onChange={(e) => setParams({ ...params, l2: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Massa Beban 1 (M₁)</span>
              <span className="font-mono text-purple-400 font-bold">{params.m1} kg</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={params.m1}
              onChange={(e) => setParams({ ...params, m1: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Massa Beban 2 (M₂)</span>
              <span className="font-mono text-rose-400 font-bold">{params.m2} kg</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={params.m2}
              onChange={(e) => setParams({ ...params, m2: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-500">
          <div className="font-mono text-slate-800 font-semibold text-[11px]">Butterfly Effect:</div>
          <p className="text-[11px] leading-relaxed">
            Perubahan sekecil 0.001 radian pada posisi awal akan menghasilkan trajektori akhir yang sama sekali berbeda dalam beberapa detik.
          </p>
        </div>
      </div>
    </div>
  );
};
