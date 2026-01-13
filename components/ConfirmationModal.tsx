
import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg" onClick={onCancel}></div>
      <div className="relative bg-white rounded-[16px] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 mb-8">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
          >
            Não, voltar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
          >
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
