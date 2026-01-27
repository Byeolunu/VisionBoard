
export type ProgrammingLanguage = 'Auto' | 'Python' | 'JavaScript' | 'TypeScript' | 'Java' | 'C++' | 'Go' | 'LaTeX' | 'Markdown' | 'SQL';

export type OutputMode = 'auto' | 'code' | 'diagram' | 'math' | 'notes';

export interface User {
  email: string;
  name: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface SavedFlashcard extends Flashcard {
  id: string;
  deckName: string;
  dateAdded: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AnalysisResult {
  detectedType: 'code' | 'diagram' | 'math' | 'notes';
  suggestedLanguage: string;
  reasoning: string;
  
  title: string;
  transcription: string;
  explanation: string;
  code?: string;
  diagram?: string;
  flashcards?: Flashcard[];
  
  quiz?: QuizQuestion[];
  
  secondaryInfo: {
    complexity?: string;
    edgeCases?: string[];
    relatedConcepts?: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string;
  mode: OutputMode;
  result: AnalysisResult;
  language: ProgrammingLanguage;
}

export interface FileUpload {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}
