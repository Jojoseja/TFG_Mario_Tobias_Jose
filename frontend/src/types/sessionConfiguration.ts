export interface SessionConfiguration {
    id: string,
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    cyclesBeforeLongBreak: number;
    ownerId?: string; 
}

export interface SessionResponse {
  id: string;
  startedAt: string;
  endedAt?: string;
  workMinutesUsed: number;
  shortBreakDurationUsed: number;
  longBreakDurationUsed: number;
  taskIds: string[];
  pomodoros: PomodoroResponse[];
  sessionConfigurationId: string;
}

export interface PomodoroRequest {
  orderIndex: number;
  completed: boolean;
  sessionType: "WORK" | "SHORT_BREAK" | "LONG_BREAK";
}

export interface PomodoroResponse {
  id: string;
  orderIndex: number;
  completed: boolean;
  sessionType: "WORK" | "SHORT_BREAK" | "LONG_BREAK";
}