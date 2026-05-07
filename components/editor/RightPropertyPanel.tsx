"use client";
import React from "react";
import { X, Type, Palette, Eye, EyeOff, Plus, Minus, Wand2, MessageSquare, User, BarChart2 } from "lucide-react";
import type { ExamAnalysis, ReportSection, SectionType, SectionConfig } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface Props {
  section: ReportSection | null;
  analysis: ExamAnalysis;
  onUpdate: React.Dispatch<React.SetStateAction<ExamAnalysis>>;
  onClose: () => void;
  onTitleChange: (id: string, title: string) => void;
  onAiRewrite: (mode: "blog" | "parent" | "internal") => void;
}

const ACCENT_COLORS = [
  { label: "네이비",   value: "#0B1F4D" },
  { label: "오렌지",   value: "#F97316" },
  { label: "레드",     value: "#DC2626" },
  { label: "블루",     value: "#3B82F6" },
  { label: "그린",     value: "#22C55E" },
  { label: "퍼플",     value: "#A855F7" },
  { label: "옐로",     value: "#EAB308" },
];

// 섹션별 토글 가능한 서브 요소 정의
const SECTION_ELEMENTS: Partial<Record<SectionType, { id: string; label: string }[]>> = {
  hero: [
    { id: "hero_meta",  label: "메타데이터 라인" },
    { id: "hero_stats", label: "통계 카드 그리드" },
    { id: "hero_hook",  label: "훅 문구 박스" },
  ],
  executive_summary: [
    { id: "exec_level_comparison", label: "수준별 체감 온도차" },
    { id: "exec_insights",         label: "핵심 인사이트 카드" },
    { id: "exec_stat_summary",     label: "핵심 수치 요약" },
  ],
  killer_summary: [
    { id: "killer_score_cards",   label: "핵심 수치 카드" },
    { id: "killer_score_bar",     label: "배점 구조 바" },
    { id: "killer_analysis_msg",  label: "분석 메시지 박스" },
    { id: "killer_conclusion_box", label: "결론 박스" },
  ],
  final_strategy: [
    { id: "final_conclusion", label: "결론 박스" },
  ],
  question_diagnosis: [
    { id: "zone_desc_basic",    label: "기본 구간 설명 텍스트" },
    { id: "zone_desc_standard", label: "변별 구간 설명 텍스트" },
    { id: "zone_desc_killer",   label: "킬러 구간 설명 텍스트" },
  ],
};

// 항목 수 조정 가능한 섹션
const VARIABLE_ITEM_SECTIONS: Partial<Record<SectionType, { label: string; min: number; max: number; defaultFn: (a: ExamAnalysis) => number }>> = {
  final_strategy:    { label: "전략 항목 수", min: 1, max: 8, defaultFn: (a) => a.finalStrategy.length },
  executive_summary: { label: "인사이트 수",  min: 1, max: 6, defaultFn: (a) => a.executiveSummary.length },
};

export default function RightPropertyPanel({ section, analysis, onUpdate, onClose, onTitleChange, onAiRewrite }: Props) {
  if (!section) return null;

  const sc: SectionConfig = analysis.sectionConfig?.[section.type as SectionType] ?? {};

  const setSectionConfig = (patch: Partial<SectionConfig>) => {
    onUpdate((prev) => ({
      ...prev,
      sectionConfig: {
        ...prev.sectionConfig,
        [section.type]: { ...(prev.sectionConfig?.[section.type as SectionType] ?? {}), ...patch },
      },
    }));
  };

  const toggleElement = (id: string) => {
    const hidden = sc.hiddenElements ?? [];
    const next = hidden.includes(id) ? hidden.filter((x) => x !== id) : [...hidden, id];
    setSectionConfig({ hiddenElements: next });
  };

  const isHidden = (id: string) => (sc.hiddenElements ?? []).includes(id);

  const elements = SECTION_ELEMENTS[section.type as SectionType];
  const varItem  = VARIABLE_ITEM_SECTIONS[section.type as SectionType];
  const itemCount = sc.itemCount ?? varItem?.defaultFn(analysis) ?? 0;

  return (
    <aside className="w-64 flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">섹션 속성</h3>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* 섹션 제목 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
            <Type className="h-3.5 w-3.5" />
            섹션 제목
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4D]"
            value={section.title}
            onChange={(e) => onTitleChange(section.id, e.target.value)}
          />
        </div>

        {/* 강조 색상 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
            <Palette className="h-3.5 w-3.5" />
            강조 색상
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map(({ label, value }) => (
              <button
                key={value}
                title={label}
                onClick={() => setSectionConfig({ accentColor: sc.accentColor === value ? undefined : value })}
                className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: value,
                  borderColor: sc.accentColor === value ? "#111" : "white",
                  boxShadow: sc.accentColor === value ? "0 0 0 2px #111" : "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
          {sc.accentColor && (
            <button
              className="mt-1.5 text-xs text-gray-400 hover:text-gray-600"
              onClick={() => setSectionConfig({ accentColor: undefined })}
            >
              기본값으로 초기화
            </button>
          )}
        </div>

        {/* 서브 요소 on/off */}
        {elements && elements.length > 0 && (
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
              <Eye className="h-3.5 w-3.5" />
              요소 표시/숨기기
            </label>
            <div className="space-y-1.5">
              {elements.map(({ id, label }) => {
                const hidden = isHidden(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleElement(id)}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      hidden
                        ? "bg-gray-100 text-gray-400"
                        : "bg-[#0B1F4D]/5 text-[#0B1F4D] border border-[#0B1F4D]/15"
                    }`}
                  >
                    <span>{label}</span>
                    {hidden
                      ? <EyeOff className="h-3.5 w-3.5 text-gray-400" />
                      : <Eye className="h-3.5 w-3.5 text-[#0B1F4D]" />
                    }
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 항목 수 조정 */}
        {varItem && (
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
              {varItem.label}
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSectionConfig({ itemCount: Math.max(varItem.min, itemCount - 1) })}
                disabled={itemCount <= varItem.min}
                className="h-8 w-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-bold text-[#0B1F4D] w-8 text-center">{itemCount}</span>
              <button
                onClick={() => setSectionConfig({ itemCount: Math.min(varItem.max, itemCount + 1) })}
                disabled={itemCount >= varItem.max}
                className="h-8 w-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* AI 재작성 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
            <Wand2 className="h-3.5 w-3.5" />
            AI 재작성
          </label>
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full justify-start gap-2 text-xs" onClick={() => onAiRewrite("blog")}>
              <MessageSquare className="h-3.5 w-3.5 text-[#F97316]" />
              블로그 톤 강화
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start gap-2 text-xs" onClick={() => onAiRewrite("parent")}>
              <User className="h-3.5 w-3.5 text-[#3B82F6]" />
              학부모 설명형
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start gap-2 text-xs" onClick={() => onAiRewrite("internal")}>
              <BarChart2 className="h-3.5 w-3.5 text-[#22C55E]" />
              내부 진단형
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
