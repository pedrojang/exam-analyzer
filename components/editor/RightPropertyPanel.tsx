"use client";
import React from "react";
import { X, Type, Palette, BarChart2, PieChart, TrendingUp, ScatterChart, Wand2, MessageSquare, User } from "lucide-react";
import type { ReportSection } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  section: ReportSection | null;
  onClose: () => void;
  onTitleChange: (id: string, title: string) => void;
  onAiRewrite: (mode: "blog" | "parent" | "internal") => void;
}

const ACCENT_COLORS = ["#0B1F4D", "#F97316", "#DC2626", "#3B82F6", "#22C55E", "#A855F7", "#EAB308"];

const CHART_TYPES = [
  { icon: PieChart, label: "도넛", value: "donut" },
  { icon: BarChart2, label: "막대", value: "bar" },
  { icon: TrendingUp, label: "라인", value: "line" },
  { icon: ScatterChart, label: "산점도", value: "scatter" },
];

export default function RightPropertyPanel({ section, onClose, onTitleChange, onAiRewrite }: Props) {
  if (!section) return null;

  const isChart = ["unit_distribution", "type_distribution", "difficulty_distribution", "exam_flow", "source_matrix"].includes(section.type);

  return (
    <aside className="w-64 flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">속성 패널</h3>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
          <p className="text-xs text-gray-400 mb-0.5">블록 타입</p>
          <p className="text-sm font-semibold text-gray-700">{section.title}</p>
        </div>

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

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
            <Palette className="h-3.5 w-3.5" />
            강조 색상
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                className="h-7 w-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {isChart && (
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
              <BarChart2 className="h-3.5 w-3.5" />
              그래프 타입
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CHART_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all hover:bg-[#0B1F4D] hover:text-white hover:border-[#0B1F4D]",
                    "border-gray-200 text-gray-600"
                  )}
                >
                  <ct.icon className="h-3.5 w-3.5" />
                  {ct.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
            <Wand2 className="h-3.5 w-3.5" />
            AI 재작성
          </label>
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => onAiRewrite("blog")}
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#F97316]" />
              블로그 톤 강화
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => onAiRewrite("parent")}
            >
              <User className="h-3.5 w-3.5 text-[#3B82F6]" />
              학부모 설명형으로 바꾸기
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => onAiRewrite("internal")}
            >
              <BarChart2 className="h-3.5 w-3.5 text-[#22C55E]" />
              내부 진단형으로 바꾸기
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
