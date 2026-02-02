
import React from 'react';
import { APP_NAME, Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'list';
  onTabChange: (tab: 'dashboard' | 'list') => void;
  onLogout: () => void;
  user: { name: string };
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout, user }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar / Mobile Nav */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-lg shadow-red-900/50">
             <Icons.Extinguisher />
          </div>
          <span className="text-white italic">{APP_NAME}</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <Icons.Dashboard />
            <span className="font-medium">Painel de Controlo</span>
          </button>
          
          <button 
            onClick={() => onTabChange('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'list' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <Icons.Extinguisher />
            <span className="font-medium">Gestão de Equipamento</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 border border-slate-600">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-400">Técnico Autorizado</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <Icons.Logout />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center md:sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-red-600 md:hidden">
              <Icons.Extinguisher />
            </div>
            <h1 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === 'dashboard' ? 'Painel Geral' : 'Listagem de Extintores'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 uppercase tracking-wider items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Norma NP 4413 : 2019
            </div>
            <div className="text-red-600 hidden md:block opacity-50">
              <Icons.Extinguisher />
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-8 overflow-y-auto flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
};
