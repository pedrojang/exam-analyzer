"use client";
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "massive";

// 400px 기준 콘텐츠 너비에 맞춘 px 기준값
const BASE_PX: Record<TextSize, number> = {
  xs:      11,
  sm:      13,
  base:    15,
  lg:      18,
  xl:      22,
  "2xl":   27,
  "3xl":   33,
  massive: 0, // 동적 계산
};

const SIZE_LABELS: Record<TextSize, string> = {
  xs:      "소",
  sm:      "중",
  base:    "기본",
  lg:      "대",
  xl:      "특대",
  "2xl":   "2XL",
  "3xl":   "3XL",
  massive: "절반",
};

const VISIBLE_SIZES: TextSize[] = ["xs", "sm", "base", "lg", "xl", "massive"];

interface Props {
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  defaultSize?: TextSize;
}

export default function EditableText({
  value,
  onChange,
  multiline = false,
  className = "",
  style,
  placeholder,
  defaultSize = "sm",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [size, setSize] = useState<TextSize>(defaultSize);
  const [bold, setBold] = useState(false);
  const [sizeScale, setSizeScale] = useState(1.0); // 0.8 / 1.0 / 1.2
  const [massivePx, setMassivePx] = useState<number | null>(defaultSize === "massive" ? 40 : null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const outerRef    = useRef<HTMLElement>(null);
  const measureRef  = useRef<HTMLSpanElement>(null);

  const calcMassive = useCallback(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const tw = measure.offsetWidth;
    if (tw === 0) return;

    // "부모 너비를 채우는" 첫 번째 블록 요소를 컨테이너로 사용
    // → flex items-center 안에서 콘텐츠 크기로 수축된 div는 부모 대비 비율이 낮아서 건너뜀
    let el: HTMLElement | null = outerRef.current?.parentElement ?? null;
    while (el) {
      if (el.hasAttribute("data-preview-root")) break;
      const d = window.getComputedStyle(el).display;
      if (!d.startsWith("inline")) {
        const pw = el.parentElement?.offsetWidth ?? 0;
        if (pw > 0 && el.offsetWidth >= pw * 0.8) break; // 부모의 80% 이상 = 진짜 컨테이너
      }
      el = el.parentElement;
    }
    const cw = el?.offsetWidth ?? 0;
    if (cw === 0) return;
    setMassivePx(Math.min(Math.floor((cw * 0.5 / tw) * 100), 400));
  }, []);

  useLayoutEffect(() => {
    if (size !== "massive") { setMassivePx(null); return; }
    calcMassive();
    const raf = requestAnimationFrame(calcMassive);
    document.fonts?.ready?.then(calcMassive);
    window.addEventListener("resize", calcMassive);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", calcMassive); };
  }, [size, value, calcMassive]);

  useLayoutEffect(() => {
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

  // 실제 적용 폰트 크기 계산
  const computedFontSize =
    size === "massive" && massivePx
      ? massivePx * sizeScale
      : BASE_PX[size] * sizeScale;

  const boldClass = bold ? "font-black" : "";
  const inputStyle: React.CSSProperties = {
    fontSize: `${BASE_PX[size] * sizeScale}px`,
    lineHeight: 1.4,
  };

  const measureSpan = (
    <span
      ref={measureRef}
      aria-hidden
      style={{
        position: "fixed", top: "-9999px", left: "-9999px",
        visibility: "hidden", pointerEvents: "none",
        fontSize: "100px", fontWeight: 900, whiteSpace: "nowrap", lineHeight: 1,
      }}
    >
      {value}
    </span>
  );

  if (editing) {
    return (
      <>
        {measureSpan}
        <div ref={outerRef as React.Ref<HTMLDivElement>} className="w-full">
          {/* 툴바 */}
          <div className="flex items-center gap-0.5 mb-1.5 px-1 py-0.5 bg-white border border-gray-200 rounded-lg shadow-sm w-fit flex-wrap">
            {VISIBLE_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setSize(s); }}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  size === s
                    ? "bg-[#0B1F4D] text-white"
                    : s === "massive"
                    ? "text-orange-500 hover:bg-orange-50 font-bold"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {SIZE_LABELS[s]}
              </button>
            ))}
            <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
            {/* ±20% 조절 */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setSizeScale((p) => Math.max(0.8, +(p - 0.2).toFixed(1))); }}
              disabled={sizeScale <= 0.8}
              className="px-1.5 py-0.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >−</button>
            <span className="text-xs text-gray-400 w-8 text-center">{Math.round(sizeScale * 100)}%</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setSizeScale((p) => Math.min(1.2, +(p + 0.2).toFixed(1))); }}
              disabled={sizeScale >= 1.2}
              className="px-1.5 py-0.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >+</button>
            <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setBold(!bold); }}
              className={`px-2 py-0.5 rounded text-xs font-black transition-colors ${bold ? "bg-[#0B1F4D] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >B</button>
            <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); commit(); }}
              className="px-2 py-0.5 rounded text-xs text-emerald-600 hover:bg-emerald-50 font-medium"
            >완료</button>
          </div>

          {multiline ? (
            <textarea
              ref={textareaRef}
              value={draft}
              rows={3}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              className={`w-full resize-none bg-white border border-[#0B1F4D]/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0B1F4D] focus:ring-1 focus:ring-[#0B1F4D]/20 ${boldClass}`}
              placeholder={placeholder}
            />
          ) : (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              className={`w-full bg-white border border-[#0B1F4D]/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0B1F4D] focus:ring-1 focus:ring-[#0B1F4D]/20 ${boldClass}`}
              placeholder={placeholder}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {measureSpan}
      <span
        ref={outerRef as React.Ref<HTMLSpanElement>}
        onClick={() => setEditing(true)}
        className={`cursor-text ${boldClass} ${className}`}
        style={{
          ...style,
          fontSize: `${computedFontSize}px`,
          ...(size === "massive" && massivePx ? { lineHeight: 1 } : {}),
          whiteSpace: "pre-wrap",
        }}
      >
        {value || <span className="text-gray-300 italic" style={{ fontSize: 13 }}>{placeholder}</span>}
      </span>
    </>
  );
}
