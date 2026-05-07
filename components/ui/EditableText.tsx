"use client";
import React, { useState, useRef, useLayoutEffect, useCallback, useContext, useEffect } from "react";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "massive";

const BASE_PX: Record<TextSize, number> = {
  xs:      11,
  sm:      13,
  base:    15,
  lg:      18,
  xl:      22,
  "2xl":   27,
  "3xl":   33,
  massive: 0,
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

export interface TextStyleData { size: TextSize; scale: number; bold: boolean }
export interface StyleContextType {
  getStyle: (key: string) => TextStyleData | undefined;
  setStyle: (key: string, style: TextStyleData) => void;
  readOnly?: boolean;
  overrides?: Record<string, string>;
}
export const StyleContext = React.createContext<StyleContextType>({
  getStyle: () => undefined,
  setStyle: () => {},
  readOnly: false,
});

interface Props {
  value: string;
  onChange: (val: string) => void;
  styleKey?: string;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  defaultSize?: TextSize;
}

export default function EditableText({
  value,
  onChange,
  styleKey,
  multiline = false,
  className = "",
  style,
  placeholder,
  defaultSize = "sm",
}: Props) {
  const { getStyle, setStyle, readOnly: ctxReadOnly, overrides: ctxOverrides } = useContext(StyleContext);
  const isReadOnly = ctxReadOnly ?? false;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [size, setSize] = useState<TextSize>(() => {
    const stored = styleKey ? getStyle(styleKey) : undefined;
    return stored?.size ?? defaultSize;
  });
  const [bold, setBold] = useState<boolean>(() => {
    const stored = styleKey ? getStyle(styleKey) : undefined;
    return stored?.bold ?? false;
  });
  const [sizeScale, setSizeScale] = useState<number>(() => {
    const stored = styleKey ? getStyle(styleKey) : undefined;
    return stored?.scale ?? 1.0;
  });
  const [massivePx, setMassivePx] = useState<number | null>(() => {
    const stored = styleKey ? getStyle(styleKey) : undefined;
    return (stored?.size ?? defaultSize) === "massive" ? 40 : null;
  });

  // 미리보기(readOnly)에서 편집창 스타일 변경을 실시간 반영
  useEffect(() => {
    if (!isReadOnly || !styleKey) return;
    const stored = getStyle(styleKey);
    if (!stored) return;
    setSize(stored.size);
    setSizeScale(stored.scale);
    setBold(stored.bold);
    if (stored.size === "massive") setMassivePx((p) => p ?? 40);
  }, [isReadOnly, styleKey, getStyle]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outerRef    = useRef<HTMLElement>(null);
  const measureRef  = useRef<HTMLSpanElement>(null);

  const persistStyle = useCallback((s: TextSize, sc: number, b: boolean) => {
    if (styleKey) setStyle(styleKey, { size: s, scale: sc, bold: b });
  }, [styleKey, setStyle]);

  const handleSetSize = (s: TextSize) => {
    setSize(s);
    if (s !== "massive") setMassivePx(null);
    persistStyle(s, sizeScale, bold);
  };
  const handleSetScale = (sc: number) => {
    setSizeScale(sc);
    persistStyle(size, sc, bold);
  };
  const handleSetBold = (b: boolean) => {
    setBold(b);
    persistStyle(size, sizeScale, b);
  };

  const calcMassive = useCallback(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const tw = measure.offsetWidth;
    if (tw === 0) return;
    let el: HTMLElement | null = outerRef.current?.parentElement ?? null;
    while (el) {
      if (el.hasAttribute("data-preview-root")) break;
      const d = window.getComputedStyle(el).display;
      if (!d.startsWith("inline")) {
        const pw = el.parentElement?.offsetWidth ?? 0;
        if (pw > 0 && el.offsetWidth >= pw * 0.8) break;
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
      setTimeout(() => { textareaRef.current?.focus(); }, 0);
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) onChange(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setDraft(value); setEditing(false); }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit(); }
    // Shift+Enter: 기본 동작(줄바꿈) 허용
  };

  // readOnly 모드에서는 overrides 원본 객체에서 직접 파싱 — 클로저 타이밍 문제 없음
  const liveStyle: TextStyleData | undefined = (() => {
    if (!isReadOnly || !styleKey || !ctxOverrides) return undefined;
    const raw = ctxOverrides[`__s_${styleKey}`];
    if (!raw) return undefined;
    try { return JSON.parse(raw) as TextStyleData; } catch { return undefined; }
  })();
  const displaySize = liveStyle?.size ?? size;
  const displayScale = liveStyle?.scale ?? sizeScale;
  const displayBold = liveStyle?.bold ?? bold;

  const computedFontSize =
    displaySize === "massive" && massivePx
      ? massivePx * displayScale
      : BASE_PX[displaySize] * displayScale;

  const boldClass = displayBold ? "font-black" : "";
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

  // 편집 중 (readOnly면 진입 불가)
  if (editing && !isReadOnly) {
    return (
      <>
        {measureSpan}
        <div ref={outerRef as React.Ref<HTMLDivElement>} className="w-full">
          <div className="flex items-center gap-0.5 mb-1.5 px-1 py-0.5 bg-white border border-gray-200 rounded-lg shadow-sm w-fit flex-wrap">
            {VISIBLE_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSetSize(s); }}
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
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSetScale(Math.max(0.6, +((sizeScale - 0.05).toFixed(2)))); }}
              disabled={sizeScale <= 0.6}
              className="px-1.5 py-0.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >−</button>
            <span className="text-xs text-gray-400 w-8 text-center">{Math.round(sizeScale * 100)}%</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSetScale(Math.min(1.6, +((sizeScale + 0.05).toFixed(2)))); }}
              disabled={sizeScale >= 1.6}
              className="px-1.5 py-0.5 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >+</button>
            <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSetBold(!bold); }}
              className={`px-2 py-0.5 rounded text-xs font-black transition-colors ${bold ? "bg-[#0B1F4D] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >B</button>
            <div className="w-px h-3.5 bg-gray-200 mx-0.5" />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); commit(); }}
              className="px-2 py-0.5 rounded text-xs text-emerald-600 hover:bg-emerald-50 font-medium"
            >완료</button>
          </div>

          <textarea
            ref={textareaRef}
            value={draft}
            rows={multiline ? 3 : 1}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            style={inputStyle}
            className={`w-full resize-none bg-white border border-[#0B1F4D]/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0B1F4D] focus:ring-1 focus:ring-[#0B1F4D]/20 ${boldClass}`}
            placeholder={placeholder}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {measureSpan}
      <span
        ref={outerRef as React.Ref<HTMLSpanElement>}
        onClick={isReadOnly ? undefined : () => setEditing(true)}
        className={`${isReadOnly ? "" : "cursor-text"} ${boldClass} ${className}`}
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
