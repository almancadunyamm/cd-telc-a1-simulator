export type SectionType = "Hören" | "Lesen" | "Schreiben";
export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_text"
  | "long_text";

export type Question = {
  id: number;
  title: string;
  instruction?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  section: SectionType;
  part: string;
  type: QuestionType;
};