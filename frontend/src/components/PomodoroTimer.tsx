import { useEffect, useRef, useState } from "react";
import "../styles/PomodoroTimer.css";
import { FaGear } from "react-icons/fa6";
import PomodoroSettingsModal from "./PomodoroSettingsModal";
import type { PomodoroConfig } from "./PomodoroSettingsModal";
import type {
  SessionConfiguration,
  SessionConfigurationRequest,
} from "../types/sessionConfiguration";
import type { SessionRequest } from "../types/session";
import type {
  BackendSessionType,
  PomodoroResponse,
} from "../types/pomodoro";
import {
  getSessionConfigurationRequest,
  putSessionConfigurationRequest,
} from "../services/sessionConfigurationService";
import {
  finishSessionRequest,
  startSessionRequest,
} from "../services/sessionService";
import {
  createPomodoroRequest,
  updatePomodoroRequest,
} from "../services/pomodoroService";
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

type StoredPomodoroTimerState = {
  activeSessionId: string;
  activePomodoro: PomodoroResponse | null;
  pomodoroOrderIndex: number;
  sessionConfigurationId: string | null;
  sessionStatus: SessionStatus;
  completedPomodoros: number;
  seconds: number;
  usedSeconds: UsedSecondsByStatus;
};

const POMODORO_TIMER_STORAGE_KEY = "pomodoroTimerState";

