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
import InstructionsModal from '../common/InstructionsModal';

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
      <h2 className="subtitle">Nome do participante</h2>
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
        <div className="level">
          <h1 className="title">Testes de Percepção Temporal</h1>
          <div>{patientNameDiv}</div>
          <InstructionsModal
            buttonName="Descrição e regras iniciais"
            instructionsString={`<p> Esta avaliação é composta por 4 testes com o propósito de avaliar a percepção temporal. </p>
                                <p> O programa é utilizado somente pelo avaliador, não pelo participante. </p>
                                <p> Regras para o participante: </p>
                                <ul style="padding-left: 40px;">
                                  <li> Não entrar em contacto com este programa e seus testes, antes e durante todo o processo de avaliação </li>
                                  <li> Utilizar auriculares </li>
                                  <li> Sentar numa cadeira confortável </li>
                                  <li> Estar numa sala vazia e silenciosa, sem nenhum som rítmico </li>
                                  <li> Retirar todos os relógios da sala e do participante, se existirem </li>
                                </ul>`}
          />
        </div>

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
