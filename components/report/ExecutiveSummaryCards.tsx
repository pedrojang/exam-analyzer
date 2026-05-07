"use client";
import React from "react";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

export default function ExecutiveSummaryCards({ analysis, onUpdate }: Props) {
  const topUnit = analysis.unitDistribution[0];
  const killerNums = analysis.killerSummary.killerQuestionNumbers.join("·");
  const diffColor = DIFFICULTY_COLORS[analysis.overallDifficulty];

  const ov = analysis.overrides ?? {};

  const setText = (key: string, val: string) =>
    onUpdate?.({ ...analysis, overrides: { ...ov, [key]: val } });

  const setSummary = (idx: number, val: string) => {
    const next = [...analysis.executiveSummary];
    next[idx] = val;
    onUpdate?.({ ...analysis, executiveSummary: next });
  };

  return (
    <div className="space-y-12">

      {/* ── 핵심 난이도 ── */}
      <div className="rounded-3xl bg-[#0B1F4D] text-white p-8 text-center space-y-4">
        <EditableText
          value={ov.exec_diff_label ?? "전반 난이도"}
          onChange={(v) => setText("exec_diff_label", v)}
          className="text-base font-bold text-white/50 uppercase tracking-widest block"
          defaultSize="base"
        />
        <EditableText
          value={ov.exec_diff_value ?? analysis.overallDifficulty}
          onChange={(v) => setText("exec_diff_value", v)}
          className="font-black block"
          style={{ color: diffColor }}
          defaultSize="massive"
        />
        <div className="mt-6">
          <EditableText
            value={ov.exec_perceived ?? analysis.perceivedDifficulty}
            onChange={(v) => setText("exec_perceived", v)}
            className="text-xl font-bold text-white/80"
            defaultSize="xl"
          />
        </div>
      </div>

      {/* ── 상위권 vs 중하위권 ── */}
      <div className="space-y-4">
        <EditableText
          value={ov.exec_temp_label ?? "수준별 체감 온도차"}
          onChange={(v) => setText("exec_temp_label", v)}
          className="text-lg font-black text-gray-400 uppercase tracking-wider block"
          defaultSize="lg"
        />

        {/* 상위권 */}
        <div className="rounded-3xl bg-[#EFF6FF] border-2 border-blue-200 p-8 space-y-3">
          <div className="flex items-center gap-3">
            <EditableText
              value={ov.exec_upper_badge ?? "상위권"}
              onChange={(v) => setText("exec_upper_badge", v)}
              className="rounded-full bg-[#0B1F4D] text-white text-sm font-black px-4 py-1"
              defaultSize="sm"
            />
            <EditableText
              value={ov.exec_upper_tag ?? "기회"}
              onChange={(v) => setText("exec_upper_tag", v)}
              className="text-base font-bold text-[#0B1F4D]"
              defaultSize="base"
            />
          </div>
          <EditableText
            value={ov.exec_upper_headline ?? "예상보다 쉬웠다"}
            onChange={(v) => setText("exec_upper_headline", v)}
            className="text-2xl font-black text-[#0B1F4D] leading-snug block"
            defaultSize="2xl"
          />
          <EditableText
            value={ov.exec_upper_body ?? `킬러 ${killerNums}번이 모두 학교 프린트 연계 — 프린트 완성자에겐 시간 단축 구조`}
            onChange={(v) => setText("exec_upper_body", v)}
            multiline
            className="text-base text-gray-600 leading-relaxed"
            defaultSize="base"
          />
        </div>

        {/* 중·하위권 */}
        <div className="rounded-3xl bg-[#FFF1F2] border-2 border-red-200 p-8 space-y-3">
          <div className="flex items-center gap-3">
            <EditableText
              value={ov.exec_lower_badge ?? "중·하위권"}
              onChange={(v) => setText("exec_lower_badge", v)}
              className="rounded-full bg-[#DC2626] text-white text-sm font-black px-4 py-1"
              defaultSize="sm"
            />
            <EditableText
              value={ov.exec_lower_tag ?? "위기"}
              onChange={(v) => setText("exec_lower_tag", v)}
              className="text-base font-bold text-[#DC2626]"
              defaultSize="base"
            />
          </div>
          <EditableText
            value={ov.exec_lower_headline ?? "예상보다 어려웠다"}
            onChange={(v) => setText("exec_lower_headline", v)}
            className="text-2xl font-black text-[#DC2626] leading-snug block"
            defaultSize="2xl"
          />
          <EditableText
            value={ov.exec_lower_body ?? "교과서 기본 비중은 낮고, 후반 킬러 구간에서 시간이 급격히 부족해짐"}
            onChange={(v) => setText("exec_lower_body", v)}
            multiline
            className="text-base text-gray-600 leading-relaxed"
            defaultSize="base"
          />
        </div>
      </div>

      {/* ── 핵심 인사이트 3개 ── */}
      <div className="space-y-4">
        <EditableText
          value={ov.exec_insight_label ?? "핵심 인사이트"}
          onChange={(v) => setText("exec_insight_label", v)}
          className="text-lg font-black text-gray-400 uppercase tracking-wider block"
          defaultSize="lg"
        />
        {[
          { color: "#F97316", defaultTitle: "체감 난이도 상승",         titleKey: "exec_insight_title_0" },
          { color: "#0B1F4D", defaultTitle: "압도적 단원 편중",         titleKey: "exec_insight_title_1" },
          { color: "#DC2626", defaultTitle: "고득점의 열쇠 = 학교 프린트", titleKey: "exec_insight_title_2" },
        ].map(({ color, defaultTitle, titleKey }, i) => (
          <div
            key={i}
            className="rounded-3xl p-8 space-y-4"
            style={{ backgroundColor: `${color}08`, border: `2px solid ${color}20` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-white rounded-xl px-3 py-1" style={{ backgroundColor: color }}>
                0{i + 1}
              </span>
              <EditableText
                value={ov[titleKey] ?? defaultTitle}
                onChange={(v) => setText(titleKey, v)}
                className="text-xl font-black"
                style={{ color } as React.CSSProperties}
                defaultSize="xl"
              />
            </div>
            <EditableText
              value={analysis.executiveSummary[i] ?? ""}
              onChange={(val) => setSummary(i, val)}
              multiline
              defaultSize="base"
              className="text-gray-700 leading-relaxed"
            />
          </div>
        ))}
      </div>

      {/* ── 핵심 수치 요약 ── */}
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8 flex items-center justify-between">
          <EditableText value={ov.exec_stat_unit_label ?? "핵심 단원"} onChange={(v) => setText("exec_stat_unit_label", v)} className="text-lg font-bold text-gray-500" defaultSize="lg" />
          <p className="text-2xl font-black text-[#0B1F4D]">{topUnit?.unit}</p>
        </div>
        <div className="rounded-3xl bg-red-50 border border-red-200 p-8 flex items-center justify-between">
          <EditableText value={ov.exec_stat_killer_label ?? "킬러 문항"} onChange={(v) => setText("exec_stat_killer_label", v)} className="text-lg font-bold text-gray-500" defaultSize="lg" />
          <p className="text-2xl font-black text-[#DC2626]">{killerNums}번</p>
        </div>
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8 flex items-center justify-between">
          <EditableText value={ov.exec_stat_score_label ?? "킬러 배점"} onChange={(v) => setText("exec_stat_score_label", v)} className="text-lg font-bold text-gray-500" defaultSize="lg" />
          <p className="text-2xl font-black text-[#DC2626]">{analysis.killerSummary.totalKillerScore}점</p>
        </div>
      </div>
    </div>
  );
}
