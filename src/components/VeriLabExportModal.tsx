import React, { useState } from 'react';
import { X, Download, Microscope, CheckCircle2, Copy } from 'lucide-react';

interface VeriLabExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: { t: number; x: number; y: number; vx: number; vy: number }[];
}

export const VeriLabExportModal: React.FC<VeriLabExportModalProps> = ({
  isOpen,
  onClose,
  dataset
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateCSV = () => {
    let csv = 'timestamp,pos_x,pos_y,vel_x,vel_y,sensor_voltage_signal\n';
    dataset.forEach((d) => {
      // Simulate physical sensor voltage reading (0 - 5V)
      const vSignal = Math.max(0, Math.min(5, (d.y / 40) * 5 + (Math.random() - 0.5) * 0.08));
      csv += `${d.t},${d.x.toFixed(3)},${d.y.toFixed(3)},${d.vx.toFixed(3)},${d.vy.toFixed(3)},${vSignal.toFixed(4)}\n`;
    });
    return csv;
  };

  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SteamSim_Sensor_Dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const csvContent = generateCSV();
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 relative shadow-xl space-y-4 text-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Ekspor Data Telemetri &amp; Sensor Fisik</h3>
            <p className="text-xs text-slate-500">Format CSV Siap Uji Kalibrasi Metrologi di VeriLab AI</p>
          </div>
        </div>

        {/* Preview Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pratinjau Data Sensor ({dataset.length} Sampel Titik Waktu):</span>
            <span className="font-mono text-cyan-400 text-[11px]">&Delta;t = 0.01 detik</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1">
            <div className="text-slate-500 pb-1 border-b border-slate-200 flex justify-between">
              <span>t (s)</span>
              <span>X (m)</span>
              <span>Y (m)</span>
              <span>V_sensor (V)</span>
            </div>
            {dataset.slice(0, 15).map((d, i) => (
              <div key={i} className="flex justify-between text-[11px] text-slate-300">
                <span>{d.t.toFixed(2)}</span>
                <span>{d.x.toFixed(2)}</span>
                <span>{d.y.toFixed(2)}</span>
                <span className="text-emerald-400">{((d.y / 40) * 5).toFixed(3)} V</span>
              </div>
            ))}
            {dataset.length > 15 && (
              <div className="text-center text-[10px] text-slate-500 pt-1">
                ...dan {dataset.length - 15} baris data telemetri lainnya...
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <a
            href="https://verilab.steamcraft.online"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Microscope className="w-4 h-4" />
            <span>Buka verilab.steamcraft.online</span>
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copyToClipboard}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin CSV'}</span>
            </button>

            <button
              onClick={downloadCSV}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-900 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
