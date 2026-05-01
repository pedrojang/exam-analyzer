"use client";
import React from "react";
import { CheckCircle2, ArrowRight, BookMarked } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

const STRATEGY_COLORS = ["#0B1F4D", "#F97316", "#3B82F6", "#22C55E", "#A855F7"];

export default function FinalStrategySection({ analysis, onUpdate }: Props) {
  const topUnit = analysis.unitDistribution[0];
  const killerNums = analysis.killerSummary.killerQuestionNumbers;

  const updateStrategy = (idx: number, val: string) => {
    if (!onUpdate) return;
    const next = [...analysis.finalStrategy];
    next[idx] = val;
    onUpdate({ ...analysis, finalStrategy: next });
  };

  return (
    <div className="space-y-6">
      {/* 강조 제목 박스 */}
      <div
        className="rounded-2xl px-8 py-7 text-white"
        style={{ background: "linear-gradient(135deg, #0B1F4D 0%, #1a3a7a 100%)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">최종 처방</p>
        <h2 className="text-2xl md:text-3xl font-black leading-tight">
          90점 돌파를 위한 단 하나의 전략
        </h2>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 px-4 py-1.5">
          <BookMarked className="h-4 w-4 text-[#F97316]" />
          <span className="text-sm font-bold text-[#F97316]">학교 프린트 연계 문항의 완벽한 해부</span>
        </div>
      </div>

      {/* 전략 리스트 */}
      <div className="space-y-3">
        {analysis.finalStrategy.map((strategy, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border px-5 py-4.5 hover:shadow-sm transition-all"
            style={{ borderColor: `${STRATEGY_COLORS[i % STRATEGY_COLORS.length]}25`, backgroundColor: `${STRATEGY_COLORS[i % STRATEGY_COLORS.length]}05` }}
          >
            <div
              className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-black shadow"
              style={{ backgroundColor: STRATEGY_COLORS[i % STRATEGY_COLORS.length] }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: STRATEGY_COLORS[i % STRATEGY_COLORS.length] }} />
                <EditableText
                  value={strategy}
                  onChange={(val) => updateStrategy(i, val)}
                  multiline
                  className="text-sm text-gray-800 leading-relaxed font-medium"
                />
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-gray-200 flex-shrink-0 mt-0.5" />
          </div>
        ))}
      </div>

      {/* 핵심 메시지 인용 */}
      <div className="rounded-2xl bg-[#F8FAFC] border border-[#0B1F4D]/15 px-8 py-7">
        <p className="text-xs font-bold text-[#0B1F4D]/50 uppercase tracking-wider mb-3">기말고사의 승패를 결정하는 결론</p>
        <p className="text-lg font-black text-[#0B1F4D] leading-relaxed mb-4">
          기말고사의 승패는 결국, 학교가 제시한 <span className="text-[#F97316]">'프린트'</span>라는 힌트를 얼마나 깊이 파고드느냐에 달려 있습니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "핵심 단원", value: topUnit?.unit ?? "주요 단원", sub: `배점 비중 ${topUnit?.percentage?.toFixed(1)}%`, color: "#0B1F4D" },
            { label: "킬러 문항", value: `${killerNums.join("·")}번`, sub: `총 ${analysis.killerSummary.totalKillerScore}점`, color: "#DC2626" },
            { label: "목표 점수", value: "90점 이상", sub: "프린트 마스터로 달성 가능", color: "#22C55E" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border p-4 text-center"
              style={{ borderColor: `${item.color}25`, backgroundColor: `${item.color}06` }}
            >
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-lg font-black" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
