import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  useEstimationSequences,
  useEstimationResults,
  useProductionSequences,
  useProductionResults,
  useModalOpen,
  useIsClockPaused,
} from '../AppContext';
import GlobalTest from './GlobalTest';
import ClockTest from './ClockTest';

export default function MainMenu() {
  const navigate = useNavigate();
  const [modalOpen] = useModalOpen();
  const [estimationSequences] = useEstimationSequences();
  const [estimationResults] = useEstimationResults();
  const [productionSequences] = useProductionSequences();
  const [productionResults] = useProductionResults();
  const [isClockPaused] = useIsClockPaused();

  const goToTest = (testRoute: string) => {
    navigate(testRoute);
  };

  const [patientName, setPatientName] = useState('');
  const PatientName = (
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

  const EstimationTest = (
    <div>
      <h2 className="subtitle">Teste de Estimação</h2>
      <button
        className="go-to-test"
        type="button"
        onClick={() => goToTest('/estimation-test')}
        disabled={modalOpen || !isClockPaused}
      >
        Ir para teste
      </button>
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
        <tr className="result-row">
          <td>Resultado</td>
          {estimationResults.map((result, index) => (
            <td key={`result-${index + 1}`}>{result}</td>
          ))}
          {[...Array(9 - estimationResults.length)].map((_, index) => (
            <td key={`empty-${index + estimationResults.length + 1}`} />
          ))}
        </tr>
      </table>
    </div>
  );

  const ProductionTest = (
    <div>
      <h2 className="subtitle">Teste de Produção</h2>
      <button
        type="button"
        className="go-to-test"
        onClick={() => goToTest('/production-test')}
        disabled={modalOpen || !isClockPaused}
      >
        Ir para teste
      </button>
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
        <tr className="result-row">
          <td>Resultado</td>
          {productionResults.map((result, index) => (
            <td key={`result-${index + 1}`}>{result}</td>
          ))}
          {[...Array(9 - productionResults.length)].map((_, index) => (
            <td key={`empty-${index + productionResults.length + 1}`} />
          ))}
        </tr>
      </table>
    </div>
  );

  const componentRef = useRef(null);
  const FooterButtons = (
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
      <div className="level">{PatientName}</div>
      <div className="level">
        <GlobalTest />
      </div>
      <div className="level">{EstimationTest}</div>
      <div className="level">{ProductionTest}</div>
      <div className="level">
        <ClockTest />
      </div>
      <div className="subtitle" />
      <div className="level">{FooterButtons}</div>
    </div>
  );
}
