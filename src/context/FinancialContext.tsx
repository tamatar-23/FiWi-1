
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FinancialData {
  monthlyIncome: string;
  monthlySavings: string;
  monthlyExpenses: string;
  totalDebt: string;
  riskProfile: string;
}

interface FinancialContextType {
  financialData: FinancialData;
  updateFinancialData: (data: Partial<FinancialData>) => void;
}

const defaultData: FinancialData = {
  monthlyIncome: '',
  monthlySavings: '',
  monthlyExpenses: '',
  totalDebt: '',
  riskProfile: 'medium',
};

const FinancialContext = createContext<FinancialContextType>({
  financialData: defaultData,
  updateFinancialData: () => {}
});

export const useFinancial = () => useContext(FinancialContext);

interface FinancialProviderProps {
  children: ReactNode;
}

export const FinancialProvider: React.FC<FinancialProviderProps> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialData>(defaultData);

  const updateFinancialData = (data: Partial<FinancialData>) => {
    setFinancialData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  return (
    <FinancialContext.Provider value={{ financialData, updateFinancialData }}>
      {children}
    </FinancialContext.Provider>
  );
};
