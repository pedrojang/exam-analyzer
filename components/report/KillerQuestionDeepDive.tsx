"use client";
import React from "react";
import { AlertTriangle, Brain, Clock, Shield } from "lucide-react";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

export default function KillerQuestionDeepDive({ analysis, onUpdate }: Props) {
  const ov = analysis.overrides ?? {};
  const killers = analysis.questions.filter((q) => q.isKiller);

  const setText = (key: string, val: string) =>
    onUpdate?.({ ...analysis, overrides: { ...ov, [key]: val } });


  return (
    <div className="space-y-6">
      {killers.map((q) => {
        const color = DIFFICULTY_COLORS[q.difficulty];
        const strategyKey = `deepdive_strategy_${q.id}`;
        return (
          <div key={q.id} className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: `${color}30` }}>
            {/* 헤더 */}
            <div className="flex items-center gap-4 p-5" style={{ backgroundColor: `${color}10` }}>
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white font-black text-lg" style={{ backgroundColor: color }}>
                {q.number}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-bold text-red-500">킬러 문항</span>
                </div>
                <p className="font-bold text-gray-900">{q.number}번 · {q.type} · {q.score}점 · {q.unit}</p>
                <p className="text-xs text-gray-500">난이도: {q.difficulty} · 출처: {q.source}</p>
              </div>
            </div>

            {/* 상세 내용 */}
            <div className="p-5 grid grid-cols-1 gap-4 bg-white">
              <div className="rounded-xl p-4" style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4" style={{ color }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>필요한 사고 단계</span>
                </div>
                <EditableText
                  value={ov[`q_${q.id}_required_thinking`] ?? q.requiredThinking}
                  onChange={(v) => setText(`q_${q.id}_required_thinking`, v)}
                  multiline defaultSize="sm" className="text-gray-700"
                />
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">흔한 함정</span>
                </div>
                <EditableText
                  value={ov[`q_${q.id}_likely_trap`] ?? q.likelyTrap}
                  onChange={(v) => setText(`q_${q.id}_likely_trap`, v)}
                  multiline defaultSize="sm" className="text-amber-800"
                />
              </div>

              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">학생 당황 원인</span>
                </div>
                <EditableText
                  value={ov[`q_${q.id}_student_panic_reason`] ?? q.studentPanicReason}
                  onChange={(v) => setText(`q_${q.id}_student_panic_reason`, v)}
                  multiline defaultSize="sm" className="text-red-700"
                />
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">대비 전략</span>
                </div>
                <EditableText
                  value={ov[strategyKey] ?? `${q.requiredThinking}에 대한 집중 훈련이 필요합니다. 유사 유형 문제를 반복하여 사고 패턴을 체화하세요.`}
                  onChange={(v) => setText(strategyKey, v)}
                  multiline defaultSize="sm" className="text-blue-800"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
