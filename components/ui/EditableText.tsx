"use client";
import React, { useState, useRef, useEffect } from "react";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";

const SIZE_CLASSES: Record<TextSize, string> = {
  xs:   "text-xs",
  sm:   "text-sm",
  base: "text-base",
  lg:   "text-lg",
  xl:   "text-xl",
  "2xl":"text-2xl",
  "3xl":"text-3xl",
};

const SIZE_LABELS: Record<TextSize, string> = {
  xs:   "소",
  sm:   "중",
  base: "기본",
  lg:   "대",
  xl:   "특대",
  "2xl":"2XL",
  "3xl":"3XL",
};

// 화면에 보여줄 사이즈 옵션 (자주 쓰는 것만)
const VISIBLE_SIZES: TextSize[] = ["xs", "sm", "base", "lg", "xl"];

interface Props {
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  defaultSize?: TextSize;
}

export default function EditableText({
  value,
  onChange,
  multiline = false,
  className = "",
  placeholder,
  defaultSize = "sm",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [size, setSize] = useState<TextSize>(defaultSize);
  const [bold, setBold] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      setTimeout(() => {
        textareaRef.current?.focus();
        inputRef.current?.focus();
      }, 0);
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) onChange(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setDraft(value); setEditing(false); }
    if (!multiline && e.key === "Enter") { e.preventDefault(); commit(); }
    if (multiline && e.key === "Enter" && e.shiftKey) { e.preventDefault(); commit(); }
  };

  const sizeClass = SIZE_CLASSES[size];
  const boldClass = bold ? "font-black" : "";
  const inputClass = `w-full bg-white border border-[#0B1F4D]/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0B1F4D] focus:ring-1 focus:ring-[#0B1F4D]/20 leading-relaxed ${sizeClass} ${boldClass}`;

  if (editing) {
    return (
      <div className="w-full">
        {/* 미니 툴바 */}
        <div className="flex items-center gap-0.5 mb-1.5 px-1 py-0.5 bg-white border border-gray-200 rounded-lg shadow-sm w-fit">
          {VISIBLE_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setSize(s); }}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                size === s
                  ? "bg-[#0B1F4D] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {SIZE_LABELS[s]}
            </button>
          ))}
          <div className="w-px h-3.5 bg-gray-200 mx-1" />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setBold(!bold); }}
            className={`px-2 py-0.5 rounded text-xs font-black transition-colors ${
              bold ? "bg-[#0B1F4D] text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            B
          </button>
          <div className="w-px h-3.5 bg-gray-200 mx-1" />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); commit(); }}
            className="px-2 py-0.5 rounded text-xs text-emerald-600 hover:bg-emerald-50 font-medium"
          >
            완료
          </button>
        </div>

        {multiline ? (
          <textarea
            ref={textareaRef}
            value={draft}
            rows={3}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className={`resize-none ${inputClass}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className={inputClass}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="클릭하여 편집"
      className={`cursor-text rounded px-0.5 hover:bg-yellow-50 hover:ring-1 hover:ring-yellow-300 transition-all ${sizeClass} ${boldClass} ${className}`}
    >
      {value || <span className="text-gray-300 italic text-sm">{placeholder}</span>}
    </span>
  );
}
