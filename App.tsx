
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Purchase, Amortization, ToastMessage } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PurchaseModal from './components/PurchaseModal';
import AmortizationModal from './components/AmortizationModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [isAmortizationModalOpen, setAmortizationModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [selectedAmortization, setSelectedAmortization] = useState<Amortization | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('compras_parceladas_data');
    if (saved) {
      try {
        setPurchases(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    } else {
        // Fallback check for old branding name to prevent data loss
        const oldSaved = localStorage.getItem('amortiza_ease_data');
        if (oldSaved) {
            setPurchases(JSON.parse(oldSaved));
        }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('compras_parceladas_data', JSON.stringify(purchases));
  }, [purchases]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const handleSavePurchase = (purchaseData: Omit<Purchase, 'id' | 'amortizations'>) => {
    if (selectedPurchase && isPurchaseModalOpen) {
      setPurchases((prev) =>
        prev.map((p) => (p.id === selectedPurchase.id ? { ...p, ...purchaseData } : p))
      );
      addToast("Compra atualizada com sucesso!");
    } else {
      const newPurchase: Purchase = {
        ...purchaseData,
        id: crypto.randomUUID(),
        amortizations: [],
      };
      setPurchases((prev) => [...prev, newPurchase]);
      addToast("Compra cadastrada com sucesso!");
    }
    setPurchaseModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleDeletePurchase = () => {
    if (selectedPurchase) {
      setPurchases((prev) => prev.filter((p) => p.id !== selectedPurchase.id));
      setDeleteModalOpen(false);
      setSelectedPurchase(null);
      addToast("Compra removida com sucesso.", 'info');
    }
  };

  const handleSaveAmortization = (amount: number, date: string) => {
    if (selectedPurchase) {
      if (selectedAmortization) {
        setPurchases((prev) =>
          prev.map((p) =>
            p.id === selectedPurchase.id
              ? {
                  ...p,
                  amortizations: p.amortizations.map((a) =>
                    a.id === selectedAmortization.id ? { ...a, amount, date } : a
                  ),
                }
              : p
          )
        );
        addToast("Amortização atualizada!");
      } else {
        const newAmortization: Amortization = {
          id: crypto.randomUUID(),
          amount,
          date,
        };
        setPurchases((prev) =>
          prev.map((p) =>
            p.id === selectedPurchase.id
              ? { ...p, amortizations: [...p.amortizations, newAmortization] }
              : p
          )
        );
        addToast("Amortização adicionada!");
      }
      setAmortizationModalOpen(false);
      setSelectedPurchase(null);
      setSelectedAmortization(null);
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(purchases, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compras_parceladas_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("Backup gerado com sucesso!");
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const restoredData = JSON.parse(content);
          if (Array.isArray(restoredData)) {
            setPurchases(restoredData);
            addToast("Dados restaurados com sucesso!");
          } else {
            addToast("Formato de arquivo inválido.", "error");
          }
        } catch (error) {
          addToast("Erro ao ler o arquivo.", "error");
        }
      };
      reader.readAsText(file);
    }
    // Clear the input so the same file can be uploaded again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openAddPurchaseModal = () => {
    setSelectedPurchase(null);
    setPurchaseModalOpen(true);
  };

  const openEditPurchaseModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setPurchaseModalOpen(true);
  };

  const openAddAmortizationModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setSelectedAmortization(null);
    setAmortizationModalOpen(true);
  };

  const openEditAmortizationModal = (purchase: Purchase, amortization: Amortization) => {
    setSelectedPurchase(purchase);
    setSelectedAmortization(amortization);
    setAmortizationModalOpen(true);
  };

  const openDeleteModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setDeleteModalOpen(true);
  };

  const closePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedPurchase(null);
  };

  const closeAmortizationModal = () => {
    setAmortizationModalOpen(false);
    setSelectedPurchase(null);
    setSelectedAmortization(null);
  };

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <Header 
        onAddClick={openAddPurchaseModal} 
        onBackup={handleBackup}
        onRestore={() => fileInputRef.current?.click()}
      />
      
      {/* Hidden file input for restore */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json"
        onChange={handleRestore}
      />

      <main className="container mx-auto px-4 mt-8 flex-grow">
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <i className="fa-solid fa-receipt text-6xl mb-4 opacity-20"></i>
            <p className="text-xl">Nenhuma compra cadastrada.</p>
            <div className="flex gap-4">
               <button 
                onClick={openAddPurchaseModal}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 shadow-lg"
              >
                Cadastrar primeira compra
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 bg-white text-indigo-600 border border-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-50 shadow-sm"
              >
                Restaurar Backup
              </button>
            </div>
          </div>
        ) : (
          <Dashboard 
            purchases={purchases} 
            onAddAmortization={openAddAmortizationModal} 
            onEditPurchase={openEditPurchaseModal}
            onEditAmortization={openEditAmortizationModal}
            onDelete={openDeleteModal}
          />
        )}
      </main>

      {isPurchaseModalOpen && (
        <PurchaseModal 
          onClose={closePurchaseModal} 
          onSubmit={handleSavePurchase} 
          initialData={selectedPurchase || undefined}
        />
      )}

      {isAmortizationModalOpen && selectedPurchase && (
        <AmortizationModal 
          purchase={selectedPurchase}
          onClose={closeAmortizationModal} 
          onSubmit={handleSaveAmortization}
          initialData={selectedAmortization || undefined}
        />
      )}

      {isDeleteModalOpen && selectedPurchase && (
        <ConfirmationModal 
          title="Excluir Compra"
          message={`Tem certeza que deseja excluir "${selectedPurchase.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeletePurchase}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export default App;
