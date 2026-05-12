export function getMinutes(totalSeconds: number): number {
  return Math.floor(totalSeconds / 60);
}

export function getSecondsRemainder(totalSeconds: number): number {
  return totalSeconds % 60;
}

export function toTotalSeconds(minutes: number, seconds: number): number {
  return minutes * 60 + seconds;
}

export function parseInputNumber(value: string): number {
  if (value.trim() === "") return 0;
  return Number(value);
}
//TODO: No se si queremos contar que si una persona ha trabajado 1min y 30s cuente como 1min o 2min
export function secondsToRoundedMinutes(totalSeconds: number): number {
  return Math.round(totalSeconds / 60);
}