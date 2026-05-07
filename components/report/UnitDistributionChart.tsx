"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ExamAnalysis } from "@/lib/types";

const COLORS = ["#0B1F4D", "#F97316", "#3B82F6", "#22C55E", "#A855F7", "#EAB308", "#EC4899"];

interface Props {
  analysis: ExamAnalysis;
}

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name,
}: {
  cx: number; cy: number; midAngle: number; innerRadius: number;
  outerRadius: number; percent: number; name: string;
}) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function UnitDistributionChart({ analysis }: Props) {
  const data = analysis.unitDistribution.map((u) => ({
    name: u.unit,
    value: u.score,
    count: u.questionCount,
    percentage: u.percentage,
  }));

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            innerRadius={52}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}점`, name]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
          />
          <Legend
            formatter={(value: string) => <span className="text-sm text-gray-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.map((item, i) => (
          <div
            key={item.name}
            className="rounded-lg p-3 border border-gray-100"
            style={{ borderLeftColor: COLORS[i % COLORS.length], borderLeftWidth: 4 }}
          >
            <p className="text-xs text-gray-500 mb-1">{item.name}</p>
            <p className="text-lg font-bold" style={{ color: COLORS[i % COLORS.length] }}>
              {item.percentage.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">{item.count}문항 · {item.value}점</p>
          </div>
        ))}
      </div>
    </div>
  );
}
