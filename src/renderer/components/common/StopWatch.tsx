import React from 'react';

export default function StopWatch({
  handleStartStop,
  buttonDisabled,
  isRunning,
  isReset,
  resetButtons,
  time,
}) {
  const startStopButton = (
    <button
      type="button"
      className="btn-start-stop"
      onClick={handleStartStop}
      disabled={buttonDisabled}
    >
      {isRunning ? 'Parar' : 'Começar'}
    </button>
  );

  const timer = (
    <div className="timer">
      <span className="digits">
        {`0${Math.floor((time / 60000) % 60)}`.slice(-2)}:
      </span>
      <span className="digits">
        {`0${Math.floor((time / 1000) % 60)}`.slice(-2)}
      </span>
    </div>
  );

  return (
    <>
      <div>{isReset ? resetButtons : startStopButton}</div>
      <div>{timer}</div>
    </>
  );
}
