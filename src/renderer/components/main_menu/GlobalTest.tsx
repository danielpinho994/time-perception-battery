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

  return (
    <div className="level">
      <h2>Teste Global</h2>

      <InstructionsModal
        instructionsString="No teste global pretende-se avaliar a percepção temporal a uma
            escala mais ampla, ao medir o tempo total de duração do conjunto de
            todos os testes. Antes de iniciar o teste, o paciente deve ser
            avisado de que o teste irá começar."
      />

      <StopWatch
        handleStartStop={handleStartStop}
        buttonDisabled={globalModalOpen || clockModalOpen || isClockRunning}
        isRunning={isGlobalRunning}
        isReset={false}
        resetButtons={null}
        time={time}
      />
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
