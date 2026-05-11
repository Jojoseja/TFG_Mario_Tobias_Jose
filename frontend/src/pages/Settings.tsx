import { useEffect, useState } from "react";
import "../styles/Settings.css";
import type { User } from "../types/user";

type PomodoroSettings = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
};

const defaultPomodoroSettings: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationsEnabled: true,
};

function Settings() {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [username, setUsername] = useState(user?.username ?? "");

  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const storedSettings = localStorage.getItem("pomodoroSettings");

    if (!storedSettings) {
      return defaultPomodoroSettings;
    }

    return JSON.parse(storedSettings);
  });

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  }, [lightMode]);

  const updateSetting = <K extends keyof PomodoroSettings>(
    key: K,
    value: PomodoroSettings[K]
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSaveUser = () => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      username: username.trim(),
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleResetSettings = () => {
    setSettings(defaultPomodoroSettings);
  };

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
        </article>

        <article className="settings-card">
          <h2>Configuración Pomodoro</h2>

          <div className="settings-field">
            <label htmlFor="workMinutes">Duración del trabajo</label>
            <div className="settings-input-unit">
              <input
                id="workMinutes"
                type="number"
                min={1}
                value={settings.workMinutes}
                onChange={(e) =>
                  updateSetting("workMinutes", Number(e.target.value))
                }
              />
              <span>min</span>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="shortBreakMinutes">Descanso corto</label>
            <div className="settings-input-unit">
              <input
                id="shortBreakMinutes"
                type="number"
                min={1}
                value={settings.shortBreakMinutes}
                onChange={(e) =>
                  updateSetting("shortBreakMinutes", Number(e.target.value))
                }
              />
              <span>min</span>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="longBreakMinutes">Descanso largo</label>
            <div className="settings-input-unit">
              <input
                id="longBreakMinutes"
                type="number"
                min={1}
                value={settings.longBreakMinutes}
                onChange={(e) =>
                  updateSetting("longBreakMinutes", Number(e.target.value))
                }
              />
              <span>min</span>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="pomodorosBeforeLongBreak">
              Descanso largo cada
            </label>
            <div className="settings-input-unit">
              <input
                id="pomodorosBeforeLongBreak"
                type="number"
                min={1}
                value={settings.pomodorosBeforeLongBreak}
                onChange={(e) =>
                  updateSetting(
                    "pomodorosBeforeLongBreak",
                    Number(e.target.value)
                  )
                }
              />
              <span>pomodoros</span>
            </div>
          </div>

          <button
            className="secondary-settings-button"
            type="button"
            onClick={handleResetSettings}
          >
            Restaurar valores por defecto
          </button>
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
              checked={settings.autoStartBreaks}
              onChange={(e) =>
                updateSetting("autoStartBreaks", e.target.checked)
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
              checked={settings.autoStartPomodoros}
              onChange={(e) =>
                updateSetting("autoStartPomodoros", e.target.checked)
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