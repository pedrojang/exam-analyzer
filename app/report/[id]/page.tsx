"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReportEditor from "@/components/ReportEditor";
import { getReport } from "@/lib/storage";
import type { ExamAnalysis } from "@/lib/types";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<ExamAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getReport(id);
    setAnalysis(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0B1F4D] border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-gray-500">리포트 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <p className="text-2xl font-black text-[#0B1F4D] mb-2">리포트를 찾을 수 없습니다</p>
          <p className="text-sm text-gray-500 mb-6">ID: {id}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B1F4D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#091A42] transition-colors"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return <ReportEditor analysis={analysis} />;
}
