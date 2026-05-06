"use client";
import React from "react";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

const updateSummary = (analysis: ExamAnalysis, idx: number, val: string): ExamAnalysis => {
  const next = [...analysis.executiveSummary];
  next[idx] = val;
  return { ...analysis, executiveSummary: next };
};

const INSIGHT_COLORS = ["#F97316", "#0B1F4D", "#DC2626"];
const INSIGHT_TITLES = ["체감 난이도 상승", "압도적 단원 편중", "고득점의 열쇠 = 학교 프린트"];

export default function ExecutiveSummaryCards({ analysis, onUpdate }: Props) {
  const topUnit = analysis.unitDistribution[0];
  const killerCount = analysis.questions.filter((q) => q.isKiller).length;
  const killerNums = analysis.killerSummary.killerQuestionNumbers.join("·");
  const diffColor = DIFFICULTY_COLORS[analysis.overallDifficulty];

  return (
    <div className="space-y-12">

      {/* ── 핵심 난이도 한눈에 ── */}
      <div className="rounded-3xl bg-[#0B1F4D] text-white p-8 text-center space-y-4">
        <p className="text-base font-bold text-white/50 uppercase tracking-widest">전반 난이도</p>
        <p className="text-8xl font-black" style={{ color: diffColor }}>
          {analysis.overallDifficulty}
        </p>
        <p className="text-xl font-bold text-white/80">{analysis.perceivedDifficulty}</p>
      </div>

      {/* ── 상위권 vs 중하위권 ── */}
      <div className="space-y-4">
        <p className="text-lg font-black text-gray-400 uppercase tracking-wider">수준별 체감 온도차</p>

        <div className="rounded-3xl bg-[#EFF6FF] border-2 border-blue-200 p-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#0B1F4D] text-white text-sm font-black px-4 py-1">상위권</span>
            <span className="text-base font-bold text-[#0B1F4D]">기회</span>
          </div>
          <p className="text-2xl font-black text-[#0B1F4D] leading-snug">예상보다 쉬웠다</p>
          <p className="text-base text-gray-600 leading-relaxed">
            킬러 {killerNums}번이 모두 학교 프린트 연계 — 프린트 완성자에겐 시간 단축 구조
          </p>
        </div>

        <div className="rounded-3xl bg-[#FFF1F2] border-2 border-red-200 p-8 space-y-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#DC2626] text-white text-sm font-black px-4 py-1">중·하위권</span>
            <span className="text-base font-bold text-[#DC2626]">위기</span>
          </div>
          <p className="text-2xl font-black text-[#DC2626] leading-snug">예상보다 어려웠다</p>
          <p className="text-base text-gray-600 leading-relaxed">
            교과서 기본 비중은 낮고, 후반 킬러 구간에서 시간이 급격히 부족해짐
          </p>
        </div>
      </div>

      {/* ── 핵심 인사이트 3개 ── */}
      <div className="space-y-4">
        <p className="text-lg font-black text-gray-400 uppercase tracking-wider">핵심 인사이트</p>
        {INSIGHT_TITLES.map((title, i) => {
          const body = analysis.executiveSummary[i] ?? "";
          return (
            <div
              key={i}
              className="rounded-3xl p-8 space-y-4"
              style={{ backgroundColor: `${INSIGHT_COLORS[i]}08`, border: `2px solid ${INSIGHT_COLORS[i]}20` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-lg font-black text-white rounded-xl px-3 py-1"
                  style={{ backgroundColor: INSIGHT_COLORS[i] }}
                >
                  0{i + 1}
                </span>
                <p className="text-xl font-black" style={{ color: INSIGHT_COLORS[i] }}>{title}</p>
              </div>
              <EditableText
                value={body}
                onChange={(val) => onUpdate?.(updateSummary(analysis, i, val))}
                multiline
                defaultSize="base"
                className="text-gray-700 leading-relaxed"
              />
            </div>
          );
        })}
      </div>

      {/* ── 핵심 수치 요약 ── */}
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-500">핵심 단원</p>
          <p className="text-2xl font-black text-[#0B1F4D]">{topUnit?.unit}</p>
        </div>
        <div className="rounded-3xl bg-red-50 border border-red-200 p-8 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-500">킬러 문항</p>
          <p className="text-2xl font-black text-[#DC2626]">{killerNums}번</p>
        </div>
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-500">킬러 배점</p>
          <p className="text-2xl font-black text-[#DC2626]">{analysis.killerSummary.totalKillerScore}점</p>
        </div>
      </div>
    </div>
  );
}
