"use client";
import React from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobilePreviewModal({ onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-wide">
        모바일 미리보기 · 390px
      </p>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white rounded-full bg-white/10 p-2 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* 폰 외관 */}
      <div className="relative flex-shrink-0" style={{ width: 430 }}>
        <div
          className="bg-[#1C1C1E] rounded-[3.5rem] p-3"
          style={{ boxShadow: "0 0 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.08)" }}
        >
          <div
            className="bg-[#F8FAFC] rounded-[3rem] overflow-hidden flex flex-col"
            style={{ height: "min(88vh, 812px)" }}
          >
            {/* Dynamic Island */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-28 h-7 bg-black rounded-full" />
            </div>

            {/* 리포트 콘텐츠 */}
            <div
              data-preview-root="true"
              className="flex-1 overflow-y-auto"
              style={{ width: 404 }}
            >
              <div className="px-3 py-3 space-y-5">
                {children}
              </div>
            </div>

            {/* 홈 바 */}
            <div className="flex-shrink-0 flex justify-center py-2">
              <div className="w-32 h-1 bg-black/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* 전원 버튼 */}
        <div className="absolute right-[-4px] top-40 w-1 h-20 bg-[#3A3A3C] rounded-r-full" />
        {/* 볼륨 버튼 */}
        <div className="absolute left-[-4px] top-32 w-1 h-10 bg-[#3A3A3C] rounded-l-full" />
        <div className="absolute left-[-4px] top-48 w-1 h-14 bg-[#3A3A3C] rounded-l-full" />
        <div className="absolute left-[-4px] top-64 w-1 h-14 bg-[#3A3A3C] rounded-l-full" />
      </div>
    </div>
  );
}
