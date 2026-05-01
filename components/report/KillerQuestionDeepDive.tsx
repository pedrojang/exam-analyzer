"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, Brain, Clock, Shield } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";

interface Props {
  analysis: ExamAnalysis;
}

export default function KillerQuestionDeepDive({ analysis }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const killers = analysis.questions.filter((q) => q.isKiller);

  return (
    <div className="space-y-4">
      {killers.map((q) => {
        const isOpen = openId === q.id;
        const color = DIFFICULTY_COLORS[q.difficulty];
        return (
          <div
            key={q.id}
            className="rounded-xl border overflow-hidden shadow-sm transition-all"
            style={{ borderColor: `${color}30` }}
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setOpenId(isOpen ? null : q.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-black text-lg"
                  style={{ backgroundColor: color }}
                >
                  {q.number}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500">킬러 문항</span>
                  </div>
                  <p className="font-bold text-gray-900">
                    {q.number}번 · {q.type} · {q.score}점 · {q.unit}
                  </p>
                  <p className="text-xs text-gray-500">난이도: {q.difficulty} · 출처: {q.source}</p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4" style={{ color }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                      필요한 사고 단계
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{q.requiredThinking}</p>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      흔한 함정 / 오답 포인트
                    </span>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">{q.likelyTrap}</p>
                </div>

                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                      학생 당황 원인
                    </span>
                  </div>
                  <p className="text-sm text-red-700 leading-relaxed">{q.studentPanicReason}</p>
                </div>

                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      대비 전략
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {q.requiredThinking}에 대한 집중 훈련이 필요합니다. 유사 유형 문제를 반복하여 사고 패턴을 체화하세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
