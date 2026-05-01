"use client";
import React from "react";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import type { ReportSection } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  sections: ReportSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

const SECTION_ICONS: Record<string, string> = {
  hero: "🏷️",
  executive_summary: "📊",
  unit_distribution: "🥧",
  type_distribution: "📋",
  difficulty_distribution: "📈",
  exam_flow: "〰️",
  source_matrix: "🗺️",
  question_diagnosis: "🔍",
  killer_summary: "⚡",
  killer_deepdive: "🎯",
  final_strategy: "🚀",
};

export default function DocumentSidebar({ sections, activeId, onSelect, onToggleVisibility }: Props) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">문서 구조</h3>
      </div>
      <nav className="p-2 space-y-0.5">
        {sortedSections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all group",
              activeId === section.id
                ? "bg-[#0B1F4D] text-white"
                : "text-gray-600 hover:bg-gray-100",
              !section.visible && "opacity-40"
            )}
          >
            <GripVertical className="h-3.5 w-3.5 flex-shrink-0 opacity-40" />
            <span className="text-sm flex-shrink-0">{SECTION_ICONS[section.type] ?? "📄"}</span>
            <span className="text-xs font-medium flex-1 leading-tight truncate">{section.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(section.id);
              }}
              className={cn(
                "flex-shrink-0 rounded p-0.5 transition-opacity",
                activeId === section.id ? "opacity-70 hover:opacity-100" : "opacity-0 group-hover:opacity-70 hover:!opacity-100"
              )}
            >
              {section.visible ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
            </button>
          </button>
        ))}
      </nav>
    </div>
  );
}
