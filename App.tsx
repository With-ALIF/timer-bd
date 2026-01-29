import React, { useState, useEffect } from 'react';
import { CountdownEvent } from './types.ts';
import CountdownCard from './components/CountdownCard.tsx';
import EmptyState from './components/EmptyState.tsx';
import ManualAddForm from './components/ManualAddForm.tsx';

const App: React.FC = () => {
  const [events, setEvents] = useState<CountdownEvent[]>(() => {
    const saved = localStorage.getItem('countdown_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Failed to parse saved events", e);
        return [];
      }
    }
    return [];
  });

  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('countdown_events', JSON.stringify(events));
  }, [events]);

  const handleAddManual = (event: CountdownEvent) => {
    setEvents(prev => [event, ...prev]);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('সবগুলো ইভেন্ট কি মুছে ফেলতে চান?')) {
      setEvents([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 glass shadow-sm px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-100">
              <i className="fas fa-clock text-lg"></i>
            </div>
            <h1 className="text-xl font-black tracking-tight">
              TIMER <span className="text-indigo-600">BD</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowManualForm(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100 active:scale-95"
            >
              <i className="fas fa-plus"></i>
              Add Event
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 flex-grow w-full pb-20">
        {events.length > 0 && (
          <div className="flex justify-between items-center mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <div>
              <h2 className="text-lg font-bold text-slate-800">আপনার ডেডলাইনসমূহ</h2>
              <p className="text-sm text-slate-500">{events.length}টি ইভেন্ট সেভ করা আছে</p>
            </div>
            <button
              onClick={clearAll}
              className="group flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all shadow-sm"
            >
              <i className="fas fa-trash-can"></i>
              Clear All
            </button>
          </div>
        )}

        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
            {events.map((event) => (
              <CountdownCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-slate-800 text-white p-1.5 rounded-md">
                  <i className="fas fa-clock text-sm"></i>
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-800">
                  TIMER <span className="text-indigo-600">BD</span>
                </h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                একটি অত্যাধুনিক কাউন্টডাউন প্ল্যাটফর্ম যা আপনাকে আপনার সময় এবং গুরুত্বপূর্ণ ইভেন্টগুলো আরও দক্ষতার সাথে পরিচালনা করতে সাহায্য করে।
              </p>
            </div>

            {/* Developer Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Developed By</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                  <i className="fas fa-user-tie text-indigo-600"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">Md Abdullah Al Khalid Alif</h3>
                  <p className="text-indigo-600 font-semibold text-[12px] uppercase tracking-wider">Lead Full-Stack Developer</p>
                </div>
              </div>
            </div>

            {/* Connectivity Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Quick Connect</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/With-ALIF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm border border-slate-100"
                  aria-label="GitHub"
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a
                  href="https://alif-protfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100"
                  aria-label="Portfolio"
                >
                  <i className="fas fa-globe text-xl"></i>
                </a>
                <a
                  href="mailto:alifbrur16@gmail.com"
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100"
                  aria-label="Email"
                >
                  <i className="fas fa-envelope text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showManualForm && (
        <ManualAddForm
          onAdd={handleAddManual}
          onClose={() => setShowManualForm(false)}
        />
      )}
    </div>
  );
};

export default App;
