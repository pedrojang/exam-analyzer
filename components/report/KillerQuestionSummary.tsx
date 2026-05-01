"use client";
import React from "react";
import { AlertTriangle, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ExamAnalysis } from "@/lib/types";

interface Props {
  analysis: ExamAnalysis;
}

export default function KillerQuestionSummary({ analysis }: Props) {
  const { killerSummary } = analysis;
  const pct = ((killerSummary.totalKillerScore / analysis.totalScore) * 100).toFixed(1);

  // Score building block chart data
  const scoreBlocks = analysis.questions
    .filter((q) => q.isKiller)
    .map((q) => ({ name: `${q.number}번`, score: q.score, isKiller: true }));
  scoreBlocks.push({
    name: "기준~중상 구간",
    score: analysis.totalScore - killerSummary.totalKillerScore,
    isKiller: false,
  });

  const chartData = [
    {
      name: "배점 구조",
      기본구간: analysis.totalScore - killerSummary.totalKillerScore,
      킬러: killerSummary.totalKillerScore,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 강조 */}
      <div className="rounded-2xl overflow-hidden border border-red-200">
        <div
          className="px-6 py-5"
          style={{ background: "linear-gradient(135deg, #DC2626 0%, #991b1b 100%)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-7 w-7 text-white flex-shrink-0" />
            <h3 className="text-xl font-black text-white">킬러 문항 배점의 압도적 무게</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-red-200 text-xs mb-1">킬러 문항</p>
              <p className="text-2xl font-black text-white">{killerSummary.killerQuestionNumbers.join("·")}번</p>
            </div>
            <div className="text-center border-x border-red-500/40">
              <p className="text-red-200 text-xs mb-1">킬러 총 배점</p>
              <p className="text-3xl font-black text-white">{killerSummary.totalKillerScore}점</p>
              <p className="text-red-300 text-xs">전체의 {pct}%</p>
            </div>
            <div className="text-center">
              <p className="text-red-200 text-xs mb-1">놓쳤을 때 최고점</p>
              <p className="text-3xl font-black text-white">{killerSummary.maxScoreIfMissed}점</p>
            </div>
          </div>
        </div>

        {/* 본문 인용 스타일 */}
        <div className="bg-red-50 px-6 py-5">
          <div className="flex gap-3">
            <Target className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 leading-relaxed font-medium">{killerSummary.message}</p>
          </div>
        </div>
      </div>

      {/* Score Building Block 시각화 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Score Building Block</h4>
        <div className="flex items-end gap-3 mb-5">
          {/* 기본 점수 블록 */}
          <div
            className="flex flex-col items-center justify-end rounded-t-lg text-white text-xs font-bold transition-all"
            style={{
              height: `${((analysis.totalScore - killerSummary.totalKillerScore) / analysis.totalScore) * 220}px`,
              minHeight: 40,
              backgroundColor: "#0B1F4D",
              width: "45%",
            }}
          >
            <div className="flex flex-col items-center p-2">
              <span className="text-lg font-black">{analysis.totalScore - killerSummary.totalKillerScore}점</span>
              <span className="text-[10px] opacity-80 text-center">기준~중상 구간</span>
            </div>
          </div>

          {/* 킬러 블록들 */}
          <div className="flex items-end gap-1.5" style={{ width: "50%" }}>
            {analysis.questions.filter((q) => q.isKiller).map((q) => (
              <div
                key={q.id}
                className="flex flex-col items-center justify-end rounded-t-lg text-white text-xs font-bold"
                style={{
                  height: `${(q.score / analysis.totalScore) * 220 * 3.2}px`,
                  minHeight: 36,
                  backgroundColor: "#DC2626",
                  flex: 1,
                }}
              >
                <div className="p-1.5 text-center">
                  <span className="block font-black text-sm">{q.score}점</span>
                  <span className="block text-[9px] opacity-80">{q.number}번</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 범례 */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="h-3 w-3 rounded-sm bg-[#0B1F4D]" />
            기본~중상 구간 ({analysis.totalScore - killerSummary.totalKillerScore}점)
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="h-3 w-3 rounded-sm bg-[#DC2626]" />
            킬러 문항 ({killerSummary.totalKillerScore}점)
          </div>
        </div>

        {/* 선형 배점 바 */}
        <div className="mt-5 relative h-10 rounded-xl overflow-hidden bg-gray-100">
          <div
            className="absolute left-0 top-0 h-full flex items-center justify-center"
            style={{
              width: `${100 - Number(pct)}%`,
              background: "linear-gradient(90deg, #0B1F4D, #1a3a7a)",
            }}
          >
            <span className="text-xs font-bold text-white px-2 truncate">기본 구간 {100 - Number(pct)}%</span>
          </div>
          <div
            className="absolute right-0 top-0 h-full flex items-center justify-center"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #ef4444, #DC2626)",
            }}
          >
            <span className="text-xs font-bold text-white px-2">킬러 {pct}%</span>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>0점</span><span>{analysis.totalScore}점</span>
        </div>
      </div>

      {/* 강조 문구 */}
      <div className="rounded-2xl bg-[#111827] px-8 py-6 text-center">
        <p className="text-2xl md:text-3xl font-black text-white leading-tight">
          90점 돌파는 이 {killerSummary.killerQuestionNumbers.length}개 문제의 정복 없이는
          <br />
          <span className="text-[#F97316]">구조적으로 불가능합니다.</span>
        </p>
      </div>
    </div>
  );
}
