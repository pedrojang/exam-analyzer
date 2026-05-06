"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

export default function KillerQuestionSummary({ analysis, onUpdate }: Props) {
  const { killerSummary } = analysis;
  const pct = ((killerSummary.totalKillerScore / analysis.totalScore) * 100).toFixed(0);
  const basicScore = analysis.totalScore - killerSummary.totalKillerScore;
  const basicPct = 100 - Number(pct);

  return (
    <div className="space-y-10">

      {/* ── 킬러 문항 번호 ── */}
      <div className="rounded-3xl bg-[#DC2626] text-white p-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className="h-6 w-6 text-red-200" />
          <p className="text-base font-bold text-red-200 uppercase tracking-widest">킬러 문항</p>
        </div>
        <p className="text-6xl font-black leading-none">
          {killerSummary.killerQuestionNumbers.join(" · ")}번
        </p>
        <p className="text-xl font-bold text-red-200">이 {killerSummary.killerQuestionNumbers.length}문제가 등급을 가른다</p>
      </div>

      {/* ── 핵심 수치 ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-red-50 border-2 border-red-200 p-8 text-center space-y-2">
          <p className="text-base font-bold text-red-400">킬러 총 배점</p>
          <p className="text-5xl font-black text-[#DC2626]">{killerSummary.totalKillerScore}<span className="text-2xl">점</span></p>
          <p className="text-base text-red-400">전체의 {pct}%</p>
        </div>
        <div className="rounded-3xl bg-gray-50 border-2 border-gray-200 p-8 text-center space-y-2">
          <p className="text-base font-bold text-gray-400">놓쳤을 때 최고점</p>
          <p className="text-5xl font-black text-gray-700">{killerSummary.maxScoreIfMissed}<span className="text-2xl">점</span></p>
          <p className="text-base text-gray-400">90점 돌파 불가</p>
        </div>
      </div>

      {/* ── 배점 구조 바 ── */}
      <div className="space-y-3">
        <p className="text-lg font-black text-gray-400 uppercase tracking-wider">배점 구조</p>
        <div className="rounded-2xl overflow-hidden h-16 flex">
          <div
            className="flex items-center justify-center text-white font-black text-base"
            style={{ width: `${basicPct}%`, background: "linear-gradient(90deg, #0B1F4D, #1a3a7a)" }}
          >
            기본 {basicPct}%
          </div>
          <div
            className="flex items-center justify-center text-white font-black text-base"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #ef4444, #DC2626)" }}
          >
            킬러 {pct}%
          </div>
        </div>
        <div className="flex justify-between text-base text-gray-400 font-medium px-1">
          <span>기본 구간 {basicScore}점</span>
          <span>킬러 {killerSummary.totalKillerScore}점</span>
        </div>
      </div>

      {/* ── 킬러 메시지 ── */}
      <div className="rounded-3xl bg-[#111827] p-10 space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-[#F97316] flex-shrink-0" />
          <p className="text-base font-bold text-[#F97316] uppercase tracking-wider">분석</p>
        </div>
        <EditableText
          value={killerSummary.message}
          onChange={(val) => onUpdate?.({ ...analysis, killerSummary: { ...killerSummary, message: val } })}
          multiline
          defaultSize="lg"
          className="text-white leading-relaxed"
        />
      </div>

      {/* ── 결론 ── */}
      <div className="rounded-3xl bg-[#DC2626] p-10 text-center">
        <p className="text-2xl font-black text-white leading-snug">
          90점 돌파는 이 {killerSummary.killerQuestionNumbers.length}문제 정복 없이는
          <br />
          <span className="text-yellow-300">구조적으로 불가능합니다.</span>
        </p>
      </div>
    </div>
  );
}
