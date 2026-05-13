import { useEffect, useState } from "react";
import "../styles/Settings.css";
import type { SessionConfiguration, SessionConfigurationRequest } from "../types/sessionConfiguration";
import { getSessionConfigurationRequest, putSessionConfigurationRequest } from "../services/sessionConfigurationService";
import type { LocalAppSettings } from "../types/settings";
import DurationInput from "../components/DurationInput";
import { getStoredUser, saveStoredUser } from "../services/userStorageService";
import { patchUserMeRequest } from "../services/userService";
import type { Statistics } from "../types/statistics";
import {getStatistics} from "../services/statisticsService.ts";
import {getProjectsRequest} from "../services/projectService.ts";
import type {Project} from "../types/project.ts";
import {formatSeconds} from "../services/statisticsService.ts";


const LOCAL_APP_SETTINGS_STORAGE_KEY = "localAppSettings";

function getUserScopedStorageKey(baseKey: string): string {
  const userId = getStoredUser()?.id;

  return userId ? `${baseKey}:${userId}` : baseKey;
}

function getStoredLocalAppSettings(): LocalAppSettings {
  const storageKey = getUserScopedStorageKey(LOCAL_APP_SETTINGS_STORAGE_KEY);
  const storedSettings = localStorage.getItem(storageKey);

  if (!storedSettings) {
    return defaultLocalAppSettings;
  }

  try {
    return {
      ...defaultLocalAppSettings,
      ...(JSON.parse(storedSettings) as Partial<LocalAppSettings>),
    };
  } catch (error) {
    console.error("Error leyendo los ajustes locales", error);
    localStorage.removeItem(storageKey);
    return defaultLocalAppSettings;
  }
}

function saveStoredLocalAppSettings(settings: LocalAppSettings): void {
  localStorage.setItem(
    getUserScopedStorageKey(LOCAL_APP_SETTINGS_STORAGE_KEY),
    JSON.stringify(settings)
  );
}

//Variable para guardar la configuración en el localStorage
const defaultLocalAppSettings: LocalAppSettings = {
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationsEnabled: true,
};

