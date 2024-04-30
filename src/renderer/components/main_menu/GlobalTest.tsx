import { useEffect, useState } from 'react';
import {
  useGlobalStartTime,
  useGlobalResults,
  useModalOpen,
  useIsClockPaused,
} from '../AppContext';
import Timer from '../Timer';

export default function GlobalTest() {
  const [globalStartTime, setStartTime] = useGlobalStartTime();
  const [globalResults, setResults] = useGlobalResults();
  const [modalOpen, setModalOpen] = useModalOpen();
  const [isClockPaused] = useIsClockPaused();

  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [userInput, setUserInput] = useState<number | null>(null);

  const requestUserInput = async () => {
    setModalOpen(true);
  };

  // restart global clock after coming back to MainMenu
  useEffect(() => {
    if (isPaused && globalStartTime > 0) {
      setTime(performance.now() - globalStartTime);
      setIsPaused(false);
    }
  }, [globalStartTime, isPaused]);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isPaused) {
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
  }, [globalStartTime, isPaused, setStartTime]);

  const handleStartStop = () => {
    if (!isPaused) {
      requestUserInput();
      setStartTime(0);
    }
    setIsPaused(!isPaused);
  };

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={modalOpen || !isClockPaused}
    >
      {isPaused ? 'Começar' : 'Parar'}
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
          : `Resultado: ${`0${Math.floor(
              (globalResults[1] / 60000) % 60,
            )}`.slice(-2)} : ${`0${Math.floor(
              (globalResults[1] / 1000) % 60,
            )}`.slice(-2)}` ?? ''}
      </div>
    </div>
  );

  const editResultButton = (
    <button
      type="button"
      className="btn-change"
      onClick={requestUserInput}
      disabled={modalOpen || !isPaused || !isClockPaused}
    >
      Alterar Resultado
    </button>
  );

  const userInputModal = (
    <div>
      {modalOpen && (
        <div className="modal">
          <h2 className="subtitle">Colocar resultado em minutos</h2>
          <input
            type="number"
            className="result"
            value={userInput ?? undefined} // Handle controlled to uncontrolled warning
            onChange={(e) => setUserInput(Number(e.target.value))}
          />
          <button
            type="button"
            className="btn-submit"
            onClick={() => {
              if (userInput !== null) {
                setModalOpen(false);
                setResults([time, userInput * 1000 * 60]);
                setUserInput(null);
              }
            }}
          >
            Submeter
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={() => setModalOpen(false)}
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
