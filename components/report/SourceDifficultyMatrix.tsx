"use client";
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from "recharts";
import type { ExamAnalysis } from "@/lib/types";
import { getDifficultyNumeric, getSourceNumeric } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: (updated: ExamAnalysis) => void;
}

const SOURCE_LABELS: Record<number, string> = {
  0: "미확인",
  1: "교과서",
  2: "변형 문항",
  3: "외부 문항",
  4: "학교 프린트",
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "하",
  2: "중",
  3: "중상",
  4: "상",
  5: "최상",
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { questionNumber: number; xLabel: string; yLabel: string; difficulty: string; isKiller: boolean } }[];
}) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="font-bold text-[#0B1F4D]">{d.questionNumber}번 문항</p>
      <p className="text-sm text-gray-600">출처: {d.xLabel}</p>
      <p className="text-sm text-gray-600">난이도: {d.yLabel}</p>
      {d.isKiller && (
        <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
          킬러 문항
        </span>
      )}
    </div>
  );
};

const CustomDot = (props: {
  cx?: number; cy?: number;
  payload?: { questionNumber: number; difficulty: string; isKiller: boolean };
}) => {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload) return null;
  const color = DIFFICULTY_COLORS[payload.difficulty as keyof typeof DIFFICULTY_COLORS] ?? "#6B7280";
  return (
    <g>
      <circle cx={cx} cy={cy} r={payload.isKiller ? 18 : 14} fill={color} fillOpacity={payload.isKiller ? 0.25 : 0.15} stroke={color} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={payload.isKiller ? 9 : 7} fill={color} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={9} fontWeight={700}>
        {payload.questionNumber}
      </text>
      {payload.isKiller && (
        <text x={cx} y={cy - 24} textAnchor="middle" fill="#DC2626" fontSize={9} fontWeight={700}>
          킬러
        </text>
      )}
    </g>
  );
};

export default function SourceDifficultyMatrix({ analysis, onUpdate }: Props) {
  const ov = analysis.overrides ?? {};
  const setText = (key: string, val: string) =>
    onUpdate?.({ ...analysis, overrides: { ...ov, [key]: val } });

  const points = analysis.questions.map((q) => ({
    x: getSourceNumeric(q.source),
    y: getDifficultyNumeric(q.difficulty),
    questionNumber: q.number,
    xLabel: q.source,
    yLabel: q.difficulty,
    difficulty: q.difficulty,
    isKiller: q.isKiller,
  }));

  const schoolPrintHighDiff = points.filter((p) => p.xLabel === "학교 프린트" && (p.yLabel === "상" || p.yLabel === "최상"));

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <EditableText value={ov.matrix_axis_desc ?? "x축: 출제 출처 / y축: 난이도 / 원 크기 = 킬러 문항 여부"}
          onChange={(v) => setText("matrix_axis_desc", v)}
          className="text-sm text-gray-500" defaultSize="sm" />
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0.5, 4.5]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(v) => SOURCE_LABELS[v] ?? ""}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => DIFFICULTY_LABELS[v] ?? ""}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <ZAxis range={[200, 200]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={points} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>

      {schoolPrintHighDiff.length > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex gap-1.5">
          <EditableText value={ov.matrix_insight_label ?? "⚠️ 주목:"} onChange={(v) => setText("matrix_insight_label", v)}
            className="text-sm font-bold text-red-800 flex-shrink-0" defaultSize="sm" />
          <EditableText
            value={ov.matrix_insight_body ?? `학교 프린트 출처의 고난도 문항이 ${schoolPrintHighDiff.length}문항 집중되어 있습니다. (${schoolPrintHighDiff.map((p) => `${p.questionNumber}번`).join(", ")}) 학교 프린트 완벽 숙지가 고득점의 핵심입니다.`}
            onChange={(v) => setText("matrix_insight_body", v)}
            multiline defaultSize="sm" className="text-sm text-red-800 leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
