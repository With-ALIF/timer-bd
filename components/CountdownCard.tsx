import React, { useState, useEffect, useRef } from 'react';
import { CountdownEvent } from '../types.ts';
import { calculateTimeRemaining, formatTimeNumber, getStatusColor } from '../utils.ts';

interface CountdownCardProps {
  event: CountdownEvent;
  onDelete: (id: string) => void;
}

type ColorPreset = {
  name: string;
  bg: string;
  text: string;
  accent: string;
  secondary: string;
  cardBg: string;
};

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Indigo', bg: '#4f46e5', text: '#ffffff', accent: '#ffffff', secondary: '#c7d2fe', cardBg: 'rgba(255, 255, 255, 0.15)' },
  { name: 'Slate', bg: '#1e293b', text: '#ffffff', accent: '#ffffff', secondary: '#94a3b8', cardBg: 'rgba(255, 255, 255, 0.1)' },
  { name: 'Rose', bg: '#e11d48', text: '#ffffff', accent: '#ffffff', secondary: '#fecdd3', cardBg: 'rgba(255, 255, 255, 0.15)' },
  { name: 'Emerald', bg: '#059669', text: '#ffffff', accent: '#ffffff', secondary: '#a7f3d0', cardBg: 'rgba(255, 255, 255, 0.15)' },
  { name: 'White', bg: '#ffffff', text: '#1e293b', accent: '#4f46e5', secondary: '#64748b', cardBg: '#f8fafc' },
];

const FONTS = [
  { name: 'Modern', family: 'Inter, sans-serif' },
  { name: 'Classic', family: 'Georgia, serif' },
  { name: 'Tech', family: 'monospace' },
];

