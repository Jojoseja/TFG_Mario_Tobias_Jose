import { useEffect, useState } from "react";
import "../styles/PomodoroTimer.css";
import { FaGear } from "react-icons/fa6";
import PomodoroSettingsModal from "./PomodoroSettingsModal";
import type { PomodoroConfig } from "./PomodoroSettingsModal";

type SessionStatus = "work" | "shortRest" | "longRest";

type PomodoroTimerProps = {
  onModeChange: (mode: SessionStatus) => void;
  variant?: "home" | "project";
};

const defaultPomodoroConfig: PomodoroConfig = {
  workSeconds: 1500,
  shortRestSeconds: 300,
  longRestSeconds: 900,
  cyclesBeforeLongRest: 3,
};

function PomodoroTimer({
  onModeChange,
  variant = "home",
}: PomodoroTimerProps) {
  const [config, setConfig] = useState<PomodoroConfig>(defaultPomodoroConfig);
  const [seconds, setSeconds] = useState(config.workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentTotalSeconds =
    sessionStatus === "work"
      ? config.workSeconds
      : sessionStatus === "shortRest"
      ? config.shortRestSeconds
      : config.longRestSeconds;

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

            if (nextPomodorosCount % config.cyclesBeforeLongRest === 0) {
              setSessionStatus("longRest");
              return config.longRestSeconds;
            }

            setSessionStatus("shortRest");
            return config.shortRestSeconds;
          }

          setSessionStatus("work");
          return config.workSeconds;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, sessionStatus, completedPomodoros, config]);

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

  const handleSaveSettings = (newConfig: PomodoroConfig) => {
    setConfig(newConfig);
    setIsRunning(false);
    setSessionStatus("work");
    setSeconds(newConfig.workSeconds);
    setCompletedPomodoros(0);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressBarPercent =
    ((currentTotalSeconds - seconds) / currentTotalSeconds) * 100;

  const currentText =
    sessionStatus === "work"
      ? "Time to focus"
      : sessionStatus === "shortRest"
      ? "Descanso corto"
      : "Descanso largo";

  return (
    <>
      <div className={`pomodoro-timer pomodoro-timer--${variant}`}>
        <div
          className="timer-circle"
          style={{
            background: `radial-gradient(circle, var(--timer-center-bg) 58%, transparent 59%),
              conic-gradient(var(--timer-circle-color) 0% ${progressBarPercent}%, var(--timer-track-bg) ${progressBarPercent}% 100%)`,
          }}
        >
          <div>
            <h3>{formatTime(seconds)}</h3>
            <p>{currentText}</p>

            <button
              className="pomo-settings-button"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Configurar Pomodoro"
            >
              <FaGear />
            </button>
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
      </div>

      <PomodoroSettingsModal
        open={isSettingsOpen}
        config={config}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </>
  );
}

export default PomodoroTimer;
