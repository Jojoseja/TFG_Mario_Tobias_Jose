import { useEffect, useState } from "react";
import "../styles/PomodoroSettingsModal.css";
import { IoClose } from "react-icons/io5";

export type PomodoroConfig = {
  workSeconds: number;
  shortRestSeconds: number;
  longRestSeconds: number;
  cyclesBeforeLongRest: number;
};

type PomodoroSettingsModalProps = {
  open: boolean;
  config: PomodoroConfig;
  onClose: () => void;
  onSave: (config: PomodoroConfig) => void;
};

function PomodoroSettingsModal({
  open,
  config,
  onClose,
  onSave,
}: PomodoroSettingsModalProps) {
  const [workMinutes, setWorkMinutes] = useState("");
  const [workSeconds, setWorkSeconds] = useState("");

  const [shortRestMinutes, setShortRestMinutes] = useState("");
  const [shortRestSeconds, setShortRestSeconds] = useState("");

  const [longRestMinutes, setLongRestMinutes] = useState("");
  const [longRestSeconds, setLongRestSeconds] = useState("");

  const [cyclesBeforeLongRest, setCyclesBeforeLongRest] = useState("");
  const [error, setError] = useState("");

  const getMinutes = (totalSeconds: number) => Math.floor(totalSeconds / 60);

  const getSecondsRemainder = (totalSeconds: number) => totalSeconds % 60;

  const toTotalSeconds = (minutes: number, seconds: number) => {
    return minutes * 60 + seconds;
  };

  const parseInputNumber = (value: string) => {
    if (value.trim() === "") return 0;
    return Number(value);
  };

  useEffect(() => {
    if (!open) return;

    setWorkMinutes(String(getMinutes(config.workSeconds)));
    setWorkSeconds(String(getSecondsRemainder(config.workSeconds)));

    setShortRestMinutes(String(getMinutes(config.shortRestSeconds)));
    setShortRestSeconds(String(getSecondsRemainder(config.shortRestSeconds)));

    setLongRestMinutes(String(getMinutes(config.longRestSeconds)));
    setLongRestSeconds(String(getSecondsRemainder(config.longRestSeconds)));

    setCyclesBeforeLongRest(String(config.cyclesBeforeLongRest));
    setError("");
  }, [open, config]);

  if (!open) return null;

  const handleNumberChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    max?: number
  ) => {
    if (value === "") {
      setter("");
      return;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) return;
    if (parsedValue < 0) return;
    if (max !== undefined && parsedValue > max) return;

    setter(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedWorkMinutes = parseInputNumber(workMinutes);
    const parsedWorkSeconds = parseInputNumber(workSeconds);

    const parsedShortRestMinutes = parseInputNumber(shortRestMinutes);
    const parsedShortRestSeconds = parseInputNumber(shortRestSeconds);

    const parsedLongRestMinutes = parseInputNumber(longRestMinutes);
    const parsedLongRestSeconds = parseInputNumber(longRestSeconds);

    const parsedCyclesBeforeLongRest = parseInputNumber(cyclesBeforeLongRest);

    const newWorkSeconds = toTotalSeconds(
      parsedWorkMinutes,
      parsedWorkSeconds
    );

    const newShortRestSeconds = toTotalSeconds(
      parsedShortRestMinutes,
      parsedShortRestSeconds
    );

    const newLongRestSeconds = toTotalSeconds(
      parsedLongRestMinutes,
      parsedLongRestSeconds
    );

    if (
      newWorkSeconds <= 0 ||
      newShortRestSeconds <= 0 ||
      newLongRestSeconds <= 0
    ) {
      setError("La duración de trabajo y descansos debe ser mayor que 0.");
      return;
    }

    if (parsedCyclesBeforeLongRest <= 0) {
      setError("El número de pomodoros antes del descanso largo debe ser mayor que 0.");
      return;
    }

    onSave({
      workSeconds: newWorkSeconds,
      shortRestSeconds: newShortRestSeconds,
      longRestSeconds: newLongRestSeconds,
      cyclesBeforeLongRest: parsedCyclesBeforeLongRest,
    });

    onClose();
  };

  return (
    <div className="pomo-settings-overlay" onClick={onClose}>
      <div
        className="pomo-settings-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pomo-settings-header">
          <div>
            <h2>Configuración Pomodoro</h2>
            <p>Ajusta la duración de tus ciclos de trabajo y descanso.</p>
          </div>

          <button
            className="pomo-settings-close"
            type="button"
            onClick={onClose}
            title="Cerrar"
          >
            <IoClose />
          </button>
        </div>

        <form className="pomo-settings-form" onSubmit={handleSubmit}>
          <div className="pomo-settings-field">
            <label>Tiempo de trabajo</label>
            <div className="pomo-time-row">
              <div className="pomo-time-input">
                <input
                  type="number"
                  min={0}
                  value={workMinutes}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setWorkMinutes)
                  }
                />
                <span>min</span>
              </div>

              <div className="pomo-time-input">
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={workSeconds}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setWorkSeconds, 59)
                  }
                />
                <span>seg</span>
              </div>
            </div>
          </div>

          <div className="pomo-settings-field">
            <label>Descanso corto</label>
            <div className="pomo-time-row">
              <div className="pomo-time-input">
                <input
                  type="number"
                  min={0}
                  value={shortRestMinutes}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setShortRestMinutes)
                  }
                />
                <span>min</span>
              </div>

              <div className="pomo-time-input">
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={shortRestSeconds}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setShortRestSeconds, 59)
                  }
                />
                <span>seg</span>
              </div>
            </div>
          </div>

          <div className="pomo-settings-field">
            <label>Descanso largo</label>
            <div className="pomo-time-row">
              <div className="pomo-time-input">
                <input
                  type="number"
                  min={0}
                  value={longRestMinutes}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setLongRestMinutes)
                  }
                />
                <span>min</span>
              </div>

              <div className="pomo-time-input">
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={longRestSeconds}
                  onChange={(e) =>
                    handleNumberChange(e.target.value, setLongRestSeconds, 59)
                  }
                />
                <span>seg</span>
              </div>
            </div>
          </div>

          <div className="pomo-settings-field">
            <label htmlFor="cycles-before-long-rest">
              Descanso largo cada
            </label>
            <div className="pomo-settings-input-row">
              <input
                id="cycles-before-long-rest"
                type="number"
                min={1}
                value={cyclesBeforeLongRest}
                onChange={(e) =>
                  handleNumberChange(e.target.value, setCyclesBeforeLongRest)
                }
              />
              <span>pomodoros</span>
            </div>
          </div>

          {error && <p className="pomo-settings-error">{error}</p>}

          <div className="pomo-settings-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button type="submit" className="primary-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PomodoroSettingsModal;