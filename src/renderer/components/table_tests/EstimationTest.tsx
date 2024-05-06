/* eslint-disable no-plusplus */
import { useState, useEffect, useRef } from 'react';
import { useEstimationSequences, useEstimationResults } from '../AppContext';
import beepFile from '../../../../assets/beep.wav';
import StopWatch from '../common/StopWatch';
import Table from '../common/Table';
import ResultInputModal from '../common/ResultInputModal';
import { MainMenuButton, EditResultsButton } from '../common/CommonButtons';

export default function EstimationTest() {
  const [estimationSequences] = useEstimationSequences();
  const [estimationResults, setResults] = useEstimationResults();

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isTrialInterval, setIsTrialInterval] = useState(
    estimationResults.length === 0,
  );
  const [waitingNonModalInput, setWaitingNonModalInput] = useState(false);
  const [intervalTitle, setIntervalTitle] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const beepSound = useRef<HTMLAudioElement>(new Audio(beepFile));

  // set interval title
  useEffect(() => {
    let nextInterval = estimationResults.length + 1;

    if (nextInterval === 10) {
      setLimitReached(true);
      nextInterval = 9;
    } else setLimitReached(false);

    if (isTrialInterval)
      setIntervalTitle('Intervalo de Experimentação: 4 segundos');
    else {
      const nextIntervalTime = estimationSequences[nextInterval - 1] / 1000;
      setIntervalTitle(
        `Intervalo ${nextInterval}: ${nextIntervalTime} segundos`,
      );
    }
  }, [estimationResults, estimationSequences, isTrialInterval]);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      const startTime = performance.now();
      const limit = isTrialInterval
        ? 4000
        : estimationSequences[estimationResults.length];

      interval = setInterval(() => {
        const currTime = performance.now() - startTime;
        setTime(() => {
          if (currTime >= limit) {
            beepSound.current.play();
            setIsRunning(false);
            if (!isTrialInterval) setModalOpen(true);
            else setWaitingNonModalInput(true);
            return limit;
          }
          return currTime;
        });
      }, 1000);
    } else clearInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [
    estimationResults.length,
    estimationSequences,
    isRunning,
    isTrialInterval,
  ]);

  const handleStartStop = () => {
    beepSound.current.play();
    if (isRunning) setWaitingNonModalInput(true);
    setIsRunning(!isRunning);
  };

  const cancelInterval = () => {
    setTime(0);
    setWaitingNonModalInput(false);
  };

  const acceptTrialInterval = () => {
    setIsTrialInterval(false);
    cancelInterval();
  };

  // used when any interval is stopped before reaching the time limit
  // or when trial interval finishes (waitingNonModalInput)
  const nonUserInputButtons = (
    <div>
      {isTrialInterval && (
        <button
          type="button"
          className="btn-submit"
          onClick={acceptTrialInterval}
          disabled={isEditable}
        >
          Próximo intervalo
        </button>
      )}

      <button
        type="button"
        className="btn-cancel"
        onClick={cancelInterval}
        disabled={isEditable}
      >
        Cancelar Intervalo
      </button>
    </div>
  );

  const saveResult = (input: number) => {
    const newResults = [...estimationResults, input];
    setResults(newResults);
  };

  return (
    <div>
      <h1>Teste de Estimação</h1>
      <h2>{intervalTitle}</h2>
      <StopWatch
        handleStartStop={handleStartStop}
        buttonDisabled={limitReached || modalOpen || isEditable}
        isRunning={isRunning}
        isReset={waitingNonModalInput}
        resetButtons={nonUserInputButtons}
        time={time}
      />

      <Table
        sequences={estimationSequences}
        results={estimationResults}
        setResults={setResults}
        isEditable={isEditable}
      />

      <MainMenuButton
        disabled={isRunning || isEditable || modalOpen || waitingNonModalInput}
      />
      <EditResultsButton
        disabled={isRunning || modalOpen || waitingNonModalInput}
        isEditable={isEditable}
        results={estimationResults}
        setResults={setResults}
        setEditable={setEditable}
      />

      <ResultInputModal
        isModalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setTime={setTime}
        saveResult={saveResult}
      />
    </div>
  );
}
