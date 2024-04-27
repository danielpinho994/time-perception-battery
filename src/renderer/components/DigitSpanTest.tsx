import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ToggleButton.css';

export type ButtonState = 'none' | 'left' | 'right';

const forwardSequences = [
  [1, 7],
  [5, 8, 2],
  [6, 4, 3, 9],
  [4, 2, 7, 3, 1],
  [6, 1, 9, 4, 7, 3],
  [5, 9, 1, 7, 4, 2, 8],
  [5, 8, 1, 9, 2, 6, 4, 7],
];
const backwardSequences = [
  [2, 4],
  [6, 2, 9],
  [3, 2, 7, 9],
  [1, 5, 2, 8, 6],
  [5, 3, 9, 4, 1, 8],
  [8, 1, 2, 9, 3, 6, 5],
  [9, 4, 3, 7, 6, 2, 5, 8],
];

function DigitSpan() {
  // --- PERSISTANT CONTEXT --- //
  const navigate = useNavigate();
  const location = useLocation();
  const [estimationSequences] = useState<number[]>(
    location.state.estimationSequences,
  );
  const [estimationResults] = useState<number[]>(
    location.state.estimationResults,
  );
  const [productionSequences] = useState<number[]>(
    location.state.productionSequences,
  );
  const [productionResults] = useState<number[]>(
    location.state.productionResults,
  );
  const [clockResults] = useState<number>(location.state.clockResults);
  const [globalStartTime] = useState<number>(location.state.globalStartTime);
  const [globalResults] = useState<number>(location.state.globalResults);
  const [forwardsResults, setForwardResults] = useState<ButtonState[]>(
    location.state.forwardsResults,
  );
  const [backwardResults, setBackwardResults] = useState<ButtonState[]>(
    location.state.backwardResults,
  );

  const goToMainMenu = () => {
    navigate('/', {
      state: {
        estimationSequences,
        estimationResults,
        productionSequences,
        productionResults,
        clockResults,
        globalStartTime,
        globalResults,
        forwardsResults,
        backwardResults,
      },
    });
  };

  const [isForward, setIsForward] = useState<boolean>(true);
  const [sequences, setSequences] = useState<number[][]>(forwardSequences);
  const [results, setResults] = useState<ButtonState[]>(forwardsResults);

  const toggleTest = () => {
    setIsForward(!isForward);
  };

  const handleLeftButton0 = (index: number) => {
    const newResults = isForward ? [...forwardsResults] : [...backwardResults];
    if (newResults[index] === 'left') newResults[index] = 'none';
    else newResults[index] = 'left';
    if (isForward) setForwardResults(newResults);
    else setBackwardResults(newResults);
  };

  const handleRightButton1 = (index: number) => {
    const newResults = isForward ? [...forwardsResults] : [...backwardResults];
    if (newResults[index] === 'right') newResults[index] = 'none';
    else newResults[index] = 'right';
    if (isForward) setForwardResults(newResults);
    else setBackwardResults(newResults);
  };

  useEffect(() => {
    if (isForward) {
      setSequences(forwardSequences);
      setResults(forwardsResults);
    } else {
      setSequences(backwardSequences);
      setResults(backwardResults);
    }
  }, [backwardResults, forwardsResults, isForward]);

  return (
    <div>
      <h1> {isForward ? 'Forward Digit Span' : 'Backward Digit Span'}</h1>

      <button type="button" onMouseDown={toggleTest}>
        Ir para {!isForward ? 'Forward Digit Span' : 'Backward Digit Span'}
      </button>

      <div>
        {sequences.map((sequence, index) => (
          <div>
            Sequência {index + 1}: {sequence.join(' - ')}
            <button
              type="button"
              className={`toggle-button ${
                results[index] === 'left' ? 'on' : 'off'
              }`}
              onClick={() => handleLeftButton0(index)}
            >
              <div className="inner-circle" />
            </button>
            <button
              type="button"
              className={`toggle-button ${
                results[index] === 'right' ? 'on' : 'off'
              }`}
              onClick={() => handleRightButton1(index)}
            >
              <div className="inner-circle" />
            </button>
          </div>
        ))}
        <div>
          Resultado:{' '}
          {results.reduce(
            (count, state) => (state === 'right' ? count + 1 : count),
            0,
          )}
        </div>
      </div>

      <div>
        <button type="button" onMouseDown={goToMainMenu}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default DigitSpan;
