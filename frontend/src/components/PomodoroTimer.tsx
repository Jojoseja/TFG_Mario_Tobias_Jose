import { useEffect, useState } from "react";
import "../styles/PomodoroTimer.css";
import { FaGear } from "react-icons/fa6";
import PomodoroSettingsModal from "./PomodoroSettingsModal";
import type { PomodoroConfig } from "./PomodoroSettingsModal";
import type {
  SessionConfiguration,
  SessionConfigurationRequest,
} from "../types/sessionConfiguration";
import type { SessionRequest } from "../types/session";
import {
  getSessionConfigurationRequest,
  putSessionConfigurationRequest,
} from "../services/sessionConfigurationService";
import {
  finishSessionRequest,
  startSessionRequest,
} from "../services/sessionService";
import { secondsToRoundedMinutes } from "../utils/timeUtils";

type SessionStatus = "work" | "shortRest" | "longRest";

type UsedSecondsByStatus = Record<SessionStatus, number>;

type Notification = {
  type: "success" | "error";
  text: string;
};

type PomodoroTimerProps = {
  onModeChange: (mode: SessionStatus) => void;
  variant?: "home" | "project";
};

const initialUsedSeconds: UsedSecondsByStatus = {
  work: 0,
  shortRest: 0,
  longRest: 0,
};

// Necesario para que React cargue el componente mientras llega la configuración del backend
const defaultPomodoroConfig: PomodoroConfig = {
  workSeconds: 1500,
  shortRestSeconds: 300,
  longRestSeconds: 900,
  cyclesBeforeLongRest: 4,
};

