import { useEffect, useState } from 'react';
import {
  useGlobalStartTime,
  useGlobalResults,
  useGlobalModalOpen,
  useIsClockRunning,
  useClockModalOpen,
  useIsGlobalRunning,
} from '../AppContext';
import StopWatch from '../common/StopWatch';
import ResultInputModal from '../common/ResultInputModal';
import SingleClockResults from './SingleClockResults';
import InstructionsModal from '../common/InstructionsModal';

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

  const saveResult = (input: number) => {
    setResults([time === 0 ? globalResults[0] : time, input]);
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

  return (
    <div className="level">
      <h2>Teste Global</h2>

      <InstructionsModal
        buttonName="Instruções"
        instructionsString={`<p> No teste global avalia-se o tempo total da avaliação. </p>
                            <p> O participante não pode saber da existência deste teste. </p>
                            <p> Passos: </p>
                            <ol style="padding-left: 40px;">
                              <li> Informar participante que a avaliação vai começar </li>
                              <li> Começar cronómetro </li>
                              <li> Completar restantes testes (estimação, produção e relógio) </li>
                              <li> Parar cronómetro </li>
                              <li> Inserir tempo estimado pelo participante (depois de parar cronómetro, aparece automaticamente uma janela para introduzir resultado) </li>
                            </ol>`}
      />

      <StopWatch startStopButton={startStopButton} time={time} />

      <SingleClockResults
        results={globalResults}
        timeUnitString="minutos"
        setModalOpen={setGlobalModalOpen}
        editButtonDisabled={
          globalModalOpen || clockModalOpen || isGlobalRunning || isClockRunning
        }
      />
      <ResultInputModal
        isModalOpen={globalModalOpen}
        setModalOpen={setGlobalModalOpen}
        setTime={setTime}
        saveResult={saveResult}
        timeUnitString="minutos"
      />
    </div>
  );
}
