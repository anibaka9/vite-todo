export interface TodoShape {
  readonly isDone: boolean;
  readonly text: string;
  readonly id: string;
}

export type Mode = 'active' | 'all' | 'completed';
