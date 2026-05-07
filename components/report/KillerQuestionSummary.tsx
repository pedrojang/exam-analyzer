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
  const ov = analysis.overrides ?? {};
  const pct = ((killerSummary.totalKillerScore / analysis.totalScore) * 100).toFixed(0);
  const basicScore = analysis.totalScore - killerSummary.totalKillerScore;
  const basicPct = 100 - Number(pct);

  const setText = (key: string, val: string) =>
    onUpdate?.({ ...analysis, overrides: { ...ov, [key]: val } });

  return (
    <div className="space-y-10">

      {/* ── 킬러 문항 번호 ── */}
      <div className="rounded-3xl bg-[#DC2626] text-white p-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className="h-6 w-6 text-red-200" />
          <EditableText value={ov.killer_badge ?? "킬러 문항"} onChange={(v) => setText("killer_badge", v)}
            className="text-base font-bold text-red-200 uppercase tracking-widest" defaultSize="base" />
        </div>
        <EditableText
          value={ov.killerNums ?? killerSummary.killerQuestionNumbers.join(" · ") + "번"}
          onChange={(v) => setText("killerNums", v)}
          className="font-black text-white block" defaultSize="massive"
        />
        <EditableText
          value={ov.killer_subtitle ?? `이 ${killerSummary.killerQuestionNumbers.length}문제가 등급을 가른다`}
          onChange={(v) => setText("killer_subtitle", v)}
          className="text-xl font-bold text-red-200" defaultSize="xl"
        />
      </div>

      {/* ── 핵심 수치 ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-red-50 border-2 border-red-200 p-8 text-center space-y-2">
          <EditableText value={ov.killer_total_label ?? "킬러 총 배점"} onChange={(v) => setText("killer_total_label", v)}
            className="text-base font-bold text-red-400" defaultSize="base" />
          <p className="text-5xl font-black text-[#DC2626]">{killerSummary.totalKillerScore}<span className="text-2xl">점</span></p>
          <EditableText value={ov.killer_total_sub ?? `전체의 ${pct}%`} onChange={(v) => setText("killer_total_sub", v)}
            className="text-base text-red-400" defaultSize="base" />
        </div>
        <div className="rounded-3xl bg-gray-50 border-2 border-gray-200 p-8 text-center space-y-2">
          <EditableText value={ov.killer_max_label ?? "놓쳤을 때 최고점"} onChange={(v) => setText("killer_max_label", v)}
            className="text-base font-bold text-gray-400" defaultSize="base" />
          <p className="text-5xl font-black text-gray-700">{killerSummary.maxScoreIfMissed}<span className="text-2xl">점</span></p>
          <EditableText value={ov.killer_max_sub ?? "90점 돌파 불가"} onChange={(v) => setText("killer_max_sub", v)}
            className="text-base text-gray-400" defaultSize="base" />
        </div>
      </div>

      {/* ── 배점 구조 바 ── */}
      <div className="space-y-3">
        <EditableText value={ov.killer_structure_label ?? "배점 구조"} onChange={(v) => setText("killer_structure_label", v)}
          className="text-lg font-black text-gray-400 uppercase tracking-wider block" defaultSize="lg" />
        <div className="rounded-2xl overflow-hidden h-16 flex">
          <div className="flex items-center justify-center text-white font-black text-base"
            style={{ width: `${basicPct}%`, background: "linear-gradient(90deg, #0B1F4D, #1a3a7a)" }}>
            기본 {basicPct}%
          </div>
          <div className="flex items-center justify-center text-white font-black text-base"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #ef4444, #DC2626)" }}>
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
          <EditableText value={ov.killer_analysis_label ?? "분석"} onChange={(v) => setText("killer_analysis_label", v)}
            className="text-base font-bold text-[#F97316] uppercase tracking-wider" defaultSize="base" />
        </div>
        <EditableText
          value={killerSummary.message}
          onChange={(val) => onUpdate?.({ ...analysis, killerSummary: { ...killerSummary, message: val } })}
          multiline defaultSize="lg" className="text-white leading-relaxed"
        />
      </div>

      {/* ── 결론 ── */}
      <div className="rounded-3xl bg-[#DC2626] p-10 text-center">
        <EditableText
          value={ov.killer_conclusion ?? `90점 돌파는 이 ${killerSummary.killerQuestionNumbers.length}문제 정복 없이는\n구조적으로 불가능합니다.`}
          onChange={(v) => setText("killer_conclusion", v)}
          multiline defaultSize="xl" className="font-black text-white leading-snug block"
        />
      </div>
    </div>
  );
}
