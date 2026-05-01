"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  { label: "PDF 업로드 완료", delay: 0, duration: 400 },
  { label: "페이지 이미지 변환 중", delay: 400, duration: 700 },
  { label: "문항 영역 인식 중", delay: 1100, duration: 600 },
  { label: "GPT API 분석 중", delay: 1700, duration: 900 },
  { label: "그래프 및 리포트 생성 중", delay: 2600, duration: 600 },
  { label: "편집 가능한 리포트 완성", delay: 3200, duration: 300 },
];

interface Props {
  onComplete: () => void;
}

export default function AnalysisProgress({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const TOTAL_DURATION = 3500;

    STEPS.forEach((step, i) => {
      const t = setTimeout(() => setCurrentStep(i + 1), step.delay + step.duration);
      timers.push(t);
    });

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(onComplete, 500);
    }, TOTAL_DURATION);
    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#0B1F4D]/10 mb-4">
            <Loader2 className="h-8 w-8 text-[#0B1F4D] animate-spin" />
          </div>
          <h2 className="text-xl font-black text-[#0B1F4D] mb-2">AI 분석 진행 중</h2>
          <p className="text-sm text-gray-500">GPT가 시험지를 분석하고 있습니다...</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">진행률</span>
            <span className="text-xs font-bold text-[#0B1F4D]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isDone = currentStep > i;
            const isActive = currentStep === i;
            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 rounded-xl p-3.5 transition-all ${
                  isDone
                    ? "bg-green-50 border border-green-200"
                    : isActive
                    ? "bg-[#0B1F4D]/5 border border-[#0B1F4D]/20"
                    : "bg-gray-50 border border-transparent opacity-40"
                }`}
              >
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 text-[#0B1F4D] animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDone ? "text-green-700" : isActive ? "text-[#0B1F4D]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
