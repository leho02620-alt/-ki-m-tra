
export type Grade = '6' | '7' | '8' | '9';

export type Level = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export type QuestionType = 'Trắc nghiệm' | 'Tự luận';

export type AiModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash';

export interface Question {
  id: string;
  grade: Grade;
  topic: string;
  level: Level;
  type: QuestionType;
  content: string;
  options?: string[]; // For MC questions
  correctAnswer: string; // A/B/C/D for MC, result for Essay
  explanation: string;
}

export interface ExamConfig {
  title: string;
  schoolName: string;
  className: string;
  timeMinutes: number;
  grade: Grade;
  topic: string;
  numQuestions: number;
  mcRatio: number; // 0 to 100
}

export interface GeneratedExam {
  config: ExamConfig;
  questions: Question[];
  date: string;
}
