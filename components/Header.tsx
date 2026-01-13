
import React from 'react';

interface HeaderProps {
  onAddClick: () => void;
  onBackup: () => void;
  onRestore: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onBackup, onRestore }) => {
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="animated-header-gradient h-2 w-full"></div>
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <i className="fa-solid fa-wallet text-xl"></i>
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 uppercase tracking-tight">
              Compras Parceladas
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onBackup}
              title="Backup JSON"
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
            >
              <i className="fa-solid fa-download"></i>
            </button>
            <button 
              onClick={onRestore}
              title="Restaurar JSON"
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
            >
              <i className="fa-solid fa-upload"></i>
            </button>
            <button 
              onClick={onAddClick}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 ml-2"
            >
              <i className="fa-solid fa-plus"></i>
              <span className="hidden sm:inline">Nova Compra</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
