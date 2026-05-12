import {
  getMinutes,
  getSecondsRemainder,
  parseInputNumber,
  toTotalSeconds,
} from "../utils/timeUtils";

type DurationInputProps = {
  id: string;
  label: string;
  totalSeconds: number;
  onChange: (totalSeconds: number) => void;
};

function DurationInput({ id, label, totalSeconds, onChange }: DurationInputProps) {
  const minutes = getMinutes(totalSeconds);
  const seconds = getSecondsRemainder(totalSeconds);

  const handleMinutesChange = (value: string) => {
    const parsedMinutes = parseInputNumber(value);

    if (parsedMinutes < 0 || Number.isNaN(parsedMinutes)) return;

    onChange(toTotalSeconds(parsedMinutes, seconds));
  };

  const handleSecondsChange = (value: string) => {
    const parsedSeconds = parseInputNumber(value);

    if (
      parsedSeconds < 0 ||
      parsedSeconds > 59 ||
      Number.isNaN(parsedSeconds)
    ) {
      return;
    }

    onChange(toTotalSeconds(minutes, parsedSeconds));
  };

  return (
    <div className="settings-field">
      <label htmlFor={`${id}-minutes`}>{label}</label>

      <div className="settings-time-row">
        <div className="settings-input-unit">
          <input
            id={`${id}-minutes`}
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => handleMinutesChange(e.target.value)}
          />
          <span>min</span>
        </div>

        <div className="settings-input-unit">
          <input
            id={`${id}-seconds`}
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => handleSecondsChange(e.target.value)}
          />
          <span>seg</span>
        </div>
      </div>
    </div>
  );
}

export default DurationInput;