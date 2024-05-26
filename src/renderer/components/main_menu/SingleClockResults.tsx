export default function SingleClockResults({
  results,
  timeUnitString,
  setModalOpen,
  editButtonDisabled,
}: {
  results: [number, number];
  timeUnitString: string;
  setModalOpen: (isModal: boolean) => void;
  editButtonDisabled: boolean;
}) {
  const timer =
    results[0] === 0
      ? ''
      : `Cronómetro final: ${`0${Math.floor((results[0] / 60000) % 60)}`.slice(
          -2,
        )}:${`0${Math.floor((results[0] / 1000) % 60)}`.slice(-2)}`;

  const elapsedTime =
    timeUnitString === 'minutos'
      ? Math.floor(results[0] / 60000)
      : Math.floor(results[0] / 1000);
  const elapsedUnitString =
    elapsedTime === 1 ? timeUnitString.slice(0, -1) : timeUnitString;
  const elapsedTimeResult =
    results[0] === 0
      ? ''
      : `Decorrido: ${elapsedTime} ${elapsedUnitString}` ?? '';

  const resultUnitString =
    results[1] === 1 ? timeUnitString.slice(0, -1) : timeUnitString;
  const result =
    results[1] === 0 ? '' : `Estimado: ${results[1]} ${resultUnitString}` ?? '';

  const editResultButton = (
    <button
      type="button"
      onClick={async () => setModalOpen(true)}
      disabled={editButtonDisabled}
    >
      Alterar Resultado
    </button>
  );

  return (
    <>
      <div className="single-clock-result">
        <div className="elapsed-result">{timer}</div>
        <div className="elapsed-result">{elapsedTimeResult}</div>
        <div className="final-result">{result}</div>
      </div>
      <div>
        <div>{editResultButton}</div>
      </div>
    </>
  );
}
