import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Timer from './Timer';

function Clock() {
  // --- PERSISTANT CONTEXT --- //
  const navigate = useNavigate();
  const location = useLocation();
  const [estimationSequences] = useState<number[]>(
    location.state.estimationSequences,
  );
  const [estimationResults] = useState<number[]>(
    location.state.estimationResults,
  );
  const [productionSequences] = useState<number[]>(
    location.state.productionSequences,
  );
  const [productionResults] = useState<number[]>(
    location.state.productionResults,
  );
  const [clockResults, setResults] = useState<[number, number]>(
    location.state.clockResults,
  );
  const [globalStartTime] = useState<number>(location.state.globalStartTime);
  const [globalResults] = useState<[number, number]>(
    location.state.globalResults,
  );

  const goToMainMenu = () => {
    navigate('/', {
      state: {
        estimationSequences,
        estimationResults,
        productionSequences,
        productionResults,
        clockResults,
        globalStartTime,
        globalResults,
      },
    });
  };

  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [isWaitingInput, setWaitingInput] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userInput, setUserInput] = useState<number | null>(null);

  const requestUserInput = async () => {
    setWaitingInput(true);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) {
      setUserInput(null);
      setWaitingInput(false);
    }
  }, [modalOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isPaused) {
      // start stop watch
      const startTime = performance.now();
      interval = setInterval(() => {
        setTime(performance.now() - startTime);
      }, 10);
    } else {
      // stop stop watch
      clearInterval(interval);
    }

    return () => {
      // Clearing interval on unmount or if paused
      clearInterval(interval);
    };
  }, [isPaused]);

  const handleStartStop = () => {
    if (!isPaused) {
      requestUserInput();
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
      <h1 className="title">Teste do Relógio </h1>

      <div>{StartStopButton}</div>
      <Timer time={time} />
      <div className="result">
        {clockResults[0] === 0
          ? ''
          : `Tempo decorrido: ${`0${Math.floor(
              (clockResults[0] / 60000) % 60,
            )}`.slice(-2)} : ${`0${Math.floor(
              (clockResults[0] / 1000) % 60,
            )}`.slice(-2)}` ?? ''}
      </div>
      <div className="result">
        {clockResults[1] === 0
          ? ''
          : `Resultado: ${`0${Math.floor(
              (clockResults[1] / 60000) % 60,
            )}`.slice(-2)} : ${`0${Math.floor(
              (clockResults[1] / 1000) % 60,
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
        <button
          type="button"
          className="go-to-test"
          onMouseDown={goToMainMenu}
          disabled={isWaitingInput || !isPaused}
        >
          Voltar
        </button>
      </div>

      <div>
        {modalOpen && (
          <div className="modal">
            <h2 className="subtitle">Colocar resultado em segundos</h2>
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
                  setResults([time, userInput * 1000]);
                  setModalOpen(false);
                }
              }}
            >
              Submeter
            </button>
            <button
              type="button"
              className="btn-submit"
              onMouseDown={() => setModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clock;
