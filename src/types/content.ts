export type LevelCode = "a1" | "a2" | "b1";

export type ExamStatus = "draft" | "published";

export type QuestionOption = {
  id: string;
  text: string;
};

export type HoerenQuestion = {
  id: string;
  type: "multiple_choice";
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
};

export type HoerenPart = {
  id: string;
  title: string;
  instructions: string;
  audioUrl: string;
  transcript: string;
  questions: HoerenQuestion[];
  sortOrder: number;
};

export type LesenAnswerMode = "true_false" | "a_b";

export type LesenExampleQuestion = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation?: string;
};

export type LesenTeil1Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
};

export type LesenTeil1Block = {
  id: string;
  title?: string;
  text: string;
  questions: LesenTeil1Question[];
  sortOrder: number;
};

export type LesenTeil2Item = {
  id: string;
  prompt: string;
  optionALabel: string;
  optionAText: string;
  optionBLabel: string;
  optionBText: string;
  correctOptionId: string;
  points: number;
  sortOrder: number;
};

export type LesenTeil3Item = {
  id: string;
  promptTitle?: string;
  noticeText: string;
  statement: string;
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
  sortOrder: number;
};

export type LesenPartFormat = "teil_1" | "teil_2" | "teil_3";

export type LesenPart = {
  id: string;
  title: string;
  instructions: string;
  sortOrder: number;

  /**
   * Geriye uyumluluk için eski alanlar kalsın.
   * Şimdilik mevcut sistemi bozmamak için silmiyoruz.
   */
  text: string;
  questions: HoerenQuestion[];

  /**
   * Yeni TELC Lesen yapısı
   */
  format: LesenPartFormat;
  answerMode: LesenAnswerMode;

  exampleQuestion?: LesenExampleQuestion;

  /**
   * Teil 1:
   * Örnekten sonra 2 ayrı metin bloğu gelebilir.
   * İlk blokta 2 soru, ikinci blokta 3 soru gibi.
   */
  teil1Blocks?: LesenTeil1Block[];

  /**
   * Teil 2:
   * Her maddede soru + A/B ilan
   */
  teil2Items?: LesenTeil2Item[];

  /**
   * Teil 3:
   * Her maddede tabela / notice + doğru-yanlış ifade
   */
  teil3Items?: LesenTeil3Item[];
};

export type SchreibenTask = {
  id: string;
  title: string;
  instructions: string;
  placeholder: string;
  minWords?: number;
  maxWords?: number;
  sortOrder: number;
};

export type ExamDefinition = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: LevelCode;
  examNumber: number;
  status: ExamStatus;
  content: {
    hoeren: HoerenPart[];
    lesen: LesenPart[];
    schreiben: SchreibenTask[];
  };
  createdAt: string;
  updatedAt: string;
};

export type PackageFeature = {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
};

export type PackageDefinition = {
  id: string;
  slug: string;
  title: string;
  level: LevelCode;
  description: string;
  price: number;
  features: PackageFeature[];
  createdAt: string;
  updatedAt: string;
};

export type ContentStore = {
  exams: ExamDefinition[];
  packages: PackageDefinition[];
};