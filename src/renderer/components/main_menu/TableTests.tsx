import { useNavigate } from 'react-router-dom';
import {
  useModalOpen,
  useEstimationSequences,
  useEstimationResults,
  useProductionSequences,
  useProductionResults,
  useIsClockPaused,
} from '../AppContext';

export default function ResultsTable({ title, goToPath }) {
  const navigate = useNavigate();
  const [modalOpen] = useModalOpen();
  const [isClockPaused] = useIsClockPaused();
  const [sequences] =
    title === 'Teste de Estimação'
      ? useEstimationSequences()
      : useProductionSequences();
  const [results] =
    title === 'Teste de Estimação'
      ? useEstimationResults()
      : useProductionResults();

  const goToTest = (testRoute: string) => {
    navigate(testRoute);
  };

  return (
    <div>
      <h2 className="subtitle">{title}</h2>
      <button
        className="go-to-test"
        type="button"
        onClick={() => goToTest(goToPath)}
        disabled={modalOpen || !isClockPaused}
      >
        Ir para teste
      </button>
      <table className="table-results">
        <tr>
          <td>Intervalo</td>
          {sequences.map((_, index) => (
            <td key={`interval-${index + 1}`}>{index + 1}</td>
          ))}
        </tr>
        <tr>
          <td>Segundos</td>
          {sequences.map((sequence, index) => (
            <td key={`seconds-${index + 1}`}>{sequence / 1000}</td>
          ))}
        </tr>
        <tr className="result-row">
          <td>Resultado</td>
          {results.map((result, index) => (
            <td key={`result-${index + 1}`}>{result}</td>
          ))}
          {[...Array(9 - results.length)].map((_, index) => (
            <td key={`empty-${index + results.length + 1}`} />
          ))}
        </tr>
      </table>
    </div>
  );
}
