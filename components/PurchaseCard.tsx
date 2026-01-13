
import React, { useState } from 'react';
import { Purchase, Amortization } from '../types';

interface PurchaseCardProps {
  purchase: Purchase;
  onAddAmortization: () => void;
  onEditPurchase: () => void;
  onEditAmortization: (amortization: Amortization) => void;
  onDelete: () => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ 
  purchase, 
  onAddAmortization, 
  onEditPurchase,
  onEditAmortization,
  onDelete 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const totalAmortized = purchase.amortizations.reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = Math.max(0, purchase.totalValue - totalAmortized);
  const monthlyInstallment = purchase.totalValue / purchase.installments;
  const progressPercentage = (totalAmortized / purchase.totalValue) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="bg-white rounded-[16px] border border-slate-100 p-6 shadow-sm card-hover flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 flex gap-1">
        {purchase.receiptUrl && (
          <a 
            href={purchase.receiptUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-green-600 transition-colors p-2"
            title="Ver Comprovante (Google Drive)"
          >
            <i className="fa-brands fa-google-drive"></i>
          </a>
        )}
        <button 
          onClick={onEditPurchase}
          className="text-slate-300 hover:text-indigo-500 transition-colors p-2"
          title="Editar Compra"
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button 
          onClick={onDelete}
          className="text-slate-300 hover:text-red-500 transition-colors p-2"
          title="Excluir"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      <div className="mb-4 pr-24">
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{formatDate(purchase.startDate)}</span>
        <h3 className="text-xl font-bold text-slate-800 mt-1 truncate">{purchase.name}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Total Original</p>
          <p className="text-lg font-bold text-slate-700">{formatCurrency(purchase.totalValue)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Parcela Est.</p>
          <p className="text-lg font-bold text-indigo-600">{formatCurrency(monthlyInstallment)}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Saldo Devedor Atual</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(currentBalance)}</p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {purchase.installments}x
          </span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
          <span>{Math.round(progressPercentage)}% pago</span>
          <span>Amortizado: {formatCurrency(totalAmortized)}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button 
          onClick={onAddAmortization}
          className="flex-1 bg-slate-100 hover:bg-indigo-50 text-indigo-600 font-bold py-2.5 rounded-xl transition-all"
        >
          <i className="fa-solid fa-coins mr-2"></i> Amortizar
        </button>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className={`px-4 py-2.5 rounded-xl transition-all ${showDetails ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          <i className={`fa-solid ${showDetails ? 'fa-chevron-up' : 'fa-list-ul'}`}></i>
        </button>
      </div>

      {showDetails && (
        <div className="mt-6 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Histórico de Amortizações</h4>
          {purchase.amortizations.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Nenhuma amortização registrada.</p>
          ) : (
            <ul className="space-y-2">
              {purchase.amortizations.map((item) => (
                <li key={item.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50 group">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{formatDate(item.date)}</span>
                    <span className="text-sm font-bold text-green-600">{formatCurrency(item.amount)}</span>
                  </div>
                  <button 
                    onClick={() => onEditAmortization(item)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-all p-2"
                    title="Editar Amortização"
                  >
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseCard;
