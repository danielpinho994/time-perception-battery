import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  useIsClockPaused,
  useGlobalModalOpen,
  useClockModalOpen,
  useIsGlobalPaused,
  useAppContext,
  usePatientName,
} from '../AppContext';
import GlobalTest from './GlobalTest';
import ClockTest from './ClockTest';
import TableTests from './TableTests';

export default function MainMenu() {
  const [patientName, setPatientName] = usePatientName();
  const [globalModalOpen] = useGlobalModalOpen();
  const [isGlobalPaused] = useIsGlobalPaused();
  const [isClockPaused] = useIsClockPaused();
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
        disabled={globalModalOpen || clockModalOpen || !isClockPaused}
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
        globalModalOpen || clockModalOpen || !isClockPaused || !isGlobalPaused
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
        globalModalOpen || clockModalOpen || !isClockPaused || !isGlobalPaused
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
        <GlobalTest className="level" />
        <TableTests
          title="Teste de Estimação"
          goToPath="/estimation-test"
          className="level"
        />
        <TableTests
          title="Teste de Produção"
          goToPath="/production-test"
          className="level"
        />
        <ClockTest className="level" />
      </div>

      <h2 className="black-tab"> _ </h2>
      <div className="level">{printButton}</div>
      <div className="level">{resetButton}</div>
    </>
  );
}
