
import React, { useState, useEffect } from 'react';
import { Purchase, Amortization } from '../types';

interface AmortizationModalProps {
  purchase: Purchase;
  onClose: () => void;
  onSubmit: (amount: number, date: string) => void;
  initialData?: Amortization;
}

const AmortizationModal: React.FC<AmortizationModalProps> = ({ purchase, onClose, onSubmit, initialData }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(String(initialData.amount));
      setDate(initialData.date);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError(true);
      return;
    }
    onSubmit(Number(amount), date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative glass bg-white/70 rounded-[16px] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <i className={`fa-solid ${initialData ? 'fa-pen-to-square' : 'fa-hand-holding-dollar'} ${initialData ? 'text-indigo-600' : 'text-green-600'}`}></i>
          {initialData ? 'Editar Amortização' : 'Amortização Extra'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">Referente à: <span className="font-bold text-slate-700">{purchase.name}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Valor (R$)</label>
            <input 
              type="number"
              step="0.01"
              value={amount}
              autoFocus
              onChange={(e) => {
                  setAmount(e.target.value);
                  setError(false);
              }}
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-green-500'} outline-none transition-all`}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className={`flex-1 ${initialData ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 rounded-xl shadow-lg transition-all`}
            >
              {initialData ? 'Atualizar' : 'Amortizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmortizationModal;
