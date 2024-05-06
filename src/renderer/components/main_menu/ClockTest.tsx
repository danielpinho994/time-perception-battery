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

  return (
    <div className="level">
      <h2>Teste do Relógio </h2>

      <StopWatch
        handleStartStop={handleStartStop}
        buttonDisabled={globalModalOpen || clockModalOpen}
        isRunning={isClockRunning}
        isReset={false}
        resetButtons={null}
        time={time}
      />

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
