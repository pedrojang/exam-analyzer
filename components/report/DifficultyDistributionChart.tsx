"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: React.Dispatch<React.SetStateAction<ExamAnalysis>>;
}

export default function DifficultyDistributionChart({ analysis, onUpdate }: Props) {
  const ov = analysis.overrides ?? {};
  const setText = (key: string, val: string) =>
    onUpdate?.((prev) => ({ ...prev, overrides: { ...(prev.overrides ?? {}), [key]: val } }));
  const data = analysis.difficultyDistribution.map((d) => ({
    ...d,
    fill: DIFFICULTY_COLORS[d.difficulty],
  }));

  const hardCount = data.filter((d) => d.difficulty === "상" || d.difficulty === "최상").reduce((s, d) => s + d.count, 0);
  const hardPct = ((hardCount / analysis.totalQuestions) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="difficulty"
            tick={{ fill: "#374151", fontWeight: 600, fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}문항`}
          />
          <Tooltip
            formatter={(value: number, _: string, entry: { payload?: { difficulty: string } }) => [
              `${value}문항`,
              entry?.payload?.difficulty ?? "난이도",
            ]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={80}>
            <LabelList dataKey="count" position="top" style={{ fontSize: 13, fontWeight: 700 }} />
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-3">
        {data.map((d) => (
          <div
            key={d.difficulty}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
            style={{ backgroundColor: `${d.fill}20`, color: d.fill, border: `1px solid ${d.fill}40` }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.fill }}
            />
            {d.difficulty}: {d.count}문항 ({d.percentage.toFixed(1)}%)
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
        <EditableText
          styleKey="diff_insight"
          value={ov.diff_insight ?? `난이도 '상' 이상 문항이 전체의 ${hardPct}%(${hardCount}문항)를 차지합니다.${Number(hardPct) >= 30 ? " 이는 상위권 학생도 까다롭게 느낄 수준으로, 중위권 이하 학생의 체감 난이도는 상당히 높았을 것입니다." : " 전반적으로 중간 난이도 문항이 많아, 기초가 탄탄한 학생이라면 고득점을 노릴 수 있는 구조입니다."}`}
          onChange={(v) => setText("diff_insight", v)}
          multiline defaultSize="sm" className="text-sm text-gray-700 leading-relaxed"
        />
      </div>
    </div>
  );
}
