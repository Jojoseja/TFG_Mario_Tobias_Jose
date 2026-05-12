import { useEffect, useState } from "react";
import "../styles/Settings.css";
import type { User } from "../types/user";
import type {
  SessionConfiguration,
  SessionConfigurationRequest,
} from "../types/sessionConfiguration";
import {
  getSessionConfigurationRequest,
  putSessionConfigurationRequest,
} from "../services/sessionConfigurationService";
import type { LocalAppSettings } from "../types/settings";
import DurationInput from "../components/DurationInput";

import { getStoredUser, saveStoredUser } from "../services/userStorageService";

const defaultLocalAppSettings: LocalAppSettings = {
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationsEnabled: true,
};

function Settings() {
  const user = getStoredUser();

  const [username, setUsername] = useState(user?.username ?? "");

  const [sessionConfiguration, setSessionConfiguration] =
    useState<SessionConfiguration | null>(null);

  const [savedSessionConfiguration, setSavedSessionConfiguration] =
    useState<SessionConfiguration | null>(null);

  const [localAppSettings, setLocalAppSettings] = useState<LocalAppSettings>(
    () => {
      const storedSettings = localStorage.getItem("localAppSettings");

      if (!storedSettings) {
        return defaultLocalAppSettings;
      }

      return JSON.parse(storedSettings);
    }
  );

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  const [isLoadingSessionConfig, setIsLoadingSessionConfig] = useState(true);
  const [isSavingSessionConfig, setIsSavingSessionConfig] = useState(false);

  const [sessionConfigMessage, setSessionConfigMessage] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

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
    localStorage.setItem("localAppSettings", JSON.stringify(localAppSettings));
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

  const handleSaveUser = () => {
    if (!user) return;

    if (username.trim() === "") {
      setProfileMessage("El nombre de usuario no puede estar vacío.");
      return;
    }

    const updatedUser: User = {
      ...user,
      username: username.trim(),
    };

    saveStoredUser(updatedUser);
    setProfileMessage("Perfil guardado correctamente.");

    window.setTimeout(() => {
      setProfileMessage("");
    }, 2500);
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
            onClick={handleSaveUser}
          >
            Guardar perfil
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
          <h2>Apariencia y notificaciones</h2>

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

          <label className="settings-switch-row">
            <div>
              <strong>Sonidos</strong>
              <span>Reproducir sonido al finalizar una sesión.</span>
            </div>

            <input
              type="checkbox"
              checked={localAppSettings.soundEnabled}
              onChange={(e) =>
                updateLocalAppSetting("soundEnabled", e.target.checked)
              }
            />
          </label>

          <label className="settings-switch-row">
            <div>
              <strong>Notificaciones</strong>
              <span>Mostrar aviso al terminar un pomodoro o descanso.</span>
            </div>

            <input
              type="checkbox"
              checked={localAppSettings.notificationsEnabled}
              onChange={(e) =>
                updateLocalAppSetting("notificationsEnabled", e.target.checked)
              }
            />
          </label>
        </article>

        <article className="settings-card settings-card-wide">
          <h2>Resumen personal</h2>

          <div className="settings-stats-grid">
            <div className="settings-stat">
              <span>Sesiones completadas</span>
              <strong>0</strong>
            </div>

            <div className="settings-stat">
              <span>Tiempo total enfocado</span>
              <strong>0 h</strong>
            </div>

            <div className="settings-stat">
              <span>Racha actual</span>
              <strong>0 días</strong>
            </div>

            <div className="settings-stat">
              <span>Proyecto más trabajado</span>
              <strong>-</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Settings;