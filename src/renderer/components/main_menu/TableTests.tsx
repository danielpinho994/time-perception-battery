import { useNavigate } from 'react-router-dom';
import {
  useEstimationSequences,
  useEstimationResults,
  useProductionSequences,
  useProductionResults,
  useIsClockRunning,
  useClockModalOpen,
  useGlobalModalOpen,
} from '../AppContext';
import Table from '../common/Table';

export default function TableTests({ title, goToPath }) {
  const navigate = useNavigate();
  const [globalModalOpen] = useGlobalModalOpen();
  const [isClockRunning] = useIsClockRunning();
  const [clockModalOpen] = useClockModalOpen();

  const [[sequences], [results]] =
    title === 'Teste de Estimação'
      ? [useEstimationSequences(), useEstimationResults()]
      : [useProductionSequences(), useProductionResults()];

  const goToTestButton = (
    <button
      type="button"
      onClick={() => navigate(goToPath)}
      disabled={globalModalOpen || clockModalOpen || isClockRunning}
    >
      Ir para teste
    </button>
  );

  return (
    <div className="level">
      <h2>{title}</h2>
      <div>{goToTestButton}</div>

      <Table
        sequences={sequences}
        results={results}
        setResults={null}
        isEditable={false}
      />
    </div>
  );
}
