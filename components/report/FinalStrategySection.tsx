"use client";
import React from "react";
import { BookMarked, CheckCircle2 } from "lucide-react";
import type { ExamAnalysis, SectionConfig } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: React.Dispatch<React.SetStateAction<ExamAnalysis>>;
  sectionConfig?: SectionConfig;
}

const COLORS = ["#0B1F4D", "#F97316", "#3B82F6", "#22C55E", "#A855F7"];

export default function FinalStrategySection({ analysis, onUpdate, sectionConfig }: Props) {
  const topUnit = analysis.unitDistribution[0];
  const killerNums = analysis.killerSummary.killerQuestionNumbers.join("·");
  const ov = analysis.overrides ?? {};
  const isHidden = (id: string) => sectionConfig?.hiddenElements?.includes(id) ?? false;
  const strategyCount = sectionConfig?.itemCount ?? analysis.finalStrategy.length;

  const setText = (key: string, val: string) =>
    onUpdate?.((prev) => ({ ...prev, overrides: { ...(prev.overrides ?? {}), [key]: val } }));

  return (
    <div className="space-y-10">

      {/* ── 상단 강조 ── */}
      <div className="rounded-3xl p-10 text-white text-center space-y-4"
        style={{ background: "linear-gradient(135deg, #0B1F4D 0%, #1a3a7a 100%)" }}>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 px-5 py-2">
          <BookMarked className="h-5 w-5 text-[#F97316]" />
          <EditableText value={ov.final_badge ?? "학교 프린트 완벽 해부"} onChange={(v) => setText("final_badge", v)}
            styleKey="final_badge" className="text-base font-bold text-[#F97316]" defaultSize="base" />
        </div>
        <EditableText
          value={ov.final_headline ?? "90점 돌파를 위한\n단 하나의 전략"}
          onChange={(v) => setText("final_headline", v)}
          styleKey="final_headline"
          multiline defaultSize="2xl" className="font-black text-white leading-tight block"
        />
        <EditableText
          value={ov.final_meta ?? `핵심 단원 ${topUnit?.unit ?? "—"} · 킬러 ${killerNums}번`}
          onChange={(v) => setText("final_meta", v)}
          styleKey="final_meta"
          className="text-base text-white/60" defaultSize="base"
        />
      </div>

      {/* ── 전략 리스트 ── */}
      <div className="space-y-5">
        {Array.from({ length: strategyCount }, (_, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <div key={i} className="rounded-3xl p-8 space-y-4"
              style={{ backgroundColor: `${color}08`, border: `2px solid ${color}20` }}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow"
                  style={{ backgroundColor: color }}>{i + 1}</div>
                <EditableText value={ov[`final_strategy_label_${i}`] ?? `전략 ${i + 1}`}
                  onChange={(v) => setText(`final_strategy_label_${i}`, v)}
                  styleKey={`final_strategy_label_${i}`}
                  className="text-base font-bold" style={{ color }} defaultSize="base" />
              </div>
              <EditableText value={ov[`final_strategy_${i}`] ?? analysis.finalStrategy[i] ?? ""}
                onChange={(v) => setText(`final_strategy_${i}`, v)}
                styleKey={`final_strategy_${i}`}
                multiline defaultSize="lg" className="text-gray-800 font-medium" />
              <div className="flex items-center gap-2 text-base" style={{ color: `${color}80` }}>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <EditableText value={ov[`final_practice_label_${i}`] ?? "실천 항목"}
                  onChange={(v) => setText(`final_practice_label_${i}`, v)}
                  styleKey={`final_practice_label_${i}`}
                  className="font-medium" style={{ color: `${color}80` }} defaultSize="base" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 결론 박스 ── */}
      {!isHidden("final_conclusion") && (
        <div className="rounded-3xl bg-[#F8FAFC] border-2 border-[#0B1F4D]/15 p-10 space-y-6">
          <EditableText value={ov.final_conclusion_label ?? "기말고사의 승패를 결정하는 결론"}
            onChange={(v) => setText("final_conclusion_label", v)}
            styleKey="final_conclusion_label"
            className="text-base font-black text-[#0B1F4D]/50 uppercase tracking-wider block" defaultSize="base" />
          <EditableText
            value={ov.final_conclusion_body ?? "학교가 제시한 '프린트'라는 힌트를\n얼마나 깊이 파고드느냐에 달려 있습니다."}
            onChange={(v) => setText("final_conclusion_body", v)}
            styleKey="final_conclusion_body"
            multiline defaultSize="2xl" className="font-black text-[#0B1F4D] leading-snug block"
          />
          <div className="grid grid-cols-1 gap-4 pt-2">
            {[
              { labelKey: "final_stat_0_label", label: "핵심 단원", valKey: "final_stat_0_val", val: topUnit?.unit ?? "주요 단원",   subKey: "final_stat_0_sub", sub: `배점 ${topUnit?.percentage?.toFixed(1)}%`, color: "#0B1F4D" },
              { labelKey: "final_stat_1_label", label: "킬러 문항", valKey: "final_stat_1_val", val: `${killerNums}번`,               subKey: "final_stat_1_sub", sub: `총 ${analysis.killerSummary.totalKillerScore}점`, color: "#DC2626" },
              { labelKey: "final_stat_2_label", label: "목표 점수", valKey: "final_stat_2_val", val: "90점 이상",                     subKey: "final_stat_2_sub", sub: "프린트 마스터로 달성 가능", color: "#22C55E" },
            ].map((item) => (
              <div key={item.labelKey} className="rounded-2xl p-6 flex items-center justify-between"
                style={{ borderColor: `${item.color}25`, backgroundColor: `${item.color}06`, border: `1.5px solid ${item.color}25` }}>
                <div>
                  <EditableText value={ov[item.labelKey] ?? item.label} onChange={(v) => setText(item.labelKey, v)}
                    styleKey={item.labelKey} className="text-base text-gray-400 font-medium block" defaultSize="base" />
                  <EditableText value={ov[item.subKey] ?? item.sub} onChange={(v) => setText(item.subKey, v)}
                    styleKey={item.subKey} className="text-base text-gray-500 block" defaultSize="base" />
                </div>
                <EditableText value={ov[item.valKey] ?? item.val} onChange={(v) => setText(item.valKey, v)}
                  styleKey={item.valKey} className="text-2xl font-black" style={{ color: item.color }} defaultSize="2xl" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
