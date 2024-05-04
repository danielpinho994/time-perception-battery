import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  useIsClockPaused,
  useGlobalModalOpen,
  useClockModalOpen,
  useIsGlobalPaused,
  useAppContext,
} from '../AppContext';
import GlobalTest from './GlobalTest';
import ClockTest from './ClockTest';
import ResultsTable from './TableTests';

export default function MainMenu() {
  const [globalModalOpen] = useGlobalModalOpen();
  const [isGlobalPaused] = useIsGlobalPaused();
  const [isClockPaused] = useIsClockPaused();
  const [clockModalOpen] = useClockModalOpen();
  const { resetContext } = useAppContext();

  const [patientName, setPatientName] = useState('');
  const patientNameDiv = (
    <div>
      <h2 className="subtitle">Nome do paciente</h2>
      <input
        className="name-input"
        type="text"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        disabled={globalModalOpen || clockModalOpen || !isClockPaused}
      />
    </div>
  );

  const printRef = useRef(null);
  const printResultsButton = (
    <div className="footer-buttons">
      <button
        type="button"
        className="btn-footer"
        onClick={useReactToPrint({
          content: () => printRef.current,
        })}
        disabled={
          globalModalOpen || clockModalOpen || !isClockPaused || !isGlobalPaused
        }
      >
        Imprimir Resultados
      </button>
    </div>
  );

  const resetButton = (
    <div className="footer-buttons">
      <button
        type="button"
        className="btn-footer"
        onClick={resetContext}
        disabled={
          globalModalOpen || clockModalOpen || !isClockPaused || !isGlobalPaused
        }
      >
        Gerar novo teste
      </button>
    </div>
  );

  return (
    <>
      <div ref={printRef} className="print-scale">
        <h1 className="title">Testes de Percepção Temporal</h1>
        <div className="level">{patientNameDiv}</div>
        <div className="level">
          <GlobalTest />
        </div>
        <div className="level">
          <ResultsTable
            title="Teste de Estimação"
            goToPath="/estimation-test"
          />
        </div>
        <div className="level">
          <ResultsTable title="Teste de Produção" goToPath="/production-test" />
        </div>
        <div className="level">
          <ClockTest />
        </div>
      </div>
      <div>
        <div className="subtitle" />
        <div className="level">{printResultsButton}</div>
        <div className="subtitle" />
        <div className="level">{resetButton}</div>
      </div>
    </>
  );
}
