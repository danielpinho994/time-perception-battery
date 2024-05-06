import React, { useState, useRef } from 'react';

export default function InstructionsModal({ instructionsString }) {
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
        Instruções
      </button>

      {instructions && (
        <div className="modal-instructions" style={modalStyle}>
          {instructionsString}
        </div>
      )}
    </div>
  );
}