function Settings() {
  const [user, setUser] = useState(() => getStoredUser());
  const [username, setUsername] = useState(user?.username ?? "");
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);


  const [sessionConfiguration, setSessionConfiguration] =
    useState<SessionConfiguration | null>(null);
  const [savedSessionConfiguration, setSavedSessionConfiguration] =
    useState<SessionConfiguration | null>(null);

  const [localAppSettings, setLocalAppSettings] = useState<LocalAppSettings>(
    () => getStoredLocalAppSettings()
  );

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  const [isLoadingSessionConfig, setIsLoadingSessionConfig] = useState(true);
  const [isSavingSessionConfig, setIsSavingSessionConfig] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [sessionConfigMessage, setSessionConfigMessage] = useState("");
  const [profileMessage, setProfileMessage] = useState("");


  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await getProjectsRequest();
        setProjects(loadedProjects);
      } catch (error) {
        console.error("Error cargando proyectos", error);
      }
    };

    void loadProjects();
  }, []);


  useEffect(() => {
    const loadSessionConfiguration = async () => {
      try {
        const configuration = await getSessionConfigurationRequest();

        setSessionConfiguration(configuration);
        setSavedSessionConfiguration(configuration);
      } catch (error) {
        console.error("Error cargando la configuración de sesión", error);
        setSessionConfigMessage(
          "No se ha podido cargar la configuración de sesión."
        );
      } finally {
        setIsLoadingSessionConfig(false);
      }
    };

    void loadSessionConfiguration();
  }, []);

  useEffect(() => {
    saveStoredLocalAppSettings(localAppSettings);
  }, [localAppSettings]);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  }, [lightMode]);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const loadedStatistics = await getStatistics();
        setStatistics(loadedStatistics);
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      }
    };

    void loadStatistics();
  }, []);


  const updateSessionConfiguration = <K extends keyof SessionConfiguration>(
    key: K,
    value: SessionConfiguration[K]
  ) => {
    setSessionConfiguration((prevConfig) => {
      if (!prevConfig) return prevConfig;

      return {
        ...prevConfig,
        [key]: value,
      };
    });
  };

  const updateLocalAppSetting = <K extends keyof LocalAppSettings>(
    key: K,
    value: LocalAppSettings[K]
  ) => {
    setLocalAppSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSaveUser = async () => {
    if (!user) return;

    const trimmedUsername = username.trim();

    if (trimmedUsername === "") {
      setProfileMessage("El nombre de usuario no puede estar vacío.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const updatedUser = await patchUserMeRequest({
        username: trimmedUsername,
      });

      saveStoredUser(updatedUser);
      setUser(updatedUser);

      setProfileMessage("Perfil guardado correctamente.");

      window.setTimeout(() => {
        setProfileMessage("");
      }, 2500);
    } catch (error) {
      console.error("Error actualizando el perfil", error);
      setProfileMessage("No se ha podido actualizar el perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleResetSessionConfiguration = () => {
    if (!savedSessionConfiguration) return;

    setSessionConfiguration(savedSessionConfiguration);
    setSessionConfigMessage("Cambios descartados.");

    window.setTimeout(() => {
      setSessionConfigMessage("");
    }, 2500);
  };

  const handleSaveSessionConfiguration = async () => {
    if (!sessionConfiguration) return;

    if (
      sessionConfiguration.workDuration <= 0 ||
      sessionConfiguration.shortBreakDuration <= 0 ||
      sessionConfiguration.longBreakDuration <= 0
    ) {
      setSessionConfigMessage(
        "La duración de trabajo y descansos debe ser mayor que 0."
      );
      return;
    }

    if (sessionConfiguration.cyclesBeforeLongBreak <= 0) {
      setSessionConfigMessage(
        "El número de pomodoros antes del descanso largo debe ser mayor que 0."
      );
      return;
    }

    setIsSavingSessionConfig(true);

    const request: SessionConfigurationRequest = {
      workDuration: sessionConfiguration.workDuration,
      shortBreakDuration: sessionConfiguration.shortBreakDuration,
      longBreakDuration: sessionConfiguration.longBreakDuration,
      cyclesBeforeLongBreak: sessionConfiguration.cyclesBeforeLongBreak,
    };

    try {
      const updatedConfiguration = await putSessionConfigurationRequest(request);

      setSessionConfiguration(updatedConfiguration);
      setSavedSessionConfiguration(updatedConfiguration);

      setSessionConfigMessage("Configuración guardada correctamente.");

      window.setTimeout(() => {
        setSessionConfigMessage("");
      }, 2500);
    } catch (error) {
      console.error("Error guardando la configuración de sesión", error);
      setSessionConfigMessage("No se ha podido guardar la configuración.");
    } finally {
      setIsSavingSessionConfig(false);
    }
  };

  const hasUnsavedSessionConfiguration =
    JSON.stringify(sessionConfiguration) !==
    JSON.stringify(savedSessionConfiguration);

  const mostWorkedProjectName =
      projects.find((project) => project.id === statistics?.mostWorkedProject)
          ?.name ?? "--";

  return (
    <section className="settings-page">
      <header className="settings-header">
        <div>
          <h1>Ajustes</h1>
          <p>Personaliza tu perfil, tus sesiones de enfoque y la aplicación.</p>
        </div>
      </header>

      <div className="settings-grid">
        <article className="settings-card">
          <h2>Perfil de usuario</h2>

          <div className="settings-field">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
            />
          </div>

          <button
            className="primary-settings-button"
            type="button"
            onClick={() => void handleSaveUser()}
            disabled={isSavingProfile}
          >
            {isSavingProfile ? "Guardando..." : "Guardar perfil"}
          </button>

          {profileMessage && (
            <p className="settings-save-message">{profileMessage}</p>
          )}
        </article>

        <article className="settings-card">
          <h2>Configuración Pomodoro</h2>

          {isLoadingSessionConfig ? (
            <p className="settings-loading">Cargando configuración...</p>
          ) : !sessionConfiguration ? (
            <p className="settings-error">
              No se ha podido cargar la configuración.
            </p>
          ) : (
            <>
              <DurationInput
                id="workDuration"
                label="Duración del trabajo"
                totalSeconds={sessionConfiguration.workDuration}
                onChange={(value) =>
                  updateSessionConfiguration("workDuration", value)
                }
              />

              <DurationInput
                id="shortBreakDuration"
                label="Descanso corto"
                totalSeconds={sessionConfiguration.shortBreakDuration}
                onChange={(value) =>
                  updateSessionConfiguration("shortBreakDuration", value)
                }
              />

              <DurationInput
                id="longBreakDuration"
                label="Descanso largo"
                totalSeconds={sessionConfiguration.longBreakDuration}
                onChange={(value) =>
                  updateSessionConfiguration("longBreakDuration", value)
                }
              />

              <div className="settings-field">
                <label htmlFor="cyclesBeforeLongBreak">
                  Descanso largo cada
                </label>
                <div className="settings-input-unit">
                  <input
                    id="cyclesBeforeLongBreak"
                    type="number"
                    min={1}
                    value={sessionConfiguration.cyclesBeforeLongBreak}
                    onChange={(e) =>
                      updateSessionConfiguration(
                        "cyclesBeforeLongBreak",
                        Number(e.target.value)
                      )
                    }
                  />
                  <span>pomodoros</span>
                </div>
              </div>

              <div className="settings-actions">
                <button
                  className="secondary-settings-button"
                  type="button"
                  onClick={handleResetSessionConfiguration}
                  disabled={
                    !hasUnsavedSessionConfiguration || isSavingSessionConfig
                  }
                >
                  Descartar cambios
                </button>

                <button
                  className="save-settings-button"
                  type="button"
                  onClick={() => void handleSaveSessionConfiguration()}
                  disabled={
                    !hasUnsavedSessionConfiguration || isSavingSessionConfig
                  }
                >
                  {isSavingSessionConfig
                    ? "Guardando..."
                    : "Guardar configuración"}
                </button>
              </div>
            </>
          )}

          {sessionConfigMessage && (
            <p className="settings-save-message">{sessionConfigMessage}</p>
          )}
        </article>

        <article className="settings-card">
          <h2>Comportamiento de la sesión</h2>

          <label className="settings-switch-row">
            <div>
              <strong>Iniciar descansos automáticamente</strong>
              <span>Cuando termine un pomodoro, empieza el descanso.</span>
            </div>

            <input
              type="checkbox"
              checked={localAppSettings.autoStartBreaks}
              onChange={(e) =>
                updateLocalAppSetting("autoStartBreaks", e.target.checked)
              }
            />
          </label>

          <label className="settings-switch-row">
            <div>
              <strong>Iniciar pomodoros automáticamente</strong>
              <span>Cuando termine un descanso, empieza otra sesión.</span>
            </div>

            <input
              type="checkbox"
              checked={localAppSettings.autoStartPomodoros}
              onChange={(e) =>
                updateLocalAppSetting("autoStartPomodoros", e.target.checked)
              }
            />
          </label>
        </article>

        <article className="settings-card">
          <h2>Apariencia</h2>

          <label className="settings-switch-row">
            <div>
              <strong>Modo claro</strong>
              <span>Cambia entre tema claro y oscuro.</span>
            </div>

            <input
              type="checkbox"
              checked={lightMode}
              onChange={(e) => setLightMode(e.target.checked)}
            />
          </label>
        </article>

        <article className="settings-card settings-card-wide">
          <h2>Resumen personal</h2>

          <div className="settings-stats-grid">
            <div className="settings-stat">
              <span>Sesiones completadas</span>
              <strong>{statistics?.completedSessions ?? "--"}</strong>
            </div>

            <div className="settings-stat">
              <span>Tiempo total enfocado</span>
              <strong>{formatSeconds(statistics?.totalFocusedTime)}</strong>
            </div>

            <div className="settings-stat">
              <span>Proyecto más trabajado</span>
              <strong>{mostWorkedProjectName}</strong>
            </div>

            <div className="settings-stat">
              <span>Tiempo hoy</span>
              <strong>{formatSeconds(statistics?.timeToday)}</strong>
            </div>

            <div className="settings-stat">
              <span>Pomodoros completados</span>
              <strong>{statistics?.pomodorosCompleted ?? "--"}</strong>
            </div>

            <div className="settings-stat">
              <span>tareas completadas</span>
              <strong>{statistics?.taskCompleted ?? "--"}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Settings;