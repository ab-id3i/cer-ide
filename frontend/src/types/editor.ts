// Types et interfaces pour l'éditeur collaboratif CER IDE

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface CursorPayload {
  userId: string;
  position: CursorPosition;
}

export interface UserColors {
  [userId: string]: string;
}

export interface Snippet {
  title: string;
  code: string;
  category?: 'structure' | 'action';
} 