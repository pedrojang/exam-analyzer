"use client";
import React from "react";
import { TrendingUp, Target, Zap, ThumbsUp, AlertTriangle } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";

interface Props {
  analysis: ExamAnalysis;
}

export default function ExecutiveSummaryCards({ analysis }: Props) {
  const topUnit = analysis.unitDistribution[0];
  const killerCount = analysis.questions.filter((q) => q.isKiller).length;
  const schoolPrintKillers = analysis.questions.filter((q) => q.isKiller && q.source === "학교 프린트").length;

  const insightData = [
    {
      num: 1,
      color: "#F97316",
      icon: TrendingUp,
      title: "체감 난이도 상승",
      body: analysis.executiveSummary[0] ?? "전반부보다 후반부 난이도가 급격히 상승하는 구조입니다.",
    },
    {
      num: 2,
      color: "#0B1F4D",
      icon: Target,
      title: "압도적 단원 편중",
      body: analysis.executiveSummary[1] ?? `'${topUnit?.unit}' 단원이 전체 배점의 ${topUnit?.percentage?.toFixed(1)}%를 독점합니다.`,
    },
    {
      num: 3,
      color: "#DC2626",
      icon: Zap,
      title: "고득점의 열쇠 = 학교 프린트",
      body: analysis.executiveSummary[2] ?? `킬러 ${killerCount}문항 중 ${schoolPrintKillers}문항이 학교 프린트 출처입니다.`,
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── 수준별 체감 난이도 온도차 ── */}
      <div>
        <h3 className="text-lg font-black text-[#111827] mb-4 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-[#F97316]" />
          수준별 체감 난이도의 극명한 온도차
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 상위권 - Opportunity */}
          <div className="rounded-2xl overflow-hidden border border-blue-200">
            <div className="bg-[#0B1F4D] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-white" />
                <span className="text-white font-bold text-sm">상위권</span>
              </div>
              <span className="text-xs font-bold text-[#F97316] bg-[#F97316]/20 rounded-full px-2 py-0.5">기회와 안도 (Opportunity)</span>
            </div>
            <div className="bg-blue-50 p-5">
              <p className="text-lg font-black text-[#0B1F4D] mb-2">체감 난이도: 예상보다 쉬움</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                가장 배점 높은 킬러 문항({analysis.killerSummary.killerQuestionNumbers.join("·")}번)이 모두 학교 프린트 연계. 프린트를 완벽히 다독한 최상위권에게는 오히려 시간 단축이 가능한 구조입니다.
              </p>
              <div className="mt-3 rounded-xl bg-[#0B1F4D]/8 border border-[#0B1F4D]/15 px-4 py-2">
                <p className="text-xs font-semibold text-[#0B1F4D]">기말 극복 과제: 지금처럼 공부하면 된다</p>
              </div>
            </div>
          </div>

          {/* 중·하위권 - Crisis */}
          <div className="rounded-2xl overflow-hidden border border-red-200">
            <div className="bg-[#DC2626] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-white" />
                <span className="text-white font-bold text-sm">중·하위권</span>
              </div>
              <span className="text-xs font-bold text-red-100 bg-white/20 rounded-full px-2 py-0.5">위기와 패닉 (Crisis)</span>
            </div>
            <div className="bg-red-50 p-5">
              <p className="text-lg font-black text-[#DC2626] mb-2">체감 난이도: 예상보다 어려움</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                교과서 기본 문제 비중은 낮고, 선 조건 정리 2번 이후 과정에서 시간이 부족해 시험 운용에 큰 타격을 입었을 것입니다.
              </p>
              <div className="mt-3 rounded-xl bg-red-100 border border-red-200 px-4 py-2">
                <p className="text-xs font-semibold text-red-700">기말 극복 과제: 시중 교재 필수 유형의 완벽한 암기와 체화</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 총평 및 핵심 인사이트 ── */}
      <div>
        <h3 className="text-lg font-black text-[#111827] mb-4 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-[#0B1F4D]" />
          총평 및 핵심 인사이트 (Executive Summary)
        </h3>
        <div className="space-y-3">
          {insightData.map((ins) => (
            <div
              key={ins.num}
              className="flex items-start gap-4 rounded-xl border px-5 py-4"
              style={{ borderColor: `${ins.color}25`, backgroundColor: `${ins.color}06` }}
            >
              <div
                className="flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-black text-white"
                style={{ backgroundColor: ins.color }}
              >
                Insight {ins.num}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold mb-1" style={{ color: ins.color }}>{ins.title}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{ins.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 전반 난이도 종합 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">전반 난이도</p>
          <p className="text-4xl font-black" style={{ color: DIFFICULTY_COLORS[analysis.overallDifficulty] }}>
            {analysis.overallDifficulty}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">체감 난이도</p>
          <p className="text-base font-bold text-gray-800 leading-snug">{analysis.perceivedDifficulty}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">킬러 문항</p>
          <p className="text-4xl font-black text-[#DC2626]">{killerCount}문항</p>
          <p className="text-xs text-gray-400 mt-1">{analysis.killerSummary.killerQuestionNumbers.join("·")}번</p>
        </div>
      </div>
    </div>
  );
}
