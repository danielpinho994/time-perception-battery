import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from 'react';
import generateSequences from './TestSequenceGenerator';

interface IAppContextData {
  patientName: string;
  globalStartTime: number;
  globalResults: [number, number];
  globalModalOpen: boolean;
  isGlobalRunning: boolean;
  estimationSequences: number[];
  estimationResults: number[];
  productionSequences: number[];
  productionResults: number[];
  clockResults: [number, number];
  isClockRunning: boolean;
  clockModalOpen: boolean;
}

interface IAppContext {
  data: IAppContextData;
  updateContext: (updatedValues: Partial<IAppContextData>) => void;
  resetContext: () => void;
}

const AppContext = createContext<IAppContext | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};

const defaultContextData = () => ({
  patientName: '',
  globalStartTime: 0,
  globalResults: [0, 0],
  globalModalOpen: false,
  isGlobalRunning: false,
  estimationSequences: generateSequences(),
  estimationResults: [],
  productionSequences: generateSequences(),
  productionResults: [],
  clockResults: [0, 0],
  isClockRunning: false,
  clockModalOpen: false,
});

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contextData, setContextData] =
    useState<IAppContextData>(defaultContextData);

  const updateContext = useCallback(
    (updatedValues: Partial<IAppContextData>) => {
      setContextData((prev) => ({ ...prev, ...updatedValues }));
    },
    [],
  );

  const resetContext = useCallback(() => {
    setContextData(defaultContextData());
  }, []);

  // Memoizing the context value
  const contextValue: IAppContext = useMemo(
    () => ({
      data: contextData,
      updateContext,
      resetContext,
    }),
    [contextData, updateContext, resetContext],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

const createUseContextState = <K extends keyof IAppContextData>(key: K) => {
  return (): [IAppContextData[K], (newValue: IAppContextData[K]) => void] => {
    const context = useAppContext();
    const setValue = useCallback(
      (newValue: IAppContextData[K]) => {
        context.updateContext({ [key]: newValue });
      },
      [context],
    );
    return [context.data[key], setValue];
  };
};

export const usePatientName = createUseContextState('patientName');
export const useGlobalStartTime = createUseContextState('globalStartTime');
export const useGlobalResults = createUseContextState('globalResults');
export const useGlobalModalOpen = createUseContextState('globalModalOpen');
export const useIsGlobalRunning = createUseContextState('isGlobalRunning');
export const useEstimationSequences = createUseContextState(
  'estimationSequences',
);
export const useEstimationResults = createUseContextState('estimationResults');
export const useProductionSequences = createUseContextState(
  'productionSequences',
);
export const useProductionResults = createUseContextState('productionResults');
export const useClockResults = createUseContextState('clockResults');
export const useIsClockRunning = createUseContextState('isClockRunning');
export const useClockModalOpen = createUseContextState('clockModalOpen');