const CountdownCard: React.FC<CountdownCardProps> = ({ event, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(event.time));
  const [showSettings, setShowSettings] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(event.time));
    }, 1000);

    return () => clearInterval(timer);
  }, [event.time]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  const isExpired = timeLeft.totalMs <= 0;

  // Helper for rounded rectangles on canvas
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
  };

  const downloadAsJpg = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    // Background
    ctx.fillStyle = selectedColor.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontStr = (size: number, weight: string = 'normal') => `${weight} ${size}px ${selectedFont.family}`;

    // Title
    ctx.fillStyle = selectedColor.text;
    ctx.font = fontStr(72, '900');
    ctx.textAlign = 'center';
    ctx.fillText(event.title || 'Untitled Event', canvas.width / 2, 180);

    // Description
    ctx.fillStyle = selectedColor.secondary;
    ctx.font = fontStr(32, '500');
    ctx.fillText(event.description || 'Deadline Countdown', canvas.width / 2, 250);

    if (isExpired) {
        ctx.fillStyle = selectedColor.text;
        ctx.font = fontStr(100, '900');
        ctx.fillText('COMPLETED', canvas.width / 2, 480);
    } else {
        const units = [
            { v: timeLeft.days, l: 'Days' },
            { v: timeLeft.hours, l: 'Hours' },
            { v: timeLeft.minutes, l: 'Mins' },
            { v: timeLeft.seconds, l: 'Secs' }
        ];

        const cardWidth = 220;
        const cardHeight = 240;
        const gap = 40;
        const totalWidth = (units.length * cardWidth) + ((units.length - 1) * gap);
        const startX = (canvas.width - totalWidth) / 2;
        const startY = 340;

        units.forEach((u, i) => {
            const x = startX + (i * (cardWidth + gap));
            const y = startY;

            // Unit Card Box
            ctx.fillStyle = selectedColor.cardBg;
            roundRect(ctx, x, y, cardWidth, cardHeight, 30).fill();

            // Card Shadow/Border effect (Optional but adds depth)
            if (selectedColor.name === 'White') {
                ctx.strokeStyle = 'rgba(0,0,0,0.05)';
                ctx.lineWidth = 2;
                roundRect(ctx, x, y, cardWidth, cardHeight, 30).stroke();
            }

            // Value
            ctx.fillStyle = selectedColor.accent;
            ctx.font = fontStr(96, '900');
            ctx.fillText(formatTimeNumber(u.v), x + (cardWidth / 2), y + 130);

            // Label
            ctx.fillStyle = selectedColor.secondary;
            ctx.font = fontStr(24, 'bold');
            ctx.fillText(u.l.toUpperCase(), x + (cardWidth / 2), y + 185);
        });
    }

    // Target Date Footer
    ctx.fillStyle = selectedColor.secondary;
    ctx.font = fontStr(26, 'bold');
    ctx.fillText(`TARGET: ${new Date(event.time).toLocaleString('bn-BD')}`, canvas.width / 2, 680);

    // Branding
    ctx.fillStyle = selectedColor.accent;
    ctx.globalAlpha = 0.4;
    ctx.font = fontStr(32, '900');
    ctx.fillText('TIMER BD', canvas.width / 2, 740);
    ctx.globalAlpha = 1.0;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `${event.title.replace(/\s+/g, '_') || 'deadline'}.jpg`;
    link.href = dataUrl;
    link.click();
    setShowSettings(false);
  };

  const getFontBtnClass = (name: string) => {
    const isSelected = selectedFont.name === name;
    return `text-[10px] py-1 px-2 rounded border transition-colors ${
      isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
    }`;
  };

  return (
    <div className={`relative p-6 rounded-3xl transition-all duration-300 border ${
      showSettings ? 'z-[60] scale-[1.02]' : 'z-10 group hover:-translate-y-1'
    } ${
      isExpired ? 'bg-gray-50 opacity-80 border-gray-200' : 'bg-white shadow-xl hover:shadow-2xl border-slate-100'
    }`}>
      <div className="absolute top-5 right-5 flex gap-2">
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`transition-all p-2 rounded-xl shadow-sm border flex items-center justify-center hover:scale-110 ${
              showSettings 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-slate-50 text-indigo-600 border-slate-200'
            }`}
            title="Download Settings"
          >
            <i className="fas fa-download"></i>
          </button>
          
          {showSettings && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[70] animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <div className="flex items-center gap-2 mb-3">
                 <div className="h-1 w-1 rounded-full bg-indigo-500"></div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Export Style</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase">Background Color</label>
                  <div className="flex gap-2">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setSelectedColor(p)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor.name === p.name ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: p.bg }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase">Typography</label>
                  <div className="grid grid-cols-3 gap-1">
                    {FONTS.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setSelectedFont(f)}
                        className={getFontBtnClass(f.name)}
                        style={{ fontFamily: f.family }}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={downloadAsJpg}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-blue-700 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <i className="fas fa-file-image"></i> Export JPG
                </button>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={() => onDelete(event.id)}
          className="text-slate-300 hover:text-red-500 transition-colors bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-1 truncate pr-24 leading-tight">
        {event.title || 'শিরোনামহীন ইভেন্ট'}
      </h3>
      <p className="text-[13px] text-slate-500 mb-6 truncate max-w-[80%]">
        {event.description || 'ডেডলাইন কাউন্টডাউন'}
      </p>

      {isExpired ? (
        <div className="text-center py-6 bg-slate-100 rounded-2xl text-slate-400 font-bold uppercase tracking-widest text-sm border-2 border-dashed border-slate-200">
          Completed
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5 text-center">
          <TimeUnit value={timeLeft.days} label="Days" color={getStatusColor(timeLeft.totalMs)} />
          <TimeUnit value={timeLeft.hours} label="Hours" color={getStatusColor(timeLeft.totalMs)} />
          <TimeUnit value={timeLeft.minutes} label="Mins" color={getStatusColor(timeLeft.totalMs)} />
          <TimeUnit value={timeLeft.seconds} label="Secs" color={getStatusColor(timeLeft.totalMs)} />
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Target Date</span>
            <span className="text-[11px] font-semibold text-slate-600">
                {new Date(event.time).toLocaleDateString('bn-BD')}
            </span>
        </div>
        <div className="text-[11px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded-lg">
            {new Date(event.time).toLocaleTimeString('bn-BD', {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
  <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl py-3 px-1 border border-slate-100 shadow-sm transition-all group-hover:bg-white group-hover:shadow-md">
    <span className={`text-2xl md:text-3xl font-black ${color} leading-none mb-1.5`}>
        {formatTimeNumber(value)}
    </span>
    <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
        {label}
    </span>
  </div>
);

export default CountdownCard;
