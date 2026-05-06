"use client";
import React, { useRef } from "react";
import { GripVertical, Trash2, EyeOff } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReportSection } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  section: ReportSection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  children: React.ReactNode;
}

export default function EditableBlock({
  section,
  isSelected,
  onSelect,
  onDelete,
  onToggleVisibility,
  children,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-2xl border-2 transition-all group",
        isSelected ? "border-[#0B1F4D]" : "border-transparent hover:border-gray-200",
        !section.visible && "opacity-40",
        isDragging && "shadow-2xl z-50"
      )}
    >
      <div
        className={cn(
          "absolute -top-4 left-4 flex items-center gap-1 rounded-lg bg-[#0B1F4D] px-2 py-1 shadow-md transition-all",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <button
          className="cursor-grab active:cursor-grabbing text-white/70 hover:text-white p-0.5"
          {...attributes}
          {...listeners}
          title="드래그하여 순서 변경"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <span className="text-white text-xs font-medium px-1">{section.title}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(section.id); }}
          className="text-white/70 hover:text-white p-0.5"
          title={section.visible ? "숨기기" : "보이기"}
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(section.id); }}
          className="text-white/70 hover:text-red-400 p-0.5"
          title="삭제"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        className="py-10 px-4 md:px-10"
        onClick={onSelect}
      >
        {children}
      </div>
    </div>
  );
}
