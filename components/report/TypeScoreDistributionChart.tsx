"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ExamAnalysis } from "@/lib/types";
import EditableText from "@/components/ui/EditableText";

interface Props {
  analysis: ExamAnalysis;
  onUpdate?: React.Dispatch<React.SetStateAction<ExamAnalysis>>;
}

export default function TypeScoreDistributionChart({ analysis, onUpdate }: Props) {
  const ov = analysis.overrides ?? {};
  const setText = (key: string, val: string) =>
    onUpdate?.((prev) => ({ ...prev, overrides: { ...(prev.overrides ?? {}), [key]: val } }));
  const data = analysis.typeScoreDistribution.filter((d) => d.score > 0);
  const colors = ["#0B1F4D", "#F97316"];

  const hasDescriptive = analysis.descriptiveCount > 0;
  const descriptiveRatio = analysis.typeScoreDistribution.find((d) => d.type === "서술형")?.percentage ?? 0;

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="type" tick={{ fill: "#374151", fontWeight: 600, fontSize: 14 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}점`} />
          <Tooltip
            formatter={(value: number) => [`${value}점`, "배점"]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#0B1F4D]/5 border border-[#0B1F4D]/10 p-4 text-center">
          <EditableText value={ov.type_obj_label ?? "객관식 총점"} onChange={(v) => setText("type_obj_label", v)}
            styleKey="type_obj_label" className="text-xs text-gray-500 block mb-1" defaultSize="xs" />
          <EditableText value={ov.type_obj_score ?? `${analysis.typeScoreDistribution.find((d) => d.type === "객관식")?.score ?? 0}점`}
            onChange={(v) => setText("type_obj_score", v)} styleKey="type_obj_score" className="text-2xl font-bold text-[#0B1F4D] block" defaultSize="2xl" />
          <EditableText value={ov.type_obj_count ?? `${analysis.objectiveCount}문항`}
            onChange={(v) => setText("type_obj_count", v)} styleKey="type_obj_count" className="text-xs text-gray-400 block mt-1" defaultSize="xs" />
        </div>
        <div className="rounded-xl bg-[#F97316]/5 border border-[#F97316]/10 p-4 text-center">
          <EditableText value={ov.type_desc_label ?? "서술형 총점"} onChange={(v) => setText("type_desc_label", v)}
            styleKey="type_desc_label" className="text-xs text-gray-500 block mb-1" defaultSize="xs" />
          <EditableText value={ov.type_desc_score ?? `${analysis.typeScoreDistribution.find((d) => d.type === "서술형")?.score ?? 0}점`}
            onChange={(v) => setText("type_desc_score", v)} styleKey="type_desc_score" className="text-2xl font-bold text-[#F97316] block" defaultSize="2xl" />
          <EditableText value={ov.type_desc_count ?? `${analysis.descriptiveCount}문항`}
            onChange={(v) => setText("type_desc_count", v)} styleKey="type_desc_count" className="text-xs text-gray-400 block mt-1" defaultSize="xs" />
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <EditableText
          styleKey="type_insight"
          value={ov.type_insight ?? (hasDescriptive
            ? `서술형 배점이 총점의 ${descriptiveRatio.toFixed(1)}%를 차지합니다. 서술형 답안 작성 전략과 감점 방어 훈련이 필수적입니다.`
            : "이 시험은 전 문항이 객관식으로 구성되어 있습니다. 실수 없는 마킹 전략과 정확한 계산이 핵심입니다.")}
          onChange={(v) => setText("type_insight", v)}
          multiline defaultSize="sm" className="text-sm text-amber-800 leading-relaxed"
        />
      </div>
    </div>
  );
}
