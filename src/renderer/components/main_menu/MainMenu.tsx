import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  useIsClockPaused,
  useGlobalModalOpen,
  useClockModalOpen,
} from '../AppContext';
import GlobalTest from './GlobalTest';
import ClockTest from './ClockTest';
import ResultsTable from './TableTests';

export default function MainMenu() {
  const [globalModalOpen] = useGlobalModalOpen();
  const [isClockPaused] = useIsClockPaused();
  const [clockModalOpen] = useClockModalOpen();

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

  const pdfComponentRef = useRef(null);
  const generatePdfButton = (
    <div className="footer-buttons">
      <button
        type="button"
        className="btn-footer"
        onClick={useReactToPrint({
          content: () => pdfComponentRef.current,
        })}
        disabled={globalModalOpen || clockModalOpen || !isClockPaused}
      >
        Gerar PDF
      </button>
    </div>
  );

  const resetButton = (
    <div className="footer-buttons">
      <button
        type="button"
        className="btn-footer"
        onClick={() => console.log('reset')} ////////////////////////////////////////////////////////
        disabled={globalModalOpen || clockModalOpen || !isClockPaused}
      >
        Gerar novo teste
      </button>
    </div>
  );

  return (
    <>
      <div ref={pdfComponentRef} className="print-scale">
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
        <div className="level">{generatePdfButton}</div>
        <div className="subtitle" />
        <div className="level">{resetButton}</div>
      </div>
    </>
  );
}
