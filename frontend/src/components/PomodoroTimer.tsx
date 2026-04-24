import { useEffect, useState } from "react";

type SessionStatus = "work" | "shortRest" | "longRest";

type PomodoroTimerProps = {
  onModeChange: (mode: SessionStatus) => void;
};

function PomodoroTimer({ onModeChange }: PomodoroTimerProps) {
  const workSeconds = 5;
  const shortRestSeconds = 3;
  const longRestSeconds = 4;

  const [seconds, setSeconds] = useState(workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const currentTotalSeconds =
    sessionStatus === "work"
      ? workSeconds
      : sessionStatus === "shortRest"
      ? shortRestSeconds
      : longRestSeconds;

  useEffect(() => {
    onModeChange(sessionStatus);
  }, [sessionStatus, onModeChange]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);

          if (sessionStatus === "work") {
            const nextPomodorosCount = completedPomodoros + 1;
            setCompletedPomodoros(nextPomodorosCount);

            if (nextPomodorosCount % 3 === 0) {
              setSessionStatus("longRest");
              return longRestSeconds;
            } else {
              setSessionStatus("shortRest");
              return shortRestSeconds;
            }
          } else {
            setSessionStatus("work");
            return workSeconds;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, sessionStatus, completedPomodoros]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleFinish = () => {
    setIsRunning(false);
    setSeconds(currentTotalSeconds);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressBarPercent =
    ((currentTotalSeconds - seconds) / currentTotalSeconds) * 100;

  // Preguntar si queremos texto debajo del contador o dejar solo las etiquetas de arriba
  const currentText =
    sessionStatus === "work"
      ? "Time to focus"
      : sessionStatus === "shortRest"
      ? "Descanso corto"
      : "Descanso largo";

  return (
    <>
      <div
        className="timer-circle"
        style={{
          background: `radial-gradient(circle, #131925 58%, transparent 59%), 
            conic-gradient(#73d8ff 0% ${progressBarPercent}%, #283245 ${progressBarPercent}% 100%)`,
        }}
      >
        <div>
          <h3>{formatTime(seconds)}</h3>
          <p>{currentText}</p>
        </div>
      </div>

      <div className="timer-actions">
        {!isRunning ? (
          <button className="primary-button" onClick={handleStart}>
            Iniciar
          </button>
        ) : (
          <button className="secondary-button" onClick={handlePause}>
            Pausar
          </button>
        )}

        <button className="primary-button" onClick={handleFinish}>
          Finalizar
        </button>
      </div>
    </>
  );
}

export default PomodoroTimer;