"use client";
import React from "react";
import { BookMarked, CheckCircle2 } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

const COLORS = ["#0B1F4D", "#F97316", "#3B82F6", "#22C55E", "#A855F7"];

export default function FinalStrategySection({ analysis, onUpdate }: Props) {
  const topUnit = analysis.unitDistribution[0];
  const killerNums = analysis.killerSummary.killerQuestionNumbers.join("·");

  const updateStrategy = (idx: number, val: string) => {
    if (!onUpdate) return;
    const next = [...analysis.finalStrategy];
    next[idx] = val;
    onUpdate({ ...analysis, finalStrategy: next });
  };

  return (
    <div className="space-y-10">

      {/* ── 상단 강조 ── */}
      <div
        className="rounded-3xl p-10 text-white text-center space-y-4"
        style={{ background: "linear-gradient(135deg, #0B1F4D 0%, #1a3a7a 100%)" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 px-5 py-2">
          <BookMarked className="h-5 w-5 text-[#F97316]" />
          <span className="text-base font-bold text-[#F97316]">학교 프린트 완벽 해부</span>
        </div>
        <p className="text-3xl font-black leading-tight">
          90점 돌파를 위한<br />단 하나의 전략
        </p>
        <p className="text-base text-white/60">
          핵심 단원 <strong className="text-white">{topUnit?.unit}</strong> · 킬러 <strong className="text-white">{killerNums}번</strong>
        </p>
      </div>

      {/* ── 전략 리스트 ── */}
      <div className="space-y-5">
        {analysis.finalStrategy.map((strategy, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <div
              key={i}
              className="rounded-3xl p-8 space-y-4"
              style={{ backgroundColor: `${color}08`, border: `2px solid ${color}20` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow"
                  style={{ backgroundColor: color }}
                >
                  {i + 1}
                </div>
                <p className="text-base font-bold" style={{ color }}>전략 {i + 1}</p>
              </div>
              <EditableText
                value={strategy}
                onChange={(val) => updateStrategy(i, val)}
                multiline
                defaultSize="lg"
                className="text-gray-800 leading-relaxed font-medium"
              />
              <div className="flex items-center gap-2 text-base" style={{ color: `${color}80` }}>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">실천 항목</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 결론 박스 ── */}
      <div className="rounded-3xl bg-[#F8FAFC] border-2 border-[#0B1F4D]/15 p-10 space-y-6">
        <p className="text-base font-black text-[#0B1F4D]/50 uppercase tracking-wider">기말고사의 승패를 결정하는 결론</p>
        <p className="text-2xl font-black text-[#0B1F4D] leading-snug">
          학교가 제시한 <span className="text-[#F97316]">'프린트'</span>라는 힌트를<br />
          얼마나 깊이 파고드느냐에 달려 있습니다.
        </p>
        <div className="grid grid-cols-1 gap-4 pt-2">
          {[
            { label: "핵심 단원", value: topUnit?.unit ?? "주요 단원", sub: `배점 ${topUnit?.percentage?.toFixed(1)}%`, color: "#0B1F4D" },
            { label: "킬러 문항", value: `${killerNums}번`, sub: `총 ${analysis.killerSummary.totalKillerScore}점`, color: "#DC2626" },
            { label: "목표 점수", value: "90점 이상", sub: "프린트 마스터로 달성 가능", color: "#22C55E" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-6 flex items-center justify-between"
              style={{ borderColor: `${item.color}25`, backgroundColor: `${item.color}06`, border: `1.5px solid ${item.color}25` }}
            >
              <div>
                <p className="text-base text-gray-400 font-medium">{item.label}</p>
                <p className="text-base text-gray-500">{item.sub}</p>
              </div>
              <p className="text-2xl font-black" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
