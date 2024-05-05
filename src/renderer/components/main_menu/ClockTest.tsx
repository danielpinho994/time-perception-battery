import { useState, useEffect } from 'react';
import Timer from '../common/Timer';
import {
  useClockResults,
  useIsClockPaused,
  useGlobalModalOpen,
  useClockModalOpen,
} from '../AppContext';
import UserInputModal from '../common/UserInputModal';

export default function Clock({ className }) {
  const [globalModalOpen] = useGlobalModalOpen();
  const [clockResults, setResults] = useClockResults();
  const [isClockPaused, setIsClockPaused] = useIsClockPaused();
  const [clockModalOpen, setClockModalOpen] = useClockModalOpen();

  const [time, setTime] = useState(0);
  const [userInput, setUserInput] = useState<number | null>(null);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isClockPaused) {
      // start stop watch
      const startTime = performance.now();
      interval = setInterval(() => {
        setTime(performance.now() - startTime);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isClockPaused]);

  const handleStartStop = () => {
    if (!isClockPaused) {
      requestUserInput();
    }
    setIsClockPaused(!isClockPaused);
  };

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={globalModalOpen || clockModalOpen}
    >
      {isClockPaused ? 'Começar' : 'Parar'}
    </button>
  );

  const cancelUserInput = () => {
    setClockModalOpen(false);
    setUserInput(null);
    setTime(0);
  };

  const saveUserInput = () => {
    const input = userInput ?? 0;
    setResults([time === 0 ? clockResults[0] : time, input]);
    cancelUserInput();
  };

  return (
    <div className={className}>
      <h2>Teste do Relógio </h2>
      <div>{startStopButton}</div>
      <Timer time={time} />

      <div className="result">
        {clockResults[0] === 0
          ? ''
          : `Tempo decorrido: ${`0${Math.floor(
              (clockResults[0] / 60000) % 60,
            )}`.slice(-2)}:${`0${Math.floor(
              (clockResults[0] / 1000) % 60,
            )}`.slice(-2)}` ?? ''}
      </div>
      <div className="result">
        {clockResults[1] === 0
          ? ''
          : `Resultado: ${clockResults[1]} segundos` ?? ''}
      </div>

      <div>
        <button
          type="button"
          onClick={async () => setClockModalOpen(true)}
          disabled={globalModalOpen || clockModalOpen || !isClockPaused}
        >
          Alterar Resultado
        </button>
      </div>

      <UserInputModal
        isModalOpen={clockModalOpen}
        userInput={userInput}
        setUserInput={setUserInput}
        saveUserInput={saveUserInput}
        cancelUserInput={cancelUserInput}
      />
    </div>
  );
}
