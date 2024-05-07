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
import InstructionsModal from '../common/InstructionsModal';

export default function TableTests({ title }) {
  const navigate = useNavigate();
  const [globalModalOpen] = useGlobalModalOpen();
  const [isClockRunning] = useIsClockRunning();
  const [clockModalOpen] = useClockModalOpen();

  const estimationInstructions = `<p> Descrição e regras do teste: </p>
  <ul style="padding-left: 40px;">
    <li> Composto por 9 intervalos de tempo, mas o participante não pode saber quanto tempo tem cada intervalo. </li>
    <li> Cada sequência de 3 intervalos é composta por um intervalo de 7, 32 e 58 segundos, distribuídos aleatoriamente. </li>
    <li> Ao começar cada intervalo é reproduzido um som de <i>beep</i>. O intervalo termina automaticamente assim que atingir o limite, e é reproduzido o <i>beep</i> novamente. </li>
    <li> O participante deve estimar quanto tempo passou. </li>
    <li> O participante pode fazer contagem interna, mas não pode usar a voz nem ritmos corporais. </li>
    <li> Antes de começar, existe um intervalo de experimentação de 4 segundos, para perceber se o participante entendeu as regras. </li>
  </ul>
  <p> Passos: </p>
  <ol style="padding-left: 40px;">
    <li> Explicar regras ao participante </li>
    <li> Correr intervalo de experimentação </li>
    <li> Perceber se o paciente entendeu o teste </li>
    <li> Iniciar Teste de Estimação </li>
  </ol>`;

  const productionInstructions = `<p> Descrição e regras do teste: </p>
  <ul style="padding-left: 40px;">
    <li> Composto por 9 intervalos de tempo, e o participante tem de saber quanto tempo tem cada intervalo. </li>
    <li> Cada sequência de 3 intervalos é composta por um intervalo de 7, 32 e 58 segundos, distribuídos aleatoriamente. </li>
    <li> Ao começar cada intervalo é reproduzido um som de <i>beep</i>. O intervalo termina quando o participante estimar que tenha decorrido o tempo estipulado. </li>
    <li> O participante deve dizer "FIM" em voz alta, e o avaliador pára o cronómetro. </li>
    <li> O participante pode fazer contagem interna, mas não pode usar a voz nem ritmos corporais. </li>
    <li> Antes de começar, existe um intervalo de experimentação de 4 segundos, para perceber se o participante entendeu as regras. </li>
  </ul>
  <p> Passos: </p>
  <ol style="padding-left: 40px;">
    <li> Explicar regras ao participante </li>
    <li> Correr intervalo de experimentação </li>
    <li> Perceber se o paciente entendeu o teste </li>
    <li> Iniciar Teste de Produção </li>
  </ol>`;

  const [[sequences], [results], instructions, goToPath] =
    title === 'Teste de Estimação'
      ? [
          useEstimationSequences(),
          useEstimationResults(),
          estimationInstructions,
          '/estimation-test',
        ]
      : [
          useProductionSequences(),
          useProductionResults(),
          productionInstructions,
          '/production-test',
        ];

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

      <InstructionsModal
        buttonName="Instruções"
        instructionsString={instructions}
      />

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
