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
export function secondsToRoundedMinutes(totalSeconds: number): number {
  return Math.round(totalSeconds / 60);
}