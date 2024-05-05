/* eslint-disable no-plusplus */
import { useState, useEffect, useRef } from 'react';
import { useEstimationSequences, useEstimationResults } from '../AppContext';
import beepFile from '../../../../assets/beep.wav';
import Timer from '../common/Timer';
import Table, { MainMenuButton, EditResultsButton } from './CommonTableTests';
import UserInputModal from '../common/UserInputModal';

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
  const beepSound = useRef<HTMLAudioElement>(new Audio(beepFile));
  const [isEditable, setEditable] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [userInput, setUserInput] = useState<number | null>(null);

  const requestUserInput = async () => {
    setModalOpen(true);
  };

  // set interval title
  useEffect(() => {
    let nextInterval = estimationResults.length + 1;

    if (nextInterval === 10) {
      setLimitReached(true);
      nextInterval = 9;
    } else setLimitReached(false);

    const nextIntervalTime = estimationSequences[nextInterval - 1] / 1000;
    if (isTrialInterval)
      setIntervalTitle('Intervalo de Experimentação: 4 segundos');
    else
      setIntervalTitle(
        `Intervalo ${nextInterval}: ${nextIntervalTime} segundos`,
      );
  }, [estimationResults, estimationSequences, isTrialInterval]);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      const startTime = performance.now();
      interval = setInterval(() => {
        setTime(() => {
          const currTime = performance.now() - startTime;
          const limit = isTrialInterval
            ? 4000
            : estimationSequences[estimationResults.length];

          if (currTime >= limit) {
            clearInterval(interval);
            beepSound.current.play();
            setIsRunning(false);
            if (!isTrialInterval) requestUserInput();
            else setWaitingNonModalInput(true);
            return limit;
          }
          return currTime;
        });
      }, 1000);
    }
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

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={limitReached || modalOpen || isEditable}
    >
      {isRunning ? 'Parar' : 'Começar'}
    </button>
  );

  const acceptTrialInterval = () => {
    setTime(0);
    setWaitingNonModalInput(false);
    setIsTrialInterval(false);
  };

  const cancelInterval = () => {
    setTime(0);
    setWaitingNonModalInput(false);
  };

  // used when any interval is stopped before reaching the time limit or when trial interval finishes
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

  const cancelUserInput = () => {
    setModalOpen(false);
    setUserInput(null);
    setTime(0);
  };

  const saveUserInput = () => {
    const input = userInput ?? 0;
    const newResults = [...estimationResults, input];
    setResults(newResults);
    cancelUserInput();
  };

  return (
    <div>
      <h1>Teste de Estimação</h1>
      <h2>{intervalTitle}</h2>
      <div>{waitingNonModalInput ? nonUserInputButtons : startStopButton}</div>
      <Timer time={time} />

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

      <UserInputModal
        isModalOpen={modalOpen}
        userInput={userInput}
        setUserInput={setUserInput}
        saveUserInput={saveUserInput}
        cancelUserInput={cancelUserInput}
      />
    </div>
  );
}
