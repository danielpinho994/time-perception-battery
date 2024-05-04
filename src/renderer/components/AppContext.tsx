import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from 'react';
import generateSequences from './TestSequenceGenerator';

interface IAppContextData {
  globalStartTime: number;
  globalResults: [number, number];
  globalModalOpen: boolean;
  isGlobalPaused: boolean;
  estimationSequences: number[];
  estimationResults: number[];
  productionSequences: number[];
  productionResults: number[];
  clockResults: [number, number];
  isClockPaused: boolean;
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
  globalStartTime: 0,
  globalResults: [0, 0],
  globalModalOpen: false,
  isGlobalPaused: true,
  estimationSequences: generateSequences(),
  estimationResults: [],
  productionSequences: generateSequences(),
  productionResults: [],
  clockResults: [0, 0],
  isClockPaused: true,
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

export const useGlobalStartTime = createUseContextState('globalStartTime');
export const useGlobalResults = createUseContextState('globalResults');
export const useGlobalModalOpen = createUseContextState('globalModalOpen');
export const useIsGlobalPaused = createUseContextState('isGlobalPaused');
export const useEstimationSequences = createUseContextState(
  'estimationSequences',
);
export const useEstimationResults = createUseContextState('estimationResults');
export const useProductionSequences = createUseContextState(
  'productionSequences',
);
export const useProductionResults = createUseContextState('productionResults');
export const useClockResults = createUseContextState('clockResults');
export const useIsClockPaused = createUseContextState('isClockPaused');
export const useClockModalOpen = createUseContextState('clockModalOpen');
