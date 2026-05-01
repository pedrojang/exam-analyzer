"use client";
import React, { useState } from "react";
import type { ExamAnalysis, QuestionAnalysis, Difficulty } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
  editable?: boolean;
}

const DiffBadge = ({ d }: { d: Difficulty }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
    style={{
      backgroundColor: `${DIFFICULTY_COLORS[d]}20`,
      color: DIFFICULTY_COLORS[d],
      border: `1px solid ${DIFFICULTY_COLORS[d]}40`,
    }}
  >
    {d}
  </span>
);

const SourceBadge = ({ s }: { s: string }) => {
  const isSchoolPrint = s === "학교 프린트";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        isSchoolPrint
          ? "bg-[#0B1F4D] text-white"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isSchoolPrint && "★ "}{s}
    </span>
  );
};

type ZoneDef = {
  key: string;
  label: string;
  sublabel: string;
  color: string;
  filter: (q: QuestionAnalysis) => boolean;
};

const ZONES: ZoneDef[] = [
  {
    key: "basic",
    label: "기본 점수 확보 구간",
    sublabel: "교과서 중심 · 하~중 난이도",
    color: "#22C55E",
    filter: (q) => q.difficulty === "하",
  },
  {
    key: "standard",
    label: "변별력 결정 구간",
    sublabel: "학교 프린트 연계 · 중~중상 난이도",
    color: "#3B82F6",
    filter: (q) => q.difficulty === "중" || q.difficulty === "중상",
  },
  {
    key: "killer",
    label: "1등급을 가르는 킬러 문항 구간",
    sublabel: "학교 프린트 집중 · 상~최상 난이도",
    color: "#DC2626",
    filter: (q) => q.difficulty === "상" || q.difficulty === "최상",
  },
];

export default function QuestionDiagnosisTable({ analysis, onUpdate, editable = false }: Props) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [localQs, setLocalQs] = useState<QuestionAnalysis[]>(analysis.questions);

  const handleEdit = (rowIdx: number, col: keyof QuestionAnalysis, value: string) => {
    const updated = localQs.map((q, i) => {
      if (i !== rowIdx) return q;
      if (col === "score") return { ...q, score: Number(value) };
      if (col === "difficulty") return { ...q, difficulty: value as Difficulty };
      return { ...q, [col]: value };
    });
    setLocalQs(updated);
    if (onUpdate) onUpdate({ ...analysis, questions: updated });
  };

  const EditCell = ({ value, rowIdx, col }: { value: string | number; rowIdx: number; col: keyof QuestionAnalysis }) => {
    const isEditing = editable && editingCell?.row === rowIdx && editingCell?.col === col;
    if (isEditing) {
      return (
        <input
          autoFocus
          defaultValue={String(value)}
          className="w-full rounded border border-[#0B1F4D] px-1 py-0.5 text-xs focus:outline-none"
          onBlur={(e) => { handleEdit(rowIdx, col, e.target.value); setEditingCell(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") { handleEdit(rowIdx, col, e.currentTarget.value); setEditingCell(null); }}}
        />
      );
    }
    return (
      <span
        className={editable ? "cursor-pointer hover:bg-blue-50 rounded px-0.5 transition-colors" : ""}
        onClick={() => editable && setEditingCell({ row: rowIdx, col })}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-10">
      {ZONES.map((zone) => {
        const qs = localQs.filter(zone.filter);
        if (qs.length === 0) return null;
        const zoneTotal = qs.reduce((s, q) => s + q.score, 0);
        const hasKiller = qs.some((q) => q.isKiller);

        return (
          <div key={zone.key}>
            {/* Zone 헤더 */}
            <div
              className="flex items-center gap-3 rounded-xl px-5 py-3 mb-4"
              style={{ backgroundColor: `${zone.color}10`, border: `1.5px solid ${zone.color}30` }}
            >
              <div className="h-8 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: zone.color }} />
              <div>
                <p className="font-black text-base" style={{ color: zone.color }}>
                  문항별 정밀 진단 ({qs[0].number}번 ~ {qs[qs.length - 1].number}번): {zone.label}
                </p>
                <p className="text-xs text-gray-500">{zone.sublabel} · {qs.length}문항 · 총 {zoneTotal.toFixed(1)}점</p>
              </div>
              {hasKiller && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                  <AlertTriangle className="h-3 w-3" /> 킬러 포함
                </span>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: zone.color + "15" }}>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 whitespace-nowrap">번호</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 whitespace-nowrap">유형 (배점)</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 whitespace-nowrap">난이도</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 whitespace-nowrap">출제처</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">단원</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">필요한 사고</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">학생 당황 포인트</th>
                  </tr>
                </thead>
                <tbody>
                  {qs.map((q, i) => {
                    const globalIdx = localQs.findIndex((x) => x.id === q.id);
                    return (
                      <tr
                        key={q.id}
                        className={`border-t border-gray-100 ${q.isKiller ? "bg-red-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-black text-[#0B1F4D]">{q.number}번</span>
                          {q.isKiller && <AlertTriangle className="inline ml-1 h-3.5 w-3.5 text-red-500" />}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${q.type === "서술형" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                            {q.type}
                          </span>
                          <span className="ml-1.5 font-bold text-gray-800">{q.score}점</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><DiffBadge d={q.difficulty} /></td>
                        <td className="px-4 py-3 whitespace-nowrap"><SourceBadge s={q.source} /></td>
                        <td className="px-4 py-3 text-gray-700 text-xs max-w-[130px]">
                          <EditCell value={q.unit} rowIdx={globalIdx} col="unit" />
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs max-w-[180px]">
                          <EditCell value={q.requiredThinking} rowIdx={globalIdx} col="requiredThinking" />
                        </td>
                        <td className={`px-4 py-3 text-xs max-w-[180px] ${q.isKiller ? "text-red-700 font-medium" : "text-gray-600"}`}>
                          <EditCell value={q.studentPanicReason} rowIdx={globalIdx} col="studentPanicReason" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Zone 설명 */}
            <div
              className="mt-3 rounded-xl px-4 py-3 text-xs font-medium italic"
              style={{ backgroundColor: `${zone.color}08`, color: zone.color }}
            >
              * {zone.key === "basic"
                ? "초반부는 교과서 중심의 평이한 난이도(하~중)로 구성되어 기본기 점검 및 점수 확보에 주력하는 구간입니다."
                : zone.key === "standard"
                ? "중반부 변별 문항(중상~상) 및 고배점 서술형에 '학교 프린트'가 집중적으로 배치되어 있습니다."
                : "후반 킬러 문항은 외부가 아닌 '학교 프린트'에 숨어 있었습니다. 프린트 완벽 마스터가 1등급의 보증수표입니다."}
            </div>
          </div>
        );
      })}
    </div>
  );
}
