import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import beepFile from '../../../../assets/beep.wav';
import Timer from '../Timer';
import { useProductionResults, useProductionSequences } from '../AppContext';

export default function ProductionTest() {
  const navigate = useNavigate();
  const [productionSequences] = useProductionSequences();
  const [productionResults, setResults] = useProductionResults();

  const goToMainMenu = () => {
    navigate('/');
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

  // set interval title
  useEffect(() => {
    const nextInterval = productionResults.length + 1;

    if (nextInterval === 10) {
      setCanStart(false);
      return;
    }

    const nextIntervalTime = productionSequences[nextInterval - 1] / 1000;
    if (isTrialInterval)
      setIntervalTitle('Intervalo de Experimentação: 4 segundos');
    else
      setIntervalTitle(
        `Intervalo ${nextInterval}: ${nextIntervalTime} segundos`,
      );
  }, [productionResults, productionSequences, isTrialInterval]);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isPaused) {
      const startTime = performance.now();
      interval = setInterval(() => {
        setTime(performance.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
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
    else {
      const newResults = [...productionResults, Math.floor(time / 1000)];
      setResults(newResults);
    }
    setIsReady(true);
  };

  const StartStopButton = (
    <button
      type="button"
      className="btn btn-one btn-start"
      onClick={handleStartStop}
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
        onClick={handleSave}
        disabled={isEditable}
      >
        {isTrialInterval ? 'Próximo intervalo' : 'Guardar intervalo'}
      </button>
      <button
        type="button"
        className="btn btn-two"
        onClick={handleReset}
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

  const onEditable = (
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
            onInput={(e) => onEditable(index, e)}
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
            onInput={(e) => onEditable(index + productionResults.length, e)}
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
        onClick={goToMainMenu}
        disabled={!isPaused || isEditable || !isReady}
      >
        Voltar
      </button>

      <button
        type="button"
        onClick={toggleEditable}
        disabled={!isPaused || !isReady}
      >
        {isEditable ? 'Guardar Tabela' : 'Ativar Edição'}
      </button>
    </div>
  );
}
