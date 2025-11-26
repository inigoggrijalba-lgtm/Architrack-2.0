import React from 'react';
import { ViewState } from '../types';
import { LayoutGrid, PlusCircle, PieChart, LayoutDashboard } from 'lucide-react';
import { APP_COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const NavButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${active ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <div className={`p-1.5 rounded-full transition-all ${active ? 'bg-orange-500/10' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-50 max-w-md mx-auto relative shadow-2xl border-x border-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
            <LayoutDashboard className="text-white w-6 h-6" />
        </div>
        <div>
            <h1 className="font-bold text-lg leading-tight">ArchiTrack</h1>
            <p className="text-xs text-slate-400">Control de horas</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 animate-fade-in">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-900 pb-safe-area">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center">
            <NavButton 
                active={currentView === 'register'} 
                onClick={() => setView('register')}
                icon={<PlusCircle size={24} />}
                label="Registrar"
            />
            <NavButton 
                active={currentView === 'projects'} 
                onClick={() => setView('projects')}
                icon={<LayoutGrid size={24} />}
                label="Proyectos"
            />
            <NavButton 
                active={currentView === 'reports'} 
                onClick={() => setView('reports')}
                icon={<PieChart size={24} />}
                label="Reportes"
            />
        </div>
      </nav>
    </div>
  );
};
