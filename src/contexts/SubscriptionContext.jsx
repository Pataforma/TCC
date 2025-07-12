import React, { createContext, useContext, useState } from 'react';

// Cria o contexto
const SubscriptionContext = createContext();

// Hook para usar o contexto
export function useSubscription() {
  return useContext(SubscriptionContext);
}

// Provider do contexto
export function SubscriptionProvider({ children }) {
  // Mock: plano inicial é 'basic', pode ser 'advanced'
  const [plan, setPlan] = useState('basic');

  // Função mock para upgrade
  function upgradeToAdvanced() {
    setPlan('advanced');
  }

  // Função mock para downgrade
  function downgradeToBasic() {
    setPlan('basic');
  }

  return (
    <SubscriptionContext.Provider value={{ plan, upgradeToAdvanced, downgradeToBasic }}>
      {children}
    </SubscriptionContext.Provider>
  );
} 