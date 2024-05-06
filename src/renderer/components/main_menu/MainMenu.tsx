import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  useIsClockRunning,
  useGlobalModalOpen,
  useClockModalOpen,
  useIsGlobalRunning,
  useAppContext,
  usePatientName,
} from '../AppContext';
import GlobalTest from './GlobalTest';
import ClockTest from './ClockTest';
import TableTests from './TableTests';

export default function MainMenu() {
  const [patientName, setPatientName] = usePatientName();
  const [globalModalOpen] = useGlobalModalOpen();
  const [isGlobalRunning] = useIsGlobalRunning();
  const [isClockRunning] = useIsClockRunning();
  const [clockModalOpen] = useClockModalOpen();
  const { resetContext } = useAppContext();

  const printRef = useRef(null);

  const patientNameDiv = (
    <div>
      <h2 className="subtitle">Nome do paciente</h2>
      <input
        className="input"
        type="text"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        disabled={globalModalOpen || clockModalOpen || isClockRunning}
      />
    </div>
  );

  const printButton = (
    <button
      type="button"
      onClick={useReactToPrint({
        content: () => printRef.current,
      })}
      disabled={
        globalModalOpen || clockModalOpen || isClockRunning || isGlobalRunning
      }
    >
      Imprimir Resultados
    </button>
  );

  const resetButton = (
    <button
      type="button"
      onClick={resetContext}
      disabled={
        globalModalOpen || clockModalOpen || isClockRunning || isGlobalRunning
      }
    >
      Gerar novo teste
    </button>
  );

  return (
    <>
      <div ref={printRef} className="print-scale">
        <h1 className="title">Testes de Percepção Temporal</h1>
        <div className="level">{patientNameDiv}</div>
        <GlobalTest />
        <TableTests title="Teste de Estimação" goToPath="/estimation-test" />
        <TableTests title="Teste de Produção" goToPath="/production-test" />
        <ClockTest />
      </div>

      <h2 className="black-tab"> _ </h2>
      <div className="level">{printButton}</div>
      <div className="level">{resetButton}</div>
    </>
  );
}
