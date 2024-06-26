import { useRef, useState } from 'react';
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
import YesNoModal from '../common/YesNoModal';

export default function MainMenu() {
  const [patientName, setPatientName] = usePatientName();
  const [globalModalOpen] = useGlobalModalOpen();
  const [isGlobalRunning] = useIsGlobalRunning();
  const [isClockRunning] = useIsClockRunning();
  const [clockModalOpen] = useClockModalOpen();
  const { resetContext } = useAppContext();

  const printRef = useRef(null);
  const [resetModal, setResetModal] = useState(false);

  const patientNameDiv = (
    <div>
      <h2>Nome do participante</h2>
      <input
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
      onClick={useReactToPrint({ content: () => printRef.current })}
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
      onClick={() => setResetModal(true)}
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
          <h1>Testes de Percepção Temporal</h1>
          <div>{patientNameDiv}</div>
          <InstructionsModal
            buttonName="Descrição e regras iniciais"
            instructionsString={`<p> Os Testes de Percepção Temporal são uma avaliação composta por 4 testes. </p>
                                <p> O programa é utilizado somente pelo avaliador, não pelo participante. </p>
                                <p> Regras para o participante: </p>
                                <ul style="padding-left: 40px;">
                                  <li> Não entrar em contacto com este programa, antes e durante todo o processo de avaliação </li>
                                  <li> Utilizar auriculares ligados a este computador </li>
                                  <li> Sentar numa cadeira confortável </li>
                                  <li> Estar numa sala vazia e silenciosa, sem nenhum som rítmico </li>
                                  <li> Retirar todos os relógios da sala e de si mesmo </li>
                                </ul>`}
          />
        </div>

        <GlobalTest />
        <TableTests title="Teste de Estimação" />
        <TableTests title="Teste de Produção" />
        <ClockTest />
      </div>

      <h2 className="black-tab"> _ </h2>
      <div className="level">{printButton}</div>
      <div className="level">{resetButton}</div>
      <YesNoModal
        isModalOpen={resetModal}
        setModal={setResetModal}
        yesNoQuestion="Todos os dados serão perdidos. <p>Tem a certeza que deseja gerar novo teste?</p>"
        handleYes={resetContext}
      />
    </>
  );
}
