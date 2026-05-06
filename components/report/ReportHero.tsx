"use client";
import React from "react";
import { BookOpen, Hash, FileText, Target } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

const HOOK_LINES: Record<string, string> = {
  "상":   "100점의 환상은 끝났다.",
  "최상": "이 시험, 그냥 어려운 게 아니다.",
  "중상": "방심의 덫에 걸린 학생들이 있다.",
  "중":   "기초가 흔들리면 중위권도 위험하다.",
  "하":   "기본기만 갖춰도 고득점이 가능한 구조다.",
};

const set = (analysis: ExamAnalysis, key: string, val: string): ExamAnalysis => ({
  ...analysis,
  overrides: { ...analysis.overrides, [key]: val },
});

export default function ReportHero({ analysis, onUpdate }: Props) {
  const diffColor = DIFFICULTY_COLORS[analysis.overallDifficulty];

  const hookLine    = analysis.overrides?.heroHook     ?? HOOK_LINES[analysis.overallDifficulty] ?? "시험을 지배하는 자가 등급을 지배한다.";
  const subtitle    = analysis.overrides?.heroSubtitle ?? "난이도 상승의 원인 분석 및\n90점 이상 고득점 달성 전략";
  const topLabel    = analysis.overrides?.heroTopLabel ?? "중간고사 수학 상세 분석";
  const schoolShort = analysis.overrides?.heroSchool   ?? analysis.schoolName.replace("고등학교", "고").replace("학교", "고");

  const stats = [
    { icon: Hash,     label: "총 문항 수", value: `${analysis.totalQuestions}문항`, color: "#0B1F4D" },
    { icon: BookOpen, label: "객관식",     value: `${analysis.objectiveCount}문항`,  color: "#3B82F6" },
    { icon: FileText, label: "서술형",     value: `${analysis.descriptiveCount}문항`, color: "#F97316" },
    { icon: Target,   label: "총 배점",    value: `${analysis.totalScore}점`,         color: "#22C55E" },
  ];

  return (
    <div className="space-y-0">
      {/* 썸네일 헤더 */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B1F4D 0%, #1a3a7a 60%, #0f2d6b 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/4" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#F97316]/10" />
        </div>
        <div className="relative p-8 md:p-10 text-center">
          <div className="text-[#F97316] font-extrabold text-lg uppercase tracking-widest mb-3">
            <EditableText
              value={topLabel}
              onChange={(val) => onUpdate?.(set(analysis, "heroTopLabel", val))}
              className="text-[#F97316]"
              defaultSize="lg"
            />
          </div>
          <div className="font-black text-white mb-3 leading-none" style={{ fontSize: "clamp(3rem, 20vw, 9rem)" }}>
            <EditableText
              value={schoolShort}
              onChange={(val) => onUpdate?.(set(analysis, "heroSchool", val))}
              className="text-white"
              defaultSize="3xl"
            />
          </div>
          <p className="text-white/50 text-base">{analysis.schoolName} | {analysis.grade} | {analysis.subject} | {analysis.examName}</p>
        </div>
      </div>

      {/* 보고서 표지 */}
      <div className="rounded-b-2xl bg-white border border-t-0 border-gray-200 px-8 md:px-12 py-10 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
          {analysis.schoolName} {analysis.grade} {analysis.subject} {analysis.examName} 정밀 분석 보고서
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-[#111827] leading-tight mb-4">
          <EditableText
            value={subtitle}
            onChange={(val) => onUpdate?.(set(analysis, "heroSubtitle", val))}
            multiline
            className="text-[#0B1F4D]"
            defaultSize="2xl"
          />
        </h1>

        <p className="text-base text-gray-400 mb-1">
          {analysis.unitDistribution[0]?.unit ?? "주요 단원"}의 연산 ~ {analysis.unitDistribution[1]?.unit ?? "핵심 단원"} | 출제일: {new Date(analysis.createdAt).toLocaleDateString("ko-KR")}
        </p>

        {/* 메타 태그 */}
        <div className="flex flex-wrap gap-2 mb-8 mt-3">
          {[analysis.schoolName, analysis.grade, analysis.subject, analysis.examName, "포텐수학 분석기관"].map((tag) => (
            <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-600 font-medium">{tag}</span>
          ))}
        </div>

        {/* 핵심 통계 카드 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
              <p className="text-4xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 훅 문구 */}
        <div className="relative rounded-3xl overflow-hidden bg-[#111827] px-8 py-12 md:px-12 md:py-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F4D] to-[#111827]" />
          <div className="relative">
            <span className="text-[#F97316] text-7xl leading-none font-black block mb-2">"</span>
            <div className="text-4xl md:text-5xl font-black text-white leading-snug mb-4">
              <EditableText
                value={hookLine}
                onChange={(val) => onUpdate?.(set(analysis, "heroHook", val))}
                multiline
                className="text-white"
                defaultSize="3xl"
              />
            </div>
            <span className="text-[#F97316] text-7xl leading-none font-black block text-right mb-6">"</span>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: diffColor }} />
              <span className="text-base text-white/80 font-medium">
                전반 난이도: <strong style={{ color: diffColor }}>{analysis.overallDifficulty}</strong> · 체감: {analysis.perceivedDifficulty}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
