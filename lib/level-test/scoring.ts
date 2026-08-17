// lib/level-test/scoring.ts

export type CefrLevel = "A1" | "A2" | "B1" | "B2";

export type ScoredAnswer = {
  cefr_level: CefrLevel;
  is_correct: boolean;
  weight: number;
};

export type LevelPercentages = {
  A1: number | null;
  A2: number | null;
  B1: number | null;
  B2: number | null;
};

export type ScoringResult = {
  percentages: LevelPercentages;
  totalWeightedScore: number;
  resultLevel: CefrLevel;
  resultSublevel: string;
  explanation: string;
};

function calculateLevelPercentages(answers: ScoredAnswer[]): LevelPercentages {
  const levels: CefrLevel[] = ["A1", "A2", "B1", "B2"];
  const result: Partial<LevelPercentages> = {};

  for (const level of levels) {
    const levelAnswers = answers.filter((a) => a.cefr_level === level);
    if (levelAnswers.length === 0) {
      result[level] = null;
      continue;
    }
    const correct = levelAnswers.filter((a) => a.is_correct).length;
    result[level] = Math.round((correct / levelAnswers.length) * 1000) / 10;
  }

  return result as LevelPercentages;
}

function calculateWeightedScore(answers: ScoredAnswer[]): number {
  return answers.reduce((sum, a) => sum + (a.is_correct ? a.weight : 0), 0);
}

function determineLevel(pct: LevelPercentages): { level: CefrLevel; sublevel: string } {
  const a1 = pct.A1 ?? 0;
  const a2 = pct.A2 ?? 0;
  const b1 = pct.B1 ?? 0;
  const b2 = pct.B2 ?? 0;

  const qualifiesB2 = a1 >= 80 && a2 >= 75 && b1 >= 75 && b2 >= 65;

  const qualifiesB1 = a1 >= 80 && a2 >= 70 && b1 >= 65;
  const strongB1 = qualifiesB1 && b1 >= 80;
  const nearB1 = a1 >= 70 && a2 >= 60 && b1 >= 45 && b1 < 65;

  const qualifiesA2 = a1 >= 75 && a2 >= 65;
  const strongA2 = qualifiesA2 && a2 >= 80;
  const nearA2 = a1 >= 60 && a2 >= 40 && a2 < 65;

  const qualifiesA1 = a1 >= 70;

  if (qualifiesB2) {
    return { level: "B2", sublevel: "B2" };
  }

  if (qualifiesB1) {
    return { level: "B1", sublevel: strongB1 ? "B1+" : "B1" };
  }

  if (nearB1) {
    return { level: "B1", sublevel: "A2+" };
  }

  if (qualifiesA2) {
    return { level: "A2", sublevel: strongA2 ? "A2+" : "A2" };
  }

  if (nearA2) {
    return { level: "A2", sublevel: "A1+" };
  }

  if (qualifiesA1) {
    return { level: "A1", sublevel: a1 >= 85 ? "A1+" : "A1" };
  }

  return { level: "A1", sublevel: "A1 Başlangıç" };
}

function buildExplanation(level: CefrLevel, sublevel: string): string {
  const explanations: Record<string, string> = {
    "A1 Başlangıç":
      "Almanca öğrenim sürecinize henüz başlangıç aşamasındasınız. Temel kelime ve cümle yapılarıyla tanışmanız faydalı olacaktır.",
    "A1":
      "Temel düzeyde günlük ifadeleri ve basit cümle yapılarını tanıyorsunuz. A1 seviyesindeki eksiklerinizi tamamlamanız önerilir.",
    "A1+":
      "A1 seviyesindeki yapılara oldukça hakimsiniz. A2 seviyesine geçişe yakınsınız ancak henüz A2 yapılarında yeterli tutarlılık görülmüyor.",
    "A2":
      "Günlük hayatta sık kullanılan ifadeleri anlayabiliyor ve basit iletişim kurabiliyorsunuz.",
    "A2+":
      "A2 seviyesindeki yapılara hakimsiniz ve B1 seviyesine oldukça yakınsınız. Bazı B1 konularında başarılı olsanız da temel B1 yapılarının tamamında henüz yeterli tutarlılık görülmemektedir.",
    "B1":
      "Temel ve orta düzey Almanca yapılarını büyük ölçüde kullanabiliyorsunuz. Günlük konuların yanı sıra daha ayrıntılı metinleri anlayabiliyor ve düşüncelerinizi ifade edebiliyorsunuz.",
    "B1+":
      "B1 seviyesindeki yapılara güçlü şekilde hakimsiniz. B2 seviyesine geçişe yakınsınız ancak ileri düzey yapılarda henüz tam yeterlilik görülmüyor.",
    "B2":
      "Karmaşık cümle yapılarını, soyut içerikleri ve ileri düzey kelime kullanımını büyük ölçüde anlayabiliyor ve kullanabiliyorsunuz.",
  };

  return explanations[sublevel] || explanations[level] || "Sonuçlarınız değerlendirildi.";
}

export function scoreLevelTest(answers: ScoredAnswer[]): ScoringResult {
  const percentages = calculateLevelPercentages(answers);
  const totalWeightedScore = calculateWeightedScore(answers);
  const { level, sublevel } = determineLevel(percentages);
  const explanation = buildExplanation(level, sublevel);

  return {
    percentages,
    totalWeightedScore,
    resultLevel: level,
    resultSublevel: sublevel,
    explanation,
  };
}