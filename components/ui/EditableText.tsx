"use client";
import React, { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}

export default function EditableText({ value, onChange, multiline = false, className = "", placeholder }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
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
    if (draft.trim() !== value) onChange(draft.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setDraft(value); setEditing(false); }
    if (!multiline && e.key === "Enter") { e.preventDefault(); commit(); }
    if (multiline && e.key === "Enter" && e.shiftKey) { e.preventDefault(); commit(); }
  };

  if (editing) {
    const sharedClass = `w-full bg-white border border-[#0B1F4D]/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0B1F4D] focus:ring-1 focus:ring-[#0B1F4D]/20 ${className}`;
    if (multiline) {
      return (
        <textarea
          ref={textareaRef}
          value={draft}
          rows={3}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={`resize-none ${sharedClass}`}
          placeholder={placeholder}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={sharedClass}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="클릭하여 편집"
      className={`cursor-text rounded px-0.5 hover:bg-yellow-50 hover:ring-1 hover:ring-yellow-300 transition-all ${className}`}
    >
      {value || <span className="text-gray-300 italic">{placeholder}</span>}
    </span>
  );
}
