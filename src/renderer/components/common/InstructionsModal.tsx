import React, { useState, useRef } from 'react';

export default function InstructionsModal({
  buttonName,
  instructionsString,
}: {
  buttonName: string;
  instructionsString: string;
}) {
  const [instructions, setInstructions] = useState(false);
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top = rect.bottom + window.scrollY;
      setModalStyle({
        position: 'absolute',
        top: `${top}px`,
        display: 'block',
      });
    }
    setInstructions(true);
  };
  const handleMouseLeave = () => {
    setInstructions(false);
  };

  return (
    <div>
      <button
        type="button"
        className="btn-instructions"
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {buttonName}
      </button>

      {instructions && (
        <div
          className="modal-instructions"
          style={modalStyle}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: instructionsString }}
        />
      )}
    </div>
  );
}
