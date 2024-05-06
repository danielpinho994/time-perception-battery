import { useNavigate } from 'react-router-dom';

export function StartStopButton({
  handleStartStop,
  disabled,
  isRunning,
  isReset,
  resetButtons,
}) {
  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={disabled}
    >
      {isRunning ? 'Parar' : 'Começar'}
    </button>
  );

  return <div>{isReset ? resetButtons : startStopButton}</div>;
}

export function MainMenuButton({ disabled }) {
  const navigate = useNavigate();
  const goToMainMenu = () => {
    navigate('/');
  };

  return (
    <button type="button" onClick={goToMainMenu} disabled={disabled}>
      Voltar
    </button>
  );
}

export function EditResultsButton({
  disabled,
  isEditable,
  results,
  setResults,
  setEditable,
}) {
  const toggleEditable = () => {
    if (isEditable) {
      // resolve empty cells after editing table
      const isPositiveNumber = (value: any): value is number =>
        typeof value === 'number' && value > 0;
      const transformedArray = results.reduceRight<number[]>(
        (accumulator, current) => {
          if (isPositiveNumber(current)) {
            accumulator.unshift(current);
          } else if (accumulator.length > 0) {
            accumulator.unshift(0);
          }
          return accumulator;
        },
        [],
      );
      setResults(transformedArray);
    }
    setEditable(!isEditable);
  };

  return (
    <button type="button" onClick={toggleEditable} disabled={disabled}>
      {isEditable ? 'Guardar Tabela' : 'Ativar Edição'}
    </button>
  );
}
