/* eslint-disable no-plusplus */
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimationSequences, useEstimationResults } from './AppContext';
import beepFile from '../../../assets/beep.wav';
import Timer from './Timer';

function EstimationTest() {
  const navigate = useNavigate();
  const [estimationSequences] = useEstimationSequences();
  const [estimationResults, setResults] = useEstimationResults();

  const goToMainMenu = () => {
    navigate('/');
  };

  const [isReady, setIsReady] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [isEditable, setEditable] = useState(false);
  const [isTrialInterval, setIsTrialInterval] = useState(
    estimationResults.length === 0,
  );
  const [intervalTitle, setIntervalTitle] = useState('');
  const [canStart, setCanStart] = useState(true);
  const beepSound = useRef<HTMLAudioElement>(new Audio(beepFile));

  const [isWaitingInput, setWaitingInput] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userInput, setUserInput] = useState<number | null>(null);

  const requestUserInput = async () => {
    setWaitingInput(true);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) {
      if (userInput !== null) {
        const newResults = [...estimationResults, userInput];
        setResults(newResults);
        setUserInput(null);
      }
      setWaitingInput(false);
      setIsReady(true);
      setTime(0);
    }
  }, [modalOpen, userInput, setResults, estimationResults]);

  useEffect(() => {
    const nextInterval = estimationResults.length + 1;

    if (nextInterval === 10) {
      setCanStart(false);
      return;
    }

    const nextIntervalTime = estimationSequences[nextInterval - 1] / 1000;
    if (isTrialInterval)
      setIntervalTitle('Intervalo de Experimentação: 4 segundos');
    else
      setIntervalTitle(
        `Intervalo ${nextInterval}: ${nextIntervalTime} segundos`,
      );
  }, [estimationResults, estimationSequences, isTrialInterval]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isPaused) {
      // start stop watch
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
            setIsPaused(true);
            setIsReady(false);
            if (!isTrialInterval) requestUserInput();
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
    isPaused,
    isTrialInterval,
  ]);

  const handleStartStop = () => {
    beepSound.current.play();
    if (!isPaused) setIsReady(false);
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTime(0);
    setIsReady(true);
  };

  const handleFirstInterval = () => {
    setTime(0);
    setIsTrialInterval(false);
    setIsReady(true);
  };

  const StartStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onMouseDown={handleStartStop}
      disabled={!canStart || isWaitingInput || isEditable}
    >
      {isPaused ? 'Começar' : 'Parar'}
    </button>
  );

  const ResetButtons = (
    <div>
      {isTrialInterval && (
        <button
          type="button"
          className="btn btn-two"
          onMouseDown={handleFirstInterval}
          disabled={isEditable}
        >
          Próximo intervalo
        </button>
      )}
      <button
        type="button"
        className="btn btn-two"
        onMouseDown={handleReset}
        disabled={isWaitingInput || isEditable}
      >
        Repetir Intervalo
      </button>
    </div>
  );

  const toggleEditable = () => {
    if (isEditable) {
      // resolve empty cells after editing table
      const isPositiveNumber = (value: any): value is number =>
        typeof value === 'number' && value > 0;
      const transformedArray = estimationResults.reduceRight<number[]>(
        (accumulator, current) => {
          if (isPositiveNumber(current)) {
            accumulator.unshift(current);
          } else if (accumulator.length > 0) {
            accumulator.unshift(0);
          }
          return accumulator;
        },
        [],
      );
      setResults(transformedArray);
    }
    setEditable(!isEditable);
  };

  const onEditResult = (
    index: number,
    event: FormEvent<HTMLTableCellElement>,
  ) => {
    const updatedResults = [...estimationResults];
    const value = event.currentTarget.textContent; // Assuming the content is text only
    // Attempt to convert the edited content to a number.
    updatedResults[index] = value ? parseInt(value, 10) : 0; // You may need more complex validation
    setResults(updatedResults);
  };

  const Table = (
    <table className="table-results">
      <tr>
        <td>Intervalo</td>
        {estimationSequences.map((_, index) => (
          <td key={`interval-${index + 1}`}>{index + 1}</td>
        ))}
      </tr>
      <tr>
        <td>Segundos</td>
        {estimationSequences.map((sequence, index) => (
          <td key={`seconds-${index + 1}`}>{sequence / 1000}</td>
        ))}
      </tr>
      <tr>
        <td>Resultado</td>
        {estimationResults.map((result, index) => (
          <td
            key={`result-${index + 1}`}
            contentEditable={isEditable}
            onInput={(e) => onEditResult(index, e)}
          >
            {result}
          </td>
        ))}
        {[...Array(9 - estimationResults.length)].map((_, index) => (
          <td
            key={`empty-${index + estimationResults.length + 1}`}
            contentEditable={
              isEditable &&
              index + estimationResults.length === estimationResults.length
            }
            onInput={(e) => onEditResult(index + estimationResults.length, e)}
          />
        ))}
      </tr>
    </table>
  );

  return (
    <div>
      <h1>Teste de Estimação</h1>
      <h3>{intervalTitle}</h3>

      <div>
        {modalOpen && (
          <div className="modal">
            <h2>Colocar resultado</h2>
            <input
              type="number"
              value={userInput ?? undefined}
              onChange={(e) => setUserInput(Number(e.target.value))}
            />
            <button
              type="button"
              onMouseDown={() => {
                if (userInput !== null) {
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

      <div>{isReady ? StartStopButton : ResetButtons}</div>
      <Timer time={time} />

      <div>{Table}</div>

      <button
        type="button"
        onMouseDown={goToMainMenu}
        disabled={!isPaused || isEditable || isWaitingInput || !isReady}
      >
        Voltar
      </button>

      <button
        type="button"
        onMouseDown={toggleEditable}
        disabled={!isPaused || isWaitingInput || !isReady}
      >
        {isEditable ? 'Guardar Tabela' : 'Ativar Edição'}
      </button>
    </div>
  );
}

export default EstimationTest;
