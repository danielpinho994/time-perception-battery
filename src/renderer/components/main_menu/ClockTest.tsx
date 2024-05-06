import { useState, useEffect } from 'react';
import Timer from '../common/Timer';
import {
  useClockResults,
  useIsClockRunning,
  useGlobalModalOpen,
  useClockModalOpen,
} from '../AppContext';
import ResultInputModal from '../common/ResultInputModal';

export default function ClockTest() {
  const [globalModalOpen] = useGlobalModalOpen();
  const [clockResults, setResults] = useClockResults();
  const [isClockRunning, setIsClockRunning] = useIsClockRunning();
  const [clockModalOpen, setClockModalOpen] = useClockModalOpen();

  const [time, setTime] = useState(0);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isClockRunning) {
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
  }, [isClockRunning]);

  const handleStartStop = () => {
    if (!isClockRunning) {
      setClockModalOpen(true);
    }
    setIsClockRunning(!isClockRunning);
  };

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={globalModalOpen || clockModalOpen}
    >
      {isClockRunning ? 'Começar' : 'Parar'}
    </button>
  );

  const saveResult = (input: number) => {
    setResults([time === 0 ? clockResults[0] : time, input]);
  };

  return (
    <div className="level">
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

      <button
        type="button"
        onClick={async () => setClockModalOpen(true)}
        disabled={globalModalOpen || clockModalOpen || isClockRunning}
      >
        Alterar Resultado
      </button>

      <ResultInputModal
        isModalOpen={clockModalOpen}
        setModalOpen={setClockModalOpen}
        setTime={setTime}
        saveResult={saveResult}
      />
    </div>
  );
}
