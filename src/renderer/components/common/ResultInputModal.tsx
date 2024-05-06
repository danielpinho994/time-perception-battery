import { useState } from 'react';

export default function ResultInputModal({
  isModalOpen,
  setModalOpen,
  setTime,
  saveResult,
  timeUnitString,
}) {
  const [userInput, setUserInput] = useState<number | null>(null);

  const cancelUserInput = () => {
    setModalOpen(false);
    setUserInput(null);
    setTime(0);
  };

  const saveUserInput = () => {
    saveResult(userInput ?? 0);
    cancelUserInput();
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <h2 className="subtitle">Colocar resultado em {timeUnitString}</h2>
          <input
            type="number"
            className="input-modal"
            value={userInput ?? undefined}
            onChange={(e) => setUserInput(Number(e.target.value))}
          />

          <button type="button" className="btn-submit" onClick={saveUserInput}>
            Submeter
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={cancelUserInput}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
