import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import { useClockResults } from './AppContext';

function Clock() {
  const navigate = useNavigate();
  const [clockResults, setResults] = useClockResults();

  const goToMainMenu = () => {
    navigate('/');
  };

  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [userInput, setUserInput] = useState<number | null>(null);

  const requestUserInput = async () => {
    setModalOpen(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isPaused) {
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
      onClick={handleStartStop}
      disabled={modalOpen}
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
          onClick={requestUserInput}
          disabled={modalOpen || !isPaused}
        >
          Alterar Resultado
        </button>
      </div>

      <div>
        <button
          type="button"
          className="go-to-test"
          onClick={goToMainMenu}
          disabled={modalOpen || !isPaused}
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
              onClick={() => {
                if (userInput !== null) {
                  setResults([time, userInput * 1000]);
                  setModalOpen(false);
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
    </div>
  );
}

export default Clock;
