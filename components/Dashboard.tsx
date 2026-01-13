
import React from 'react';
import { Purchase, Amortization } from '../types';
import PurchaseCard from './PurchaseCard';

interface DashboardProps {
  purchases: Purchase[];
  onAddAmortization: (purchase: Purchase) => void;
  onEditPurchase: (purchase: Purchase) => void;
  onEditAmortization: (purchase: Purchase, amortization: Amortization) => void;
  onDelete: (purchase: Purchase) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  purchases, 
  onAddAmortization, 
  onEditPurchase,
  onEditAmortization,
  onDelete 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchases.map((purchase) => (
        <PurchaseCard 
          key={purchase.id} 
          purchase={purchase} 
          onAddAmortization={() => onAddAmortization(purchase)}
          onEditPurchase={() => onEditPurchase(purchase)}
          onEditAmortization={(amort) => onEditAmortization(purchase, amort)}
          onDelete={() => onDelete(purchase)}
        />
      ))}
    </div>
  );
};

export default Dashboard;
