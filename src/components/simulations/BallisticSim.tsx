import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Compass, Gauge, Zap } from 'lucide-react';
import type { BallisticParams } from '../../types/sim';

interface BallisticSimProps {
  onDataGenerated?: (data: { t: number; x: number; y: number; vx: number; vy: number }[]) => void;
}

export const BallisticSim: React.FC<BallisticSimProps> = ({ onDataGenerated }) => {
  const [params, setParams] = useState<BallisticParams>({
    velocity: 45,
    angle: 45,
    gravity: 9.81,
    dragCoeff: 0.25,
    mass: 1.0,
    noisePercent: 2.0
  });

  const [metrics, setMetrics] = useState({
    maxRange: 0,
    maxHeight: 0,
    flightTime: 0,
    impactSpeed: 0
  });

  const [isRunning, setIsRunning] = useState(false);
  const [animProgress, setAnimProgress] = useState(1.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute full trajectory
  const computeTrajectory = (p: BallisticParams) => {
    const dt = 0.01;
    const rad = (p.angle * Math.PI) / 180;
    let x = 0;
    let y = 0;
    let vx = p.velocity * Math.cos(rad);
    let vy = p.velocity * Math.sin(rad);
    let t = 0;

    const points: { t: number; x: number; y: number; vx: number; vy: number }[] = [];
    points.push({ t, x, y, vx, vy });

    let highestY = 0;

    while (y >= 0 && t < 30) {
      const v = Math.sqrt(vx * vx + vy * vy);
      const dragForce = 0.5 * p.dragCoeff * 1.225 * 0.05 * v * v;
      const ax = -(dragForce * (vx / v)) / p.mass;
      const ay = -p.gravity - (dragForce * (vy / v)) / p.mass;

      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
      t += dt;

      if (y > highestY) highestY = y;

      // Add sensor jitter
      const jitterX = (Math.random() - 0.5) * (p.noisePercent / 100) * 2;
      const jitterY = (Math.random() - 0.5) * (p.noisePercent / 100) * 2;

      points.push({
        t: Math.round(t * 100) / 100,
        x: Math.max(0, x + jitterX),
        y: Math.max(0, y + jitterY),
        vx,
        vy
      });

      if (y < 0) break;
    }

    return {
      points,
      range: x,
      maxHeight: highestY,
      flightTime: t,
      impactSpeed: Math.sqrt(vx * vx + vy * vy)
    };
  };

  const currentResult = computeTrajectory(params);

  useEffect(() => {
    setMetrics({
      maxRange: Math.round(currentResult.range * 10) / 10,
      maxHeight: Math.round(currentResult.maxHeight * 10) / 10,
      flightTime: Math.round(currentResult.flightTime * 100) / 100,
      impactSpeed: Math.round(currentResult.impactSpeed * 10) / 10
    });

    if (onDataGenerated) {
      onDataGenerated(currentResult.points);
    }
  }, [params]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Coordinate grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ground line
    const groundY = height - 40;
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Scale calculation
    const maxDataX = Math.max(80, currentResult.range * 1.15);
    const maxDataY = Math.max(40, currentResult.maxHeight * 1.3);
    const scaleX = (width - 60) / maxDataX;
    const scaleY = (groundY - 30) / maxDataY;

    // Trajectory with Aerodynamic Drag
    const pts = currentResult.points;
    const drawLimit = Math.floor(pts.length * animProgress);

    if (drawLimit > 1) {
      // Shaded area under curve
      ctx.beginPath();
      ctx.moveTo(30, groundY);
      for (let i = 0; i < drawLimit; i++) {
        const px = 30 + pts[i].x * scaleX;
        const py = groundY - pts[i].y * scaleY;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(30 + pts[drawLimit - 1].x * scaleX, groundY);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, groundY);
      grad.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
      grad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Trajectory curve
      ctx.beginPath();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      for (let i = 0; i < drawLimit; i++) {
        const px = 30 + pts[i].x * scaleX;
        const py = groundY - pts[i].y * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current Projectile Point
      const curPt = pts[drawLimit - 1];
      const curX = 30 + curPt.x * scaleX;
      const curY = groundY - curPt.y * scaleY;

      ctx.beginPath();
      ctx.arc(curX, curY, 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Velocity Vector arrow
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX + curPt.vx * 0.7, curY - curPt.vy * 0.7);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Launch Cannon Angle indicator
    const rad = (params.angle * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(30, groundY);
    ctx.lineTo(30 + Math.cos(rad) * 35, groundY - Math.sin(rad) * 35);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [params, animProgress, currentResult]);

  // Animation controller
  useEffect(() => {
    let animId: number;
    if (isRunning) {
      setAnimProgress(0);
      let p = 0;
      const step = () => {
        p += 0.02;
        if (p >= 1.0) {
          setAnimProgress(1.0);
          setIsRunning(false);
        } else {
          setAnimProgress(p);
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Simulation Viewport (Canvas) */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-700 font-bold" />
            <h3 className="font-bold text-sm text-slate-900">Trajektori Gerak Proyektil (Aerodinamika Kuadratik)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(true)}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              <span>Tembakkan Proyektil</span>
            </button>
            <button
              onClick={() => {
                setAnimProgress(1.0);
                setIsRunning(false);
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-slate-600"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas container */}
        <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 overflow-hidden relative min-h-[340px]">
          <canvas
            ref={canvasRef}
            width={720}
            height={360}
            className="w-full h-full block"
          />
          <div className="absolute top-3 left-3 bg-slate-50/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
            F<sub>drag</sub> = &frac12; &rho; C<sub>d</sub> A v<sup>2</sup>
          </div>
        </div>

        {/* Real-time Computed Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-600 font-semibold uppercase">Jarak Jangkauan (R)</div>
            <div className="text-lg font-bold font-mono text-blue-700 font-bold mt-0.5">{metrics.maxRange} m</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-600 font-semibold uppercase">Ketinggian Maks (H)</div>
            <div className="text-lg font-bold font-mono text-indigo-700 font-bold mt-0.5">{metrics.maxHeight} m</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-600 font-semibold uppercase">Waktu Terbang (t)</div>
            <div className="text-lg font-bold font-mono text-emerald-700 font-bold mt-0.5">{metrics.flightTime} s</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono text-slate-600 font-semibold uppercase">Kecepatan Benturan</div>
            <div className="text-lg font-bold font-mono text-rose-700 font-bold mt-0.5">{metrics.impactSpeed} m/s</div>
          </div>
        </div>
      </div>

      {/* Control Panel (Sidebar) */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Gauge className="w-4 h-4 text-blue-700 font-bold" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 font-mono">
              Parameter Eksperimen Fisika
            </h4>
          </div>

          {/* Sliders */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Kecepatan Awal (v₀)</span>
              <span className="font-mono text-blue-700 font-bold font-bold">{params.velocity} m/s</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={params.velocity}
              onChange={(e) => setParams({ ...params, velocity: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Sudut Elevasi (θ)</span>
              <span className="font-mono text-indigo-700 font-bold font-bold">{params.angle}&deg;</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              value={params.angle}
              onChange={(e) => setParams({ ...params, angle: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Koefisien Hambatan Udara (C_d)</span>
              <span className="font-mono text-emerald-700 font-bold font-bold">{params.dragCoeff}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={params.dragCoeff}
              onChange={(e) => setParams({ ...params, dragCoeff: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Massa Proyektil (m)</span>
              <span className="font-mono text-amber-800 font-bold font-bold">{params.mass} kg</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="5.0"
              step="0.2"
              value={params.mass}
              onChange={(e) => setParams({ ...params, mass: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Derau Sensor Riil (Noise Jitter)</span>
              <span className="font-mono text-purple-700 font-bold font-bold">&plusmn;{params.noisePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={params.noisePercent}
              onChange={(e) => setParams({ ...params, noisePercent: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* VeriLab Integration Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold font-bold font-mono">
            <Zap className="w-3.5 h-3.5" />
            Sinergi VeriLab AI Metrology
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Data trajektori berderau ini merepresentasikan pembacaan sensor radar/LiDAR. Ekspor data dapat diuji kurva regresi GPR-nya di VeriLab Engine.
          </p>
        </div>
      </div>
    </div>
  );
};
