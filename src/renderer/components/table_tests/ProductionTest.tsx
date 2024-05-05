import { useState, useEffect, useRef } from 'react';
import beepFile from '../../../../assets/beep.wav';
import Timer from '../common/Timer';
import { useProductionResults, useProductionSequences } from '../AppContext';
import Table, { MainMenuButton, EditResultsButton } from './CommonTableTests';

export default function ProductionTest() {
  const [productionSequences] = useProductionSequences();
  const [productionResults, setResults] = useProductionResults();

  const [isReady, setIsReady] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isEditable, setEditable] = useState(false);
  const [isTrialInterval, setIsTrialInterval] = useState(
    productionResults.length === 0,
  );
  const [intervalTitle, setIntervalTitle] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const beepSound = useRef<HTMLAudioElement>(new Audio(beepFile));

  // set interval title
  useEffect(() => {
    let nextInterval = productionResults.length + 1;

    if (nextInterval === 10) {
      setLimitReached(true);
      nextInterval = 9;
    } else setLimitReached(false);

    const nextIntervalTime = productionSequences[nextInterval - 1] / 1000;
    if (isTrialInterval)
      setIntervalTitle('Intervalo de Experimentação: 4 segundos');
    else
      setIntervalTitle(
        `Intervalo ${nextInterval}: ${nextIntervalTime} segundos`,
      );
  }, [productionResults, productionSequences, isTrialInterval]);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      const startTime = performance.now();
      interval = setInterval(() => {
        setTime(performance.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    beepSound.current.play();
    if (isRunning) setIsReady(true);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTime(0);
    setIsReady(true);
  };

  const handleSave = () => {
    setTime(0);
    if (isTrialInterval) setIsTrialInterval(false);
    else {
      const newResults = [...productionResults, Math.floor(time / 1000)];
      setResults(newResults);
    }
    setIsReady(true);
  };

  const StartStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={limitReached || isEditable}
    >
      {isRunning ? 'Parar' : 'Começar'}
    </button>
  );

  const ResetButtons = (
    <div>
      <button
        type="button"
        className="btn-submit"
        onClick={handleSave}
        disabled={isEditable}
      >
        {isTrialInterval ? 'Próximo intervalo' : 'Guardar intervalo'}
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
      <div>{isReady ? StartStopButton : ResetButtons}</div>
      <Timer time={time} />

      <Table
        sequences={productionSequences}
        results={productionResults}
        setResults={setResults}
        isEditable={isEditable}
      />

      <MainMenuButton disabled={isRunning || isEditable || !isReady} />
      <EditResultsButton
        disabled={isRunning || !isReady}
        isEditable={isEditable}
        results={productionResults}
        setResults={setResults}
        setEditable={setEditable}
      />
    </div>
  );
}
