"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FileSearch, BookOpen, ChevronRight, Sparkles, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    { icon: FileSearch, text: "PDF 스캔본 자동 분석" },
    { icon: BarChart3, text: "5종 고급 분석 그래프" },
    { icon: FileText, text: "블로그 바로 올릴 수 있는 리포트 생성" },
    { icon: Sparkles, text: "GPT 기반 AI 인사이트" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0B1F4D]/8 border border-[#0B1F4D]/15 px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-[#F97316]" />
            <span className="text-xs font-semibold text-[#0B1F4D] uppercase tracking-wider">AI 시험지 분석 플랫폼</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1F4D] leading-tight mb-4">
            시험지 분석 리포트
            <br />
            <span className="text-[#F97316]">자동 생성기</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
            스캔본 PDF를 업로드하면 문항별 난이도와 시험 흐름을 자동 분석합니다.
            <br />
            학원 블로그용 전문 리포트를 즉시 생성하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 animate-fade-in">
          {features.map((f) => (
            <div key={f.text} className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 px-5 py-3.5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1F4D]/8">
                <f.icon className="h-5 w-5 text-[#0B1F4D]" />
              </div>
              <span className="text-sm font-medium text-gray-700">{f.text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up">
          <button
            onClick={() => router.push("/analyze")}
            className="group relative overflow-hidden rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #0B1F4D 0%, #1a3a7a 100%)" }}
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
            <div className="absolute right-8 bottom-0 h-24 w-24 rounded-full bg-[#F97316]/20 translate-y-8" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316]">
                <FileSearch className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">분석하기</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                시험지 PDF를 업로드하고 AI 기반 전문 분석 리포트를 생성합니다.
              </p>
              <div className="flex items-center gap-2 text-[#F97316] font-semibold text-sm">
                <span>시작하기</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/reports")}
            className="group relative overflow-hidden rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] bg-white border border-gray-200"
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#0B1F4D]/3 -translate-y-10 translate-x-10" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1F4D]/8">
                <BookOpen className="h-7 w-7 text-[#0B1F4D]" />
              </div>
              <h2 className="text-2xl font-black text-[#0B1F4D] mb-2">기존 분석 보기</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                저장된 분석 리포트를 검색하고 수정하거나 내보낼 수 있습니다.
              </p>
              <div className="flex items-center gap-2 text-[#0B1F4D] font-semibold text-sm">
                <span>리포트 목록</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          데모 모드에서는 Mock 데이터로 전체 플로우를 체험할 수 있습니다.
          OPENAI_API_KEY 설정 시 실제 GPT 분석이 활성화됩니다.
        </p>
      </div>
    </main>
  );
}
