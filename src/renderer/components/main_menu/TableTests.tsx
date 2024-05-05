import { useNavigate } from 'react-router-dom';
import {
  useEstimationSequences,
  useEstimationResults,
  useProductionSequences,
  useProductionResults,
  useIsClockPaused,
  useClockModalOpen,
  useGlobalModalOpen,
} from '../AppContext';

export default function TableTests({ title, goToPath, className }) {
  const navigate = useNavigate();
  const [globalModalOpen] = useGlobalModalOpen();
  const [isClockPaused] = useIsClockPaused();
  const [clockModalOpen] = useClockModalOpen();

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
    <div className={className}>
      <h2>{title}</h2>
      <button
        type="button"
        onClick={() => goToTest(goToPath)}
        disabled={globalModalOpen || clockModalOpen || !isClockPaused}
      >
        Ir para teste
      </button>
      <table>
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
        <tr className="table-results-row">
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
