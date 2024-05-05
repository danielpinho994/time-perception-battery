import { useEffect, useState } from 'react';
import {
  useGlobalStartTime,
  useGlobalResults,
  useGlobalModalOpen,
  useIsClockPaused,
  useClockModalOpen,
  useIsGlobalPaused,
} from '../AppContext';
import Timer from '../Timer';

export default function GlobalTest() {
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
            )}`.slice(-2)} : ${`0${Math.floor(
              (globalResults[0] / 1000) % 60,
            )}`.slice(-2)}` ?? ''}
      </div>
      <div className="result">
        {globalResults[1] === 0
          ? ''
          : `Resultado: ${globalResults[1]} minutos` ?? ''}
      </div>
    </div>
  );

  const editResultButton = (
    <button
      type="button"
      onClick={requestUserInput}
      disabled={
        globalModalOpen || clockModalOpen || !isGlobalPaused || !isClockPaused
      }
    >
      Alterar Resultado
    </button>
  );

  const userInputModal = (
    <div>
      {globalModalOpen && (
        <div className="modal">
          <h2 className="subtitle">Colocar resultado em minutos</h2>
          <input
            type="number"
            className="input-modal"
            value={userInput ?? undefined} // Handle controlled to uncontrolled warning
            onChange={(e) => setUserInput(Number(e.target.value))}
          />
          <button
            type="button"
            className="btn-submit"
            onClick={() => {
              if (userInput !== null) {
                setGlobalModalOpen(false);
                setResults([time, userInput]);
                setUserInput(null);
              }
            }}
          >
            Submeter
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setGlobalModalOpen(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="subtitle">Teste Global</h2>
      <div>{startStopButton}</div>
      <Timer time={time} />
      <div>{resultDiv}</div>
      <div>{editResultButton}</div>
      <div>{userInputModal}</div>
    </div>
  );
}
