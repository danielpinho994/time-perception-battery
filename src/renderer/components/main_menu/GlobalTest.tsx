import { useEffect, useState } from 'react';
import {
  useGlobalStartTime,
  useGlobalResults,
  useGlobalModalOpen,
  useIsClockRunning,
  useClockModalOpen,
  useIsGlobalRunning,
} from '../AppContext';
import Timer from '../common/Timer';
import ResultInputModal from '../common/ResultInputModal';

export default function GlobalTest() {
  const [globalStartTime, setStartTime] = useGlobalStartTime();
  const [globalResults, setResults] = useGlobalResults();
  const [globalModalOpen, setGlobalModalOpen] = useGlobalModalOpen();
  const [isGlobalRunning, setIsGlobalRunning] = useIsGlobalRunning();
  const [isClockRunning] = useIsClockRunning();
  const [clockModalOpen] = useClockModalOpen();

  const [time, setTime] = useState(0);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isGlobalRunning) {
      if (globalStartTime === 0) {
        setStartTime(performance.now());
      }
      interval = setInterval(() => {
        setTime(performance.now() - globalStartTime);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [globalStartTime, isGlobalRunning, setStartTime]);

  const handleStartStop = () => {
    if (isGlobalRunning) {
      setGlobalModalOpen(true);
      setStartTime(0);
    }
    setIsGlobalRunning(!isGlobalRunning);
  };

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={globalModalOpen || clockModalOpen || isClockRunning}
    >
      {isGlobalRunning ? 'Parar' : 'Começar'}
    </button>
  );

  const resultDiv = (
    <div>
      <div className="result">
        {globalResults[0] === 0
          ? ''
          : `Tempo decorrido: ${`0${Math.floor(
              (globalResults[0] / 60000) % 60,
            )}`.slice(-2)}:${`0${Math.floor(
              (globalResults[0] / 1000) % 60,
            )}`.slice(-2)}` ?? ''}
      </div>
      <div className="result">
        {globalResults[1] === 0
          ? ''
          : `Resultado: ${globalResults[1]} ${
              globalResults[1] === 1 ? 'minuto' : 'minutos'
            }` ?? ''}
      </div>
    </div>
  );

  const editResultButton = (
    <button
      type="button"
      onClick={async () => setGlobalModalOpen(true)}
      disabled={
        globalModalOpen || clockModalOpen || isGlobalRunning || isClockRunning
      }
    >
      Alterar Resultado
    </button>
  );

  const saveResult = (input: number) => {
    setResults([time === 0 ? globalResults[0] : time, input]);
  };

  return (
    <div className="level">
      <h2>Teste Global</h2>
      <div>{startStopButton}</div>
      <Timer time={time} />
      <div>{resultDiv}</div>
      <div>{editResultButton}</div>

      <ResultInputModal
        isModalOpen={globalModalOpen}
        setModalOpen={setGlobalModalOpen}
        setTime={setTime}
        saveResult={saveResult}
      />
    </div>
  );
}