function PomodoroTimer({
  onModeChange,
  variant = "home",
}: PomodoroTimerProps) {
  const [config, setConfig] = useState<PomodoroConfig>(defaultPomodoroConfig);
  const [seconds, setSeconds] = useState(defaultPomodoroConfig.workSeconds);

  const [sessionConfigurationId, setSessionConfigurationId] = useState<
    string | null
  >(null);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isFinishingSession, setIsFinishingSession] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [usedSeconds, setUsedSeconds] =
    useState<UsedSecondsByStatus>(initialUsedSeconds);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  const currentTotalSeconds =
    sessionStatus === "work"
      ? config.workSeconds
      : sessionStatus === "shortRest"
      ? config.shortRestSeconds
      : config.longRestSeconds;

  useEffect(() => {
    const loadSessionConfiguration = async () => {
      try {
        const configuration = await getSessionConfigurationRequest();
        const loadedConfig =
          mapSessionConfigurationToPomodoroConfig(configuration);

        setSessionConfigurationId(configuration.id);
        setConfig(loadedConfig);
        setSeconds(loadedConfig.workSeconds);
      } catch (error) {
        console.error("Error cargando la configuración del Pomodoro", error);
        showNotification(
          "error",
          "No se ha podido cargar la configuración. Se usarán valores por defecto."
        );
      } finally {
        setIsLoadingConfig(false);
      }
    };

    void loadSessionConfiguration();
  }, []);

  useEffect(() => {
    onModeChange(sessionStatus);
  }, [sessionStatus, onModeChange]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setUsedSeconds((prevUsedSeconds) => ({
        ...prevUsedSeconds,
        [sessionStatus]: prevUsedSeconds[sessionStatus] + 1,
      }));

      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
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

        return prevSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, sessionStatus, completedPomodoros, config]);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });

    window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleStart = async () => {
    if (isLoadingConfig || isStartingSession || isFinishingSession) return;

    if (!sessionConfigurationId) {
      showNotification(
        "error",
        "No se puede iniciar la sesión porque falta la configuración."
      );
      return;
    }

    try {
      setIsStartingSession(true);

      if (!activeSessionId) {
        const request = buildStartSessionRequest(sessionConfigurationId);
        const startedSession = await startSessionRequest(request);

        setActiveSessionId(startedSession.id);
      }

      setIsRunning(true);
    } catch (error) {
      console.error("Error iniciando sesión Pomodoro", error);
      showNotification("error", "No se ha podido iniciar la sesión.");
    } finally {
      setIsStartingSession(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const moveToNextSessionStatus = () => {
    if (isTimerActionDisabled || !activeSessionId) return;

    setIsRunning(false);

    if (sessionStatus === "work") {
      const nextPomodorosCount = completedPomodoros + 1;
      setCompletedPomodoros(nextPomodorosCount);

      if (nextPomodorosCount % config.cyclesBeforeLongRest === 0) {
        setSessionStatus("longRest");
        setSeconds(config.longRestSeconds);
        return;
      }

      setSessionStatus("shortRest");
      setSeconds(config.shortRestSeconds);
      return;
    }

    setSessionStatus("work");
    setSeconds(config.workSeconds);
  };

  const handleOpenSettings = () => {
    if (activeSessionId) {
      showNotification(
        "error",
        "No puedes editar la configuración mientras hay una sesión activa. Finaliza la sesión primero."
      );
      return;
    }

    setIsSettingsOpen(true);
  };

  const handleFinish = async () => {
    if (isLoadingConfig || isStartingSession || isFinishingSession) return;

    setIsRunning(false);

    if (!activeSessionId || !sessionConfigurationId) {
      setSeconds(currentTotalSeconds);
      return;
    }

    try {
      setIsFinishingSession(true);

      const request = buildFinishSessionRequest(
        sessionConfigurationId,
        usedSeconds
      );

      await finishSessionRequest(activeSessionId, request);

      setActiveSessionId(null);
      setCompletedPomodoros(0);
      setSessionStatus("work");
      setSeconds(config.workSeconds);
      setUsedSeconds(initialUsedSeconds);

      showNotification("success", "Sesión finalizada correctamente.");
    } catch (error) {
      console.error("Error finalizando sesión Pomodoro", error);
      showNotification("error", "No se ha podido finalizar la sesión.");
    } finally {
      setIsFinishingSession(false);
    }
  };

  const handleSaveSettings = async (newConfig: PomodoroConfig) => {
    if (activeSessionId) {
      setIsSettingsOpen(false);
      showNotification(
        "error",
        "No puedes cambiar la configuración mientras hay una sesión activa. Finaliza la sesión primero."
      );
      return;
    }

    const request = mapPomodoroConfigToSessionConfigurationRequest(newConfig);

    try {
      const updatedConfiguration = await putSessionConfigurationRequest(request);
      const updatedConfig =
        mapSessionConfigurationToPomodoroConfig(updatedConfiguration);

      setSessionConfigurationId(updatedConfiguration.id);
      setConfig(updatedConfig);
      setIsRunning(false);
      setSessionStatus("work");
      setSeconds(updatedConfig.workSeconds);
      setCompletedPomodoros(0);
      setActiveSessionId(null);
      setUsedSeconds(initialUsedSeconds);
      setIsSettingsOpen(false);

      showNotification("success", "Configuración guardada correctamente.");
    } catch (error) {
      console.error("Error guardando la configuración del Pomodoro", error);
      showNotification("error", "No se ha podido guardar la configuración.");
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const progressBarPercent =
    currentTotalSeconds > 0
      ? ((currentTotalSeconds - seconds) / currentTotalSeconds) * 100
      : 0;

  const currentText =
    sessionStatus === "work"
      ? "Time to focus"
      : sessionStatus === "shortRest"
      ? "Descanso corto"
      : "Descanso largo";

  const isTimerActionDisabled =
    isLoadingConfig || isStartingSession || isFinishingSession;

  return (
    <>
      {notification && (
        <div className={`notification-banner ${notification.type}`}>
          {notification.text}
        </div>
      )}

      <div className={`pomodoro-timer pomodoro-timer--${variant}`}>
        <div
          className="timer-circle"
          style={{
            background: `radial-gradient(circle, var(--timer-center-bg) 58%, transparent 59%),
              conic-gradient(var(--timer-circle-color) 0% ${progressBarPercent}%, var(--timer-track-bg) ${progressBarPercent}% 100%)`,
          }}
        >
          <div>
            <h3>{isLoadingConfig ? "--:--" : formatTime(seconds)}</h3>
            <p>{isLoadingConfig ? "Cargando..." : currentText}</p>

            <button
              className="pomo-settings-button"
              type="button"
              onClick={handleOpenSettings}
              title="Configurar Pomodoro"
              disabled={isTimerActionDisabled}
            >
              <FaGear />
            </button>
          </div>
        </div>

        <div className="timer-actions">
          {!isRunning ? (
            <button
              className="primary-button"
              type="button"
              onClick={() => void handleStart()}
              disabled={isTimerActionDisabled}
            >
              {isStartingSession ? "Iniciando..." : "Iniciar"}
            </button>
          ) : (
            <button
              className="secondary-button"
              type="button"
              onClick={handlePause}
              disabled={isFinishingSession}
            >
              Pausar
            </button>
          )}

          <button
            className="secondary-button"
            type="button"
            onClick={moveToNextSessionStatus}
            disabled={isTimerActionDisabled || !activeSessionId}
          >
            Saltar
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() => void handleFinish()}
            disabled={isTimerActionDisabled}
          >
            {isFinishingSession ? "Finalizando..." : "Finalizar"}
          </button>
        </div>
      </div>

      <PomodoroSettingsModal
        open={isSettingsOpen}
        config={config}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newConfig) => void handleSaveSettings(newConfig)}
      />
    </>
  );
}

function mapSessionConfigurationToPomodoroConfig(
  configuration: SessionConfiguration
): PomodoroConfig {
  return {
    workSeconds: configuration.workDuration,
    shortRestSeconds: configuration.shortBreakDuration,
    longRestSeconds: configuration.longBreakDuration,
    cyclesBeforeLongRest: configuration.cyclesBeforeLongBreak,
  };
}

function mapPomodoroConfigToSessionConfigurationRequest(
  config: PomodoroConfig
): SessionConfigurationRequest {
  return {
    workDuration: config.workSeconds,
    shortBreakDuration: config.shortRestSeconds,
    longBreakDuration: config.longRestSeconds,
    cyclesBeforeLongBreak: config.cyclesBeforeLongRest,
  };
}

function buildStartSessionRequest(
  sessionConfigurationId: string
): SessionRequest {
  return {
    sessionConfigurationId,
    startedAt: new Date().toISOString(),
    endedAt: null,
    workMinutesUsed: 0,
    shortBreakDurationUsed: 0,
    longBreakDurationUsed: 0,
    pomodoros: [],
  };
}

function buildFinishSessionRequest(
  sessionConfigurationId: string,
  usedSeconds: UsedSecondsByStatus
): SessionRequest {
  return {
    sessionConfigurationId,
    endedAt: new Date().toISOString(),
    workMinutesUsed: secondsToRoundedMinutes(usedSeconds.work),
    shortBreakDurationUsed: secondsToRoundedMinutes(usedSeconds.shortRest),
    longBreakDurationUsed: secondsToRoundedMinutes(usedSeconds.longRest),
    pomodoros: [],
  };
}

export default PomodoroTimer;