/* eslint-disable no-plusplus */
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import beepFile from '../../../assets/beep.wav';
import Timer from './Timer';

function ProductionTest() {
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
  const [productionResults, setResults] = useState<number[]>(
    location.state.productionResults,
  );
  const [clockResults] = useState<[number, number]>(
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

  const [isReady, setIsReady] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [isEditable, setEditable] = useState(false);
  const [isTrialInterval, setIsTrialInterval] = useState(
    productionResults.length === 0,
  );
  const [intervalTitle, setIntervalTitle] = useState('');
  const [canStart, setCanStart] = useState(true);
  const beepSound = useRef<HTMLAudioElement>(new Audio(beepFile));

  useEffect(() => {
    const nextInterval = productionResults.length + 1;

    // check limit 9 intervals
    if (nextInterval === 10) {
      setCanStart(false);
      return;
    }

    // change interval title
    const nextIntervalTime = productionSequences[nextInterval - 1] / 1000;
    if (isTrialInterval)
      setIntervalTitle('Intervalo de Experimentação: 4 segundos');
    else
      setIntervalTitle(
        `Intervalo ${nextInterval}: ${nextIntervalTime} segundos`,
      );
  }, [productionResults, productionSequences, isTrialInterval]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isPaused) {
      // start stop watch
      const startTime = performance.now();
      interval = setInterval(() => {
        setTime(performance.now() - startTime);
      }, 1000);
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
    beepSound.current.play();
    if (!isPaused) setIsReady(false);
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTime(0);
    setIsReady(true);
  };

  const handleSave = () => {
    setTime(0);
    if (isTrialInterval) setIsTrialInterval(false);
    else
      setResults((prevResults) => [
        ...prevResults,
        Math.floor((time / 1000) % 60),
      ]);
    setIsReady(true);
  };

  const StartStopButton = (
    <button
      type="button"
      className="btn btn-one btn-start"
      onMouseDown={handleStartStop}
      disabled={!canStart || isEditable}
    >
      {isPaused ? 'Começar' : 'Parar'}
    </button>
  );

  const ResetButtons = (
    <div>
      <button
        type="button"
        className="btn btn-one"
        onMouseDown={handleSave}
        disabled={isEditable}
      >
        {isTrialInterval ? 'Próximo intervalo' : 'Guardar intervalo'}
      </button>
      <button
        type="button"
        className="btn btn-two"
        onMouseDown={handleReset}
        disabled={isEditable}
      >
        Repetir intervalo
      </button>
    </div>
  );

  const toggleEditable = () => {
    if (isEditable) {
      // resolve empty cells after editing table
      const isPositiveNumber = (value: any): value is number =>
        typeof value === 'number' && value > 0;
      const transformedArray = productionResults.reduceRight<number[]>(
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

  const onResultChange = (
    index: number,
    event: FormEvent<HTMLTableCellElement>,
  ) => {
    const updatedResults = [...productionResults];
    const value = event.currentTarget.textContent; // Assuming the content is text only
    // Attempt to convert the edited content to a number.
    updatedResults[index] = value ? parseInt(value, 10) : 0; // You may need more complex validation
    setResults(updatedResults);
  };

  const Table = (
    <table className="table-results">
      <tr>
        <td>Intervalo</td>
        {productionSequences.map((_, index) => (
          <td key={`interval-${index + 1}`}>{index + 1}</td>
        ))}
      </tr>
      <tr>
        <td>Segundos</td>
        {productionSequences.map((sequence, index) => (
          <td key={`seconds-${index + 1}`}>{sequence / 1000}</td>
        ))}
      </tr>
      <tr>
        <td>Resultado</td>
        {productionResults.map((result, index) => (
          <td
            key={`result-${index + 1}`}
            contentEditable={isEditable}
            onInput={(e) => onResultChange(index, e)}
          >
            {result}
          </td>
        ))}
        {[...Array(9 - productionResults.length)].map((_, index) => (
          <td
            key={`empty-${index + productionResults.length + 1}`}
            contentEditable={
              isEditable &&
              index + productionResults.length === productionResults.length
            }
            onInput={(e) => onResultChange(index + productionResults.length, e)}
          />
        ))}
      </tr>
    </table>
  );

  return (
    <div>
      <h1>Teste de Produção</h1>
      <h3>{intervalTitle}</h3>

      <div>{isReady ? StartStopButton : ResetButtons}</div>
      <Timer time={time} />

      <div>{Table}</div>

      <button
        type="button"
        onMouseDown={goToMainMenu}
        disabled={!isPaused || isEditable || !isReady}
      >
        Voltar
      </button>

      <button
        type="button"
        onMouseDown={toggleEditable}
        disabled={!isPaused || !isReady}
      >
        {isEditable ? 'Guardar Tabela' : 'Ativar Edição'}
      </button>
    </div>
  );
}

export default ProductionTest;
