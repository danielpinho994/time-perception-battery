import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useModalOpen, useIsClockPaused } from '../AppContext';
import GlobalTest from './GlobalTest';
import ClockTest from './ClockTest';
import ResultsTable from './TableTests';

export default function MainMenu() {
  const [modalOpen] = useModalOpen();
  const [isClockPaused] = useIsClockPaused();

  const [patientName, setPatientName] = useState('');
  const patientNameDiv = (
    <div>
      <h2 className="subtitle">Nome do paciente</h2>
      <input
        className="name-input"
        type="text"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        disabled={modalOpen || !isClockPaused}
      />
    </div>
  );

  const componentRef = useRef(null);
  const generatePdfButton = (
    <div className="footer-buttons">
      <button
        type="button"
        className="btn-footer"
        onClick={useReactToPrint({
          content: () => componentRef.current,
        })}
        disabled={modalOpen || !isClockPaused}
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
        disabled={modalOpen || !isClockPaused}
      >
        Gerar novo teste
      </button>
    </div>
  );

  return (
    <div ref={componentRef} className="print-scale">
      <h1 className="title">Testes de Percepção Temporal</h1>
      <div className="level">{patientNameDiv}</div>
      <div className="level">
        <GlobalTest />
      </div>
      <div className="level">
        <ResultsTable title="Teste de Estimação" goToPath="/estimation-test" />
      </div>
      <div className="level">
        <ResultsTable title="Teste de Produção" goToPath="/production-test" />
      </div>
      <div className="level">
        <ClockTest />
      </div>
      <div className="subtitle" />
      <div className="level">{generatePdfButton}</div>
      <div className="level">{resetButton}</div>
    </div>
  );
}
