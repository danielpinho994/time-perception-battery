export default function YesNoModal({
  isModalOpen,
  yesNoQuestion,
  handleYes,
  handleNo,
}) {
  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <h2 className="subtitle">{yesNoQuestion}</h2>

          <button type="button" className="btn-submit" onClick={handleYes}>
            Sim
          </button>
          <button type="button" className="btn-cancel" onClick={handleNo}>
            Não
          </button>
        </div>
      )}
    </div>
  );
}
