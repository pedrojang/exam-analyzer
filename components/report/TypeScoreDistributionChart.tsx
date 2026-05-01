"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ExamAnalysis } from "@/lib/types";

interface Props {
  analysis: ExamAnalysis;
}

export default function TypeScoreDistributionChart({ analysis }: Props) {
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
          <p className="text-xs text-gray-500 mb-1">객관식 총점</p>
          <p className="text-2xl font-bold text-[#0B1F4D]">{analysis.typeScoreDistribution.find((d) => d.type === "객관식")?.score ?? 0}점</p>
          <p className="text-xs text-gray-400 mt-1">{analysis.objectiveCount}문항</p>
        </div>
        <div className="rounded-xl bg-[#F97316]/5 border border-[#F97316]/10 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">서술형 총점</p>
          <p className="text-2xl font-bold text-[#F97316]">{analysis.typeScoreDistribution.find((d) => d.type === "서술형")?.score ?? 0}점</p>
          <p className="text-xs text-gray-400 mt-1">{analysis.descriptiveCount}문항</p>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm text-amber-800 leading-relaxed">
          {hasDescriptive
            ? `서술형 배점이 총점의 ${descriptiveRatio.toFixed(1)}%를 차지합니다. 서술형 답안 작성 전략과 감점 방어 훈련이 필수적입니다.`
            : "이 시험은 전 문항이 객관식으로 구성되어 있습니다. 실수 없는 마킹 전략과 정확한 계산이 핵심입니다."}
        </p>
      </div>
    </div>
  );
}
