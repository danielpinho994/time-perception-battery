export default function YesNoModal({
  isModalOpen,
  setModal,
  yesNoQuestion,
  handleYes,
}: {
  isModalOpen: boolean;
  setModal: (isModal: boolean) => void;
  yesNoQuestion: string;
  handleYes: () => void;
}) {
  const clickYes = () => {
    handleYes();
    setModal(false);
  };

  const clickNo = () => {
    setModal(false);
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <h3 dangerouslySetInnerHTML={{ __html: yesNoQuestion }} />

          <button type="button" className="btn-submit" onClick={clickYes}>
            Sim
          </button>
          <button type="button" className="btn-cancel" onClick={clickNo}>
            Não
          </button>
        </div>
      )}
    </div>
  );
}
