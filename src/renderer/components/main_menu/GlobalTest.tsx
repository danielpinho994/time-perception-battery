import { useEffect, useState } from 'react';
import {
  useGlobalStartTime,
  useGlobalResults,
  useGlobalModalOpen,
  useIsClockPaused,
  useClockModalOpen,
  useIsGlobalPaused,
} from '../AppContext';
import Timer from '../common/Timer';
import UserInputModal from '../common/UserInputModal';

export default function GlobalTest({ className }) {
  const [globalStartTime, setStartTime] = useGlobalStartTime();
  const [globalResults, setResults] = useGlobalResults();
  const [globalModalOpen, setGlobalModalOpen] = useGlobalModalOpen();
  const [isGlobalPaused, setIsGlobalPaused] = useIsGlobalPaused();
  const [isClockPaused] = useIsClockPaused();
  const [clockModalOpen] = useClockModalOpen();

  const [time, setTime] = useState(0);
  const [userInput, setUserInput] = useState<number | null>(null);

  const requestUserInput = async () => {
    setGlobalModalOpen(true);
  };

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isGlobalPaused) {
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
  }, [globalStartTime, isGlobalPaused, setStartTime]);

  const handleStartStop = () => {
    if (!isGlobalPaused) {
      requestUserInput();
      setStartTime(0);
    }
    setIsGlobalPaused(!isGlobalPaused);
  };

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={globalModalOpen || clockModalOpen || !isClockPaused}
    >
      {isGlobalPaused ? 'Começar' : 'Parar'}
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
        globalModalOpen || clockModalOpen || !isGlobalPaused || !isClockPaused
      }
    >
      Alterar Resultado
    </button>
  );

  const cancelUserInput = () => {
    setGlobalModalOpen(false);
    setUserInput(null);
    setTime(0);
  };

  const saveUserInput = () => {
    const input = userInput ?? 0;
    setResults([time === 0 ? globalResults[0] : time, input]);
    cancelUserInput();
  };

  return (
    <div className={className}>
      <h2>Teste Global</h2>
      <div>{startStopButton}</div>
      <Timer time={time} />
      <div>{resultDiv}</div>
      <div>{editResultButton}</div>
      <UserInputModal
        isModalOpen={globalModalOpen}
        userInput={userInput}
        setUserInput={setUserInput}
        saveUserInput={saveUserInput}
        cancelUserInput={cancelUserInput}
      />
    </div>
  );
}
