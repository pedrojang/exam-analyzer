import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Difficulty, ExamAnalysis, QuestionAnalysis } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  return difficulty;
}

export function getDifficultyNumeric(difficulty: Difficulty): number {
  const map: Record<Difficulty, number> = {
    하: 1,
    중: 2,
    중상: 3,
    상: 4,
    최상: 5,
  };
  return map[difficulty];
}

export function getSourceNumeric(
  source: QuestionAnalysis["source"]
): number {
  const map: Record<QuestionAnalysis["source"], number> = {
    교과서: 1,
    변형문항: 2,
    외부문항: 3,
    학교프린트: 4,
    미확인: 0,
  } as never;
  const cleanMap: Record<string, number> = {
    교과서: 1,
    "변형 문항": 2,
    "외부 문항": 3,
    "학교 프린트": 4,
    미확인: 0,
  };
  return cleanMap[source] ?? 0;
}

export function computeKillerSummary(analysis: ExamAnalysis) {
  const killers = analysis.questions.filter((q) => q.isKiller);
  const totalKillerScore = killers.reduce((sum, q) => sum + q.score, 0);
  const maxScoreIfMissed = analysis.totalScore - totalKillerScore;
  const killerNumbers = killers.map((q) => q.number);
  return { killers, totalKillerScore, maxScoreIfMissed, killerNumbers };
}

export function generateReportTitle(analysis: ExamAnalysis): string {
  return `[시험지 분석] ${analysis.schoolName} ${analysis.grade} ${analysis.examName} ${analysis.subject} 난이도 분석 및 기말 대비 전략`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function analysisToMarkdown(analysis: ExamAnalysis): string {
  const lines: string[] = [];
  lines.push(`# ${analysis.title}`);
  lines.push("");
  lines.push(`**학교:** ${analysis.schoolName} | **학년:** ${analysis.grade} | **과목:** ${analysis.subject}`);
  lines.push(`**시험명:** ${analysis.examName} | **총점:** ${analysis.totalScore}점 | **총 문항:** ${analysis.totalQuestions}문항`);
  lines.push("");
  lines.push("## 총평");
  analysis.executiveSummary.forEach((s) => lines.push(`> ${s}`));
  lines.push("");
  lines.push("## 단원별 출제 비중");
  analysis.unitDistribution.forEach((u) => {
    lines.push(`- **${u.unit}**: ${u.questionCount}문항, ${u.score}점 (${u.percentage.toFixed(1)}%)`);
  });
  lines.push("");
  lines.push("## 난이도별 분포");
  analysis.difficultyDistribution.forEach((d) => {
    lines.push(`- **${d.difficulty}**: ${d.count}문항 (${d.percentage.toFixed(1)}%)`);
  });
  lines.push("");
  lines.push("## 킬러 문항");
  lines.push(analysis.killerSummary.message);
  lines.push("");
  lines.push("## 기말 대비 전략");
  analysis.finalStrategy.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  return lines.join("\n");
}
