export default function SingleClockResults({ results, timeUnitString }) {
  return (
    <>
      <div className="result">
        {results[0] === 0
          ? ''
          : `Tempo decorrido: ${`0${Math.floor(
              (results[0] / 60000) % 60,
            )}`.slice(-2)}:${`0${Math.floor((results[0] / 1000) % 60)}`.slice(
              -2,
            )}` ?? ''}
      </div>
      <div className="result">
        {results[1] === 0
          ? ''
          : `Resultado: ${results[1]} ${timeUnitString}` ?? ''}
      </div>
    </>
  );
}
