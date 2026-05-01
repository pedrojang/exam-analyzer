export type Difficulty = "하" | "중" | "중상" | "상" | "최상";

export type QuestionType = "객관식" | "서술형" | "단답형";

export type SourceType = "교과서" | "학교 프린트" | "외부 문항" | "변형 문항" | "미확인";

export type AnalysisMode = "학부모 설명형" | "블로그 홍보형" | "내부 진단형";

export type QuestionAnalysis = {
  id: string;
  number: number;
  type: QuestionType;
  score: number;
  unit: string;
  difficulty: Difficulty;
  source: SourceType;
  requiredThinking: string;
  likelyTrap: string;
  studentPanicReason: string;
  isKiller: boolean;
};

export type ExamAnalysis = {
  id: string;
  title: string;
  schoolName: string;
  grade: string;
  subject: string;
  examName: string;
  totalScore: number;
  totalQuestions: number;
  objectiveCount: number;
  descriptiveCount: number;
  overallDifficulty: Difficulty;
  perceivedDifficulty: string;
  executiveSummary: string[];
  questions: QuestionAnalysis[];
  unitDistribution: {
    unit: string;
    score: number;
    questionCount: number;
    percentage: number;
  }[];
  typeScoreDistribution: {
    type: string;
    score: number;
    percentage: number;
  }[];
  difficultyDistribution: {
    difficulty: Difficulty;
    count: number;
    percentage: number;
  }[];
  flowData: {
    questionNumber: number;
    difficultyScore: number;
    timePressure: number;
    label?: string;
    zone?: "basic" | "standard" | "pressure" | "killer";
  }[];
  killerSummary: {
    killerQuestionNumbers: number[];
    totalKillerScore: number;
    maxScoreIfMissed: number;
    message: string;
  };
  finalStrategy: string[];
  createdAt: string;
  updatedAt: string;
};

export type ExamMetadata = {
  schoolName: string;
  grade: string;
  subject: string;
  examName: string;
  examDuration: number;
  totalScore: number;
  totalQuestions: number;
  analysisMode: AnalysisMode;
};

export type SectionType =
  | "hero"
  | "executive_summary"
  | "unit_distribution"
  | "type_distribution"
  | "difficulty_distribution"
  | "exam_flow"
  | "source_matrix"
  | "question_diagnosis"
  | "killer_summary"
  | "killer_deepdive"
  | "final_strategy";

export type ReportSection = {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  highlighted?: boolean;
};

export type PropertyPanelState = {
  isOpen: boolean;
  selectedSectionId: string | null;
};

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "표지 / 제목",
  executive_summary: "총평 및 핵심 인사이트",
  unit_distribution: "단원별 출제 비중",
  type_distribution: "서술형/객관식 배점 비율",
  difficulty_distribution: "난이도별 문항 수",
  exam_flow: "시험 흐름 그래프",
  source_matrix: "출처-난이도 매트릭스",
  question_diagnosis: "문항별 정밀 진단",
  killer_summary: "킬러 문항 요약",
  killer_deepdive: "킬러 문항 Deep Dive",
  final_strategy: "최종 처방 / 기말 대비 전략",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  하: "#22C55E",
  중: "#84CC16",
  중상: "#EAB308",
  상: "#F97316",
  최상: "#DC2626",
};

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  하: 1,
  중: 2,
  중상: 3,
  상: 4,
  최상: 5,
};
