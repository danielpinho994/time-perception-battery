import { useState, useEffect, useRef } from 'react';
import beepFile from '../../../../assets/beep.wav';
import StopWatch from '../common/StopWatch';
import { useProductionResults, useProductionSequences } from '../AppContext';
import MainMenuButton from './MainMenuButton';
import EditableTable from '../common/Table';

export default function ProductionTest() {
  const [productionSequences] = useProductionSequences();
  const [productionResults, setResults] = useProductionResults();

  const [isReset, setIsReset] = useState(false);
  const [isResultsFull, setisResultsFull] = useState(
    productionResults.length === 9,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isEditable, setEditable] = useState(false);
  const [isTrialInterval, setIsTrialInterval] = useState(
    productionResults.length === 0,
  );
  const [intervalTitle, setIntervalTitle] = useState('');
  const beepSound = useRef<HTMLAudioElement>(new Audio(beepFile));

  // set interval title
  useEffect(() => {
    let nextInterval = productionResults.length + 1;

    if (nextInterval === 10) {
      setisResultsFull(true);
      nextInterval = 9;
    }

    if (productionResults.length !== 0) setIsTrialInterval(false);

    if (isTrialInterval)
      setIntervalTitle('Intervalo de Experimentação: 4 segundos');
    else {
      const nextIntervalTime = productionSequences[nextInterval - 1] / 1000;
      setIntervalTitle(
        `Intervalo ${nextInterval}: ${nextIntervalTime} segundos`,
      );
    }
  }, [productionResults, productionSequences, isTrialInterval]);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      const startTime = performance.now();
      interval = setInterval(() => {
        setTime(performance.now() - startTime);
      }, 1000);
    } else clearInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    if (!isRunning)
      beepSound.current.play(); // playing sound should have top priority
    else setIsReset(true);
    setIsRunning(!isRunning);
  };

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={isEditable}
    >
      {isRunning ? 'Parar' : 'Começar'}
    </button>
  );

  const handleReset = () => {
    setTime(0);
    if (productionResults.length === 9) {
      const newResults = productionResults;
      newResults.pop();
      setResults(newResults);
      if (newResults.length !== 9) setisResultsFull(false);
    }
    setIsReset(false);
  };

  const handleSave = () => {
    setTime(0);
    if (isTrialInterval) setIsTrialInterval(false);
    else {
      const newResults = [...productionResults, Math.floor(time / 1000)];
      setResults(newResults);
      if (newResults.length !== 9) setisResultsFull(false);
    }
    setIsReset(false);
  };

  const resetButtons = (
    <div>
      <button
        type="button"
        className="btn-submit"
        onClick={handleSave}
        disabled={isResultsFull || isEditable}
      >
        {isTrialInterval || isResultsFull
          ? 'Próximo intervalo'
          : 'Guardar intervalo'}
      </button>

      <button
        type="button"
        className="btn-cancel"
        onClick={handleReset}
        disabled={isEditable}
      >
        Repetir intervalo
      </button>
    </div>
  );

  return (
    <div>
      <h1>Teste de Produção</h1>
      <h2>{intervalTitle}</h2>

      <StopWatch
        startStopButton={
          isReset || isResultsFull ? resetButtons : startStopButton
        }
        time={time}
      />

      <EditableTable
        sequences={productionSequences}
        results={productionResults}
        setResults={setResults}
        isEditable={isEditable}
        setEditable={setEditable}
        editButtonDisabled={isRunning || isReset}
      />

      <MainMenuButton disabled={isRunning || isEditable || isReset} />
    </div>
  );
}
