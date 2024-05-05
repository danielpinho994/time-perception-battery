export default function UserInputModal({
  isModalOpen,
  userInput,
  setUserInput,
  saveUserInput,
  cancelUserInput,
}) {
  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <h2 className="subtitle">Colocar resultado em minutos</h2>
          <input
            type="number"
            className="input-modal"
            value={userInput ?? undefined} // Handle controlled to uncontrolled warning
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
