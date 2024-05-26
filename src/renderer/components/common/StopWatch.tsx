import React from 'react';

export default function StopWatch({
  startStopButton,
  time,
}: {
  startStopButton: React.ReactNode;
  time: number;
}) {
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
      <div>{startStopButton}</div>
      <div>{timer}</div>
    </>
  );
}
