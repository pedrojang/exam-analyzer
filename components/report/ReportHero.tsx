"use client";
import React from "react";
import { BookOpen, Hash, FileText, Target } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";

interface Props {
  analysis: ExamAnalysis;
}

const HOOK_LINES: Record<string, string> = {
  "상": "100점의 환상은 끝났다.",
  "최상": "이 시험, 그냥 어려운 게 아니다.",
  "중상": "방심의 덫에 걸린 학생들이 있다.",
  "중": "기초가 흔들리면 중위권도 위험하다.",
  "하": "기본기만 갖춰도 고득점이 가능한 구조다.",
};

export default function ReportHero({ analysis }: Props) {
  const diffColor = DIFFICULTY_COLORS[analysis.overallDifficulty];
  const hookLine = HOOK_LINES[analysis.overallDifficulty] ?? "시험을 지배하는 자가 등급을 지배한다.";

  const stats = [
    { icon: Hash,     label: "총 문항 수", value: `${analysis.totalQuestions}문항`,  color: "#0B1F4D" },
    { icon: BookOpen, label: "객관식",     value: `${analysis.objectiveCount}문항`,  color: "#3B82F6" },
    { icon: FileText, label: "서술형",     value: `${analysis.descriptiveCount}문항`, color: "#F97316" },
    { icon: Target,   label: "총 배점",    value: `${analysis.totalScore}점`,         color: "#22C55E" },
  ];

  return (
    <div className="space-y-0">
      {/* 썸네일 스타일 헤더 */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B1F4D 0%, #1a3a7a 60%, #0f2d6b 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/4" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#F97316]/10" />
        </div>
        <div className="relative p-8 md:p-10 text-center">
          <p className="text-[#F97316] font-extrabold text-sm uppercase tracking-widest mb-1">중간고사 수학 상세 분석</p>
          <p className="text-4xl md:text-5xl font-black text-white mb-2">{analysis.schoolName.replace("고등학교","고").replace("학교","고")}</p>
          <p className="text-white/50 text-sm">{analysis.schoolName} | {analysis.grade} | {analysis.subject} | {analysis.examName}</p>
        </div>
      </div>

      {/* Diagnostic Report 표지 */}
      <div className="rounded-b-2xl bg-white border border-t-0 border-gray-200 px-8 md:px-12 py-10 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
          {analysis.schoolName} {analysis.grade} {analysis.subject} {analysis.examName} 정밀 분석 보고서
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-[#111827] leading-tight mb-3">
          난이도 상승의 원인 분석 및
          <br />
          <span className="text-[#0B1F4D]">90점 이상 고득점 달성 전략</span>
        </h1>
        <p className="text-sm text-gray-400 mb-1">
          {analysis.unitDistribution[0]?.unit ?? "주요 단원"}의 연산 ~ {analysis.unitDistribution[1]?.unit ?? "핵심 단원"} | 출제일 : {new Date(analysis.createdAt).toLocaleDateString("ko-KR")}
        </p>

        {/* 메타 태그 */}
        <div className="flex flex-wrap gap-2 mb-8 mt-3">
          {[analysis.schoolName, analysis.grade, analysis.subject, analysis.examName, "포텐수학 분석기관"].map((tag) => (
            <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 font-medium">{tag}</span>
          ))}
        </div>

        {/* 핵심 통계 카드 */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 훅 문구 - 참고 블로그 스타일 */}
        <div className="relative rounded-2xl overflow-hidden bg-[#111827] p-8 md:p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F4D] to-[#111827]" />
          <div className="relative">
            <div className="flex justify-center gap-1 mb-4">
              <span className="text-[#F97316] text-5xl leading-none font-black">"</span>
            </div>
            <p className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {hookLine}
            </p>
            <div className="flex justify-end">
              <span className="text-[#F97316] text-5xl leading-none font-black">"</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: diffColor }}
              />
              <span className="text-xs text-white/80 font-medium">
                전반 난이도: <strong style={{ color: diffColor }}>{analysis.overallDifficulty}</strong> · 체감: {analysis.perceivedDifficulty}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
