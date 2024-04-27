import { useEffect, useRef, useState } from 'react';
import {
  useGlobalStartTime,
  useGlobalResults,
  useIsWaitingInput,
} from './AppContext';
import Timer from './Timer';

export default function GlobalTest() {
  const [globalStartTime, setStartTime] = useGlobalStartTime();
  const [globalResults, setResults] = useGlobalResults();
  const [isWaitingInput, setWaitingInput] = useIsWaitingInput();

  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const timeResult = useRef(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [userInput, setUserInput] = useState<number | null>(null);

  const requestUserInput = async () => {
    setWaitingInput(true);
    setModalOpen(true);
  };

  // restart global clock after coming back to MainMenu
  useEffect(() => {
    if (isPaused && globalStartTime > 0) {
      setTime(performance.now() - globalStartTime);
      setIsPaused(false);
    }
  }, [globalStartTime, isPaused]);

  // set global test result after modal is closed
  useEffect(() => {
    if (!modalOpen) {
      if (userInput !== null) {
        setResults([timeResult.current, userInput * 1000 * 60]);
        setUserInput(null);
      }
    }
  }, [modalOpen, setResults, userInput]);

  // global stopwatch
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
      timeResult.current = time;
      requestUserInput();
      setStartTime(0);
    }
    setIsPaused(!isPaused);
  };

  const StartStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onMouseDown={handleStartStop}
      disabled={isWaitingInput}
    >
      {isPaused ? 'Começar' : 'Parar'}
    </button>
  );

  return (
    <div>
      <h2 className="subtitle">Teste Global</h2>
      <div>{StartStopButton}</div>
      <Timer time={time} />

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

      <div>
        <button
          type="button"
          className="btn-change"
          onMouseDown={requestUserInput}
          disabled={isWaitingInput || !isPaused}
        >
          Alterar Resultado
        </button>
      </div>

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
              onMouseDown={() => {
                if (userInput !== null) {
                  setModalOpen(false);
                  setWaitingInput(false);
                }
              }}
            >
              Submeter
            </button>
            <button
              type="button"
              className="btn-submit"
              onMouseDown={() => {
                setModalOpen(false);
                setWaitingInput(false);
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
