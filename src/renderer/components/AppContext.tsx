import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from 'react';
import generateSequences from './TestSequenceGenerator';

// Define the shape of the data in your context state
interface IAppContextData {
  estimationSequences: number[];
  estimationResults: number[];
  productionSequences: number[];
  productionResults: number[];
  clockResults: [number, number];
  globalStartTime: number;
  globalResults: [number, number];
  isWaitingInput: boolean;
}

// Define the context state with update method included
interface IAppContext {
  data: IAppContextData;
  updateContext: (updatedValues: Partial<IAppContextData>) => void;
}

// Create the context object with a default value
const AppContext = createContext<IAppContext | null>(null);

// Custom hook for accessing context
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};

// Custom hook for specific context state and updater
const createUseContextState = <K extends keyof IAppContextData>(key: K) => {
  return (): [IAppContextData[K], (newValue: IAppContextData[K]) => void] => {
    const context = useAppContext();
    const setValue = useCallback(
      (newValue: IAppContextData[K]) => {
        context.updateContext({ [key]: newValue });
      },
      [context], // context is stable and doesn't change, so it's safe to omit from dependencies
    );
    return [context.data[key], setValue];
  };
};

// Exported custom hooks for each context property
export const useEstimationSequences = createUseContextState(
  'estimationSequences',
);
export const useEstimationResults = createUseContextState('estimationResults');
export const useProductionSequences = createUseContextState(
  'productionSequences',
);
export const useProductionResults = createUseContextState('productionResults');
export const useClockResults = createUseContextState('clockResults');
export const useGlobalStartTime = createUseContextState('globalStartTime');
export const useGlobalResults = createUseContextState('globalResults');
export const useIsWaitingInput = createUseContextState('isWaitingInput');

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define the data part of the state
  const [contextData, setContextData] = useState<IAppContextData>({
    estimationSequences: generateSequences(),
    estimationResults: [],
    productionSequences: generateSequences(),
    productionResults: [],
    clockResults: [0, 0],
    globalStartTime: 0,
    globalResults: [0, 0],
    isWaitingInput: false,
  });
  // Use useCallback to memoize the updateContext function
  const updateContext = useCallback(
    (updatedValues: Partial<IAppContextData>) => {
      setContextData((prev) => ({ ...prev, ...updatedValues }));
    },
    [],
  );
  const contextValue: IAppContext = useMemo(
    () => ({
      data: contextData,
      updateContext,
    }),
    [contextData, updateContext],
  );
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

/*
export const resetContext = () => {
  setEstimationSequences(() => generateSequences());
  setEstimationResults([]);
  setProductionSequences(() => generateSequences());
  setProductionResults([]);
  setStartTime(0);
  setClockResults([0, 0]);
  setResults([0, 0]);
  setIsPaused(true);
};
*/