const initialUsedSeconds: UsedSecondsByStatus = {
  work: 0,
  shortRest: 0,
  longRest: 0,
};

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
  const [activePomodoro, setActivePomodoro] =
    useState<PomodoroResponse | null>(null);
  const [pomodoroOrderIndex, setPomodoroOrderIndex] = useState(0);

  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isFinishingSession, setIsFinishingSession] = useState(false);
  const [isChangingPomodoro, setIsChangingPomodoro] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [usedSeconds, setUsedSeconds] =
    useState<UsedSecondsByStatus>(initialUsedSeconds);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  const hasLoadedInitialStateRef = useRef(false);

  const currentTotalSeconds =
    sessionStatus === "work"
      ? config.workSeconds
      : sessionStatus === "shortRest"
      ? config.shortRestSeconds
      : config.longRestSeconds;

  const isTimerActionDisabled =
    isLoadingConfig ||
    isStartingSession ||
    isFinishingSession ||
    isChangingPomodoro;

  useEffect(() => {
    const loadSessionConfiguration = async () => {
      try {
        const configuration = await getSessionConfigurationRequest();
        const loadedConfig =
          mapSessionConfigurationToPomodoroConfig(configuration);

        setSessionConfigurationId(configuration.id);
        setConfig(loadedConfig);

        const storedTimerState = getStoredPomodoroTimerState();

        if (storedTimerState?.activeSessionId) {
          setActiveSessionId(storedTimerState.activeSessionId);
          setActivePomodoro(storedTimerState.activePomodoro);
          setPomodoroOrderIndex(storedTimerState.pomodoroOrderIndex);
          setSessionConfigurationId(
            storedTimerState.sessionConfigurationId ?? configuration.id
          );
          setSessionStatus(storedTimerState.sessionStatus);
          setCompletedPomodoros(storedTimerState.completedPomodoros);
          setSeconds(storedTimerState.seconds);
          setUsedSeconds(storedTimerState.usedSeconds);

          // Al volver de otra página, dejamos el timer pausado.
          // Así no se pierden datos ni se crean sesiones duplicadas.
          setIsRunning(false);
        } else {
          setSeconds(loadedConfig.workSeconds);
        }
      } catch (error) {
        console.error("Error cargando la configuración del Pomodoro", error);
        showNotification(
          "error",
          "No se ha podido cargar la configuración. Se usarán valores por defecto."
        );
      } finally {
        hasLoadedInitialStateRef.current = true;
        setIsLoadingConfig(false);
      }
    };

    void loadSessionConfiguration();
  }, []);

  useEffect(() => {
    if (!hasLoadedInitialStateRef.current) return;

    if (!activeSessionId) {
      clearStoredPomodoroTimerState();
      return;
    }

    saveStoredPomodoroTimerState({
      activeSessionId,
      activePomodoro,
      pomodoroOrderIndex,
      sessionConfigurationId,
      sessionStatus,
      completedPomodoros,
      seconds,
      usedSeconds,
    });
  }, [
    activeSessionId,
    activePomodoro,
    pomodoroOrderIndex,
    sessionConfigurationId,
    sessionStatus,
    completedPomodoros,
    seconds,
    usedSeconds,
  ]);

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
          void moveToNextSessionStatus(true);
          return 0;
        }

        return prevSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [
    isRunning,
    sessionStatus,
    activeSessionId,
    activePomodoro,
    completedPomodoros,
    pomodoroOrderIndex,
    config,
  ]);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });

    window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleStart = async () => {
    if (isTimerActionDisabled) return;

    if (!sessionConfigurationId) {
      showNotification(
        "error",
        "No se puede iniciar la sesión porque falta la configuración."
      );
      return;
    }

    let createdSessionId: string | null = null;

    try {
      setIsStartingSession(true);

      if (!activeSessionId) {
        const sessionRequest = buildStartSessionRequest(sessionConfigurationId);
        const startedSession = await startSessionRequest(sessionRequest);

        createdSessionId = startedSession.id;

        const firstPomodoro = await createPomodoroRequest({
          orderIndex: 1,
          completed: false,
          sessionType: "WORK",
          sessionId: startedSession.id,
        });

        setActiveSessionId(startedSession.id);
        setActivePomodoro(firstPomodoro);
        setPomodoroOrderIndex(1);
      }

      setIsRunning(true);
    } catch (error) {
      console.error("Error iniciando sesión Pomodoro", error);

      if (createdSessionId) {
        try {
          await finishSessionRequest(
            createdSessionId,
            buildFinishSessionRequest(sessionConfigurationId, initialUsedSeconds)
          );
        } catch (finishError) {
          console.error(
            "No se ha podido cerrar la sesión creada tras fallar el pomodoro",
            finishError
          );
        }
      }

      showNotification("error", "No se ha podido iniciar la sesión.");
    } finally {
      setIsStartingSession(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const moveToNextSessionStatus = async (
    completeCurrentPomodoro: boolean
  ) => {
    if (isTimerActionDisabled || !activeSessionId) return;

    try {
      setIsChangingPomodoro(true);
      setIsRunning(false);

      if (activePomodoro && completeCurrentPomodoro) {
        await updatePomodoroRequest(activePomodoro.id, {
          orderIndex: activePomodoro.orderIndex,
          completed: true,
          sessionType: activePomodoro.sessionType,
          sessionId: activePomodoro.sessionId,
        });
      }

      const { nextStatus, nextCompletedPomodoros } = getNextSessionStatus(
        sessionStatus,
        completedPomodoros,
        config.cyclesBeforeLongRest
      );

      const nextOrderIndex = pomodoroOrderIndex + 1;

      const nextPomodoro = await createPomodoroRequest({
        orderIndex: nextOrderIndex,
        completed: false,
        sessionType: mapSessionStatusToBackendSessionType(nextStatus),
        sessionId: activeSessionId,
      });

      setCompletedPomodoros(nextCompletedPomodoros);
      setSessionStatus(nextStatus);
      setSeconds(getSecondsForSessionStatus(nextStatus, config));
      setPomodoroOrderIndex(nextOrderIndex);
      setActivePomodoro(nextPomodoro);
    } catch (error) {
      console.error("Error cambiando de pomodoro", error);
      showNotification("error", "No se ha podido cambiar al siguiente tramo.");
    } finally {
      setIsChangingPomodoro(false);
    }
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
    if (isTimerActionDisabled) return;

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
      setActivePomodoro(null);
      setPomodoroOrderIndex(0);
      setCompletedPomodoros(0);
      setSessionStatus("work");
      setSeconds(config.workSeconds);
      setUsedSeconds(initialUsedSeconds);
      clearStoredPomodoroTimerState();

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
      setActivePomodoro(null);
      setPomodoroOrderIndex(0);
      setUsedSeconds(initialUsedSeconds);
      setIsSettingsOpen(false);
      clearStoredPomodoroTimerState();

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
              disabled={isFinishingSession || isChangingPomodoro}
            >
              Pausar
            </button>
          )}

          <button
            className="secondary-button"
            type="button"
            onClick={() => void moveToNextSessionStatus(false)}
            disabled={isTimerActionDisabled || !activeSessionId}
          >
            {isChangingPomodoro ? "Cambiando..." : "Saltar"}
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

function mapSessionStatusToBackendSessionType(
  status: SessionStatus
): BackendSessionType {
  if (status === "work") return "WORK";
  if (status === "shortRest") return "SHORT_BREAK";
  return "LONG_BREAK";
}

function getNextSessionStatus(
  currentStatus: SessionStatus,
  completedPomodoros: number,
  cyclesBeforeLongRest: number
): {
  nextStatus: SessionStatus;
  nextCompletedPomodoros: number;
} {
  if (currentStatus === "work") {
    const nextCompletedPomodoros = completedPomodoros + 1;

    if (nextCompletedPomodoros % cyclesBeforeLongRest === 0) {
      return {
        nextStatus: "longRest",
        nextCompletedPomodoros,
      };
    }

    return {
      nextStatus: "shortRest",
      nextCompletedPomodoros,
    };
  }

  return {
    nextStatus: "work",
    nextCompletedPomodoros: completedPomodoros,
  };
}

function getSecondsForSessionStatus(
  status: SessionStatus,
  config: PomodoroConfig
): number {
  if (status === "work") return config.workSeconds;
  if (status === "shortRest") return config.shortRestSeconds;
  return config.longRestSeconds;
}

function saveStoredPomodoroTimerState(state: StoredPomodoroTimerState) {
  localStorage.setItem(POMODORO_TIMER_STORAGE_KEY, JSON.stringify(state));
}

function getStoredPomodoroTimerState(): StoredPomodoroTimerState | null {
  const storedState = localStorage.getItem(POMODORO_TIMER_STORAGE_KEY);

  if (!storedState) return null;

  try {
    return JSON.parse(storedState) as StoredPomodoroTimerState;
  } catch (error) {
    console.error("Error leyendo el estado guardado del Pomodoro", error);
    clearStoredPomodoroTimerState();
    return null;
  }
}

function clearStoredPomodoroTimerState() {
  localStorage.removeItem(POMODORO_TIMER_STORAGE_KEY);
}

export default PomodoroTimer;