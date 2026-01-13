
import React, { useState, useEffect } from 'react';
import { Purchase } from '../types';

interface PurchaseModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<Purchase, 'id' | 'amortizations'>) => void;
  initialData?: Purchase;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [installments, setInstallments] = useState('1');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTotalValue(String(initialData.totalValue));
      setInstallments(String(initialData.installments));
      setStartDate(initialData.startDate);
      setReceiptUrl(initialData.receiptUrl || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};

    if (!name.trim()) newErrors.name = true;
    if (!totalValue || Number(totalValue) <= 0) newErrors.totalValue = true;
    if (!installments || Number(installments) <= 0) newErrors.installments = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name,
      totalValue: Number(totalValue),
      installments: Number(installments),
      startDate,
      receiptUrl: receiptUrl.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative glass bg-white/70 rounded-[16px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className={`fa-solid ${initialData ? 'fa-pen-to-square' : 'fa-cart-plus'} text-indigo-600`}></i>
          {initialData ? 'Editar Compra' : 'Nova Compra'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Compra</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} outline-none transition-all`}
              placeholder="Ex: Notebook novo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Valor Total (R$)</label>
              <input 
                type="number"
                step="0.01"
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.totalValue ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} outline-none transition-all`}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Parcelas</label>
              <input 
                type="number"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.installments ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-indigo-500'} outline-none transition-all`}
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Data da Compra</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
              <i className="fa-brands fa-google-drive text-green-600"></i>
              Link do Comprovante (Drive)
            </label>
            <input 
              type="url"
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://drive.google.com/..."
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
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              {initialData ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;
