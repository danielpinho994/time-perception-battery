import { useState, useEffect } from 'react';
import StopWatch from '../common/StopWatch';
import {
  useClockResults,
  useIsClockRunning,
  useGlobalModalOpen,
  useClockModalOpen,
} from '../AppContext';
import ResultInputModal from '../common/ResultInputModal';
import SingleClockResults from './SingleClockResults';
import InstructionsModal from '../common/InstructionsModal';

export default function ClockTest() {
  const [globalModalOpen] = useGlobalModalOpen();
  const [clockResults, setResults] = useClockResults();
  const [isClockRunning, setIsClockRunning] = useIsClockRunning();
  const [clockModalOpen, setClockModalOpen] = useClockModalOpen();

  const [time, setTime] = useState(0);

  // stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isClockRunning) {
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
  }, [isClockRunning]);

  const handleStartStop = () => {
    if (isClockRunning) {
      setClockModalOpen(true);
    }
    setIsClockRunning(!isClockRunning);
  };

  const saveResult = (input: number) => {
    setResults([time === 0 ? clockResults[0] : time, input]);
  };

  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={globalModalOpen || clockModalOpen}
    >
      {isClockRunning ? 'Parar' : 'Começar'}
    </button>
  );

  return (
    <div className="level">
      <h2>Teste do Relógio </h2>

      <InstructionsModal
        buttonName="Instruções"
        instructionsString={`<p> No teste do relógio avalia-se a percepção temporal enquanto se desenha um relógio. </p>
                            <p> O participante não pode saber que o tempo está a ser cronometrado. </p>
                            <p> Passos: </p>
                            <ol style="padding-left: 40px;">
                              <li> Fornecer lápis e papel ao participante </li>
                              <li> Começar cronómetro </li>
                              <li> Parar cronómetro assim que o participante acabar de desenhar o relógio </li>
                              <li> Inserir tempo estimado pelo participante (depois de parar cronómetro, aparece automaticamente uma janela para introduzir resultado) </li>
                            </ol>`}
      />

      <StopWatch startStopButton={startStopButton} time={time} />

      <SingleClockResults
        results={clockResults}
        timeUnitString="segundos"
        setModalOpen={setClockModalOpen}
        editButtonDisabled={globalModalOpen || clockModalOpen || isClockRunning}
      />

      <ResultInputModal
        isModalOpen={clockModalOpen}
        setModalOpen={setClockModalOpen}
        setTime={setTime}
        saveResult={saveResult}
        timeUnitString="segundos"
      />
    </div>
  );
}
