"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from "recharts";
import type { ExamAnalysis } from "@/lib/types";

interface Props {
  analysis: ExamAnalysis;
}

const ZONE_COLORS = {
  basic: "#22C55E",
  standard: "#3B82F6",
  pressure: "#F97316",
  killer: "#DC2626",
};

const ZONE_LABELS = {
  basic: "기본 점수 확보 구간",
  standard: "변별력 상승 구간",
  pressure: "시간 압박 구간",
  killer: "킬러 문항 구간",
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: number }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <p className="font-bold text-[#0B1F4D] mb-1">{label}번 문항</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm text-gray-600">
          {p.dataKey === "difficultyScore" ? "체감 난이도" : "시간 압박"}: {p.value.toFixed(1)} / 5
        </p>
      ))}
    </div>
  );
};

export default function ExamFlowChart({ analysis }: Props) {
  const data = analysis.flowData;

  const zones: { start: number; end: number; zone: "basic" | "standard" | "pressure" | "killer" }[] = [];
  let currentZone = data[0]?.zone;
  let zoneStart = data[0]?.questionNumber;

  data.forEach((d, i) => {
    if (d.zone !== currentZone || i === data.length - 1) {
      if (currentZone) {
        zones.push({ start: zoneStart, end: data[i - 1]?.questionNumber ?? d.questionNumber, zone: currentZone as "basic" | "standard" | "pressure" | "killer" });
      }
      currentZone = d.zone;
      zoneStart = d.questionNumber;
    }
  });

  const killerStart = data.find((d) => d.zone === "killer")?.questionNumber;
  const pressureStart = data.find((d) => d.zone === "pressure")?.questionNumber;

  const autoInterpretation = killerStart
    ? `${pressureStart}번 이후부터 난이도가 급격히 상승하며, ${killerStart}번 이후 구간에서 시간 압박과 사고 부담이 동시에 증가했을 가능성이 높습니다.`
    : "전 구간에 걸쳐 점진적인 난이도 상승이 나타납니다.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 mb-2">
        {Object.entries(ZONE_LABELS).map(([zone, label]) => (
          <div key={zone} className="flex items-center gap-1.5 text-xs font-medium">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: ZONE_COLORS[zone as keyof typeof ZONE_COLORS] + "40", border: `1px solid ${ZONE_COLORS[zone as keyof typeof ZONE_COLORS]}` }}
            />
            {label}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="diffGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0B1F4D" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0B1F4D" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="questionNumber"
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            label={{ value: "문항 번호", position: "insideBottom", offset: -5, fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis
            domain={[0, 5.5]}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => ["", "하", "중", "중상", "상", "최상"][v] ?? v}
          />
          <Tooltip content={<CustomTooltip />} />

          {zones.map((z) => (
            <ReferenceArea
              key={`${z.zone}-${z.start}`}
              x1={z.start}
              x2={z.end}
              fill={ZONE_COLORS[z.zone]}
              fillOpacity={0.08}
            />
          ))}

          {data.filter((d) => d.label).map((d) => (
            <ReferenceLine
              key={d.questionNumber}
              x={d.questionNumber}
              stroke={ZONE_COLORS[d.zone as keyof typeof ZONE_COLORS] ?? "#6B7280"}
              strokeDasharray="4 4"
              label={{ value: d.label, position: "top", fill: ZONE_COLORS[d.zone as keyof typeof ZONE_COLORS] ?? "#6B7280", fontSize: 11, fontWeight: 700 }}
            />
          ))}

          <Area
            type="monotone"
            dataKey="difficultyScore"
            name="체감 난이도"
            stroke="#0B1F4D"
            strokeWidth={2.5}
            fill="url(#diffGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#0B1F4D" }}
          />
          <Area
            type="monotone"
            dataKey="timePressure"
            name="시간 압박"
            stroke="#F97316"
            strokeWidth={2}
            strokeDasharray="5 3"
            fill="url(#timeGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#F97316" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 12, fontSize: 13 }}
            formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="rounded-xl bg-[#0B1F4D]/5 border border-[#0B1F4D]/10 p-4">
        <p className="text-sm text-[#0B1F4D] leading-relaxed">
          <span className="font-bold">📊 AI 흐름 해석: </span>
          {autoInterpretation}
        </p>
      </div>
    </div>
  );
}
