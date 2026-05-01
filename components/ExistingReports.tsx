"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Calendar, ChevronRight, ChevronLeft, GraduationCap, Hash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { loadReports, deleteReport } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import type { ExamAnalysis } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/types";
import { ALL_MOCK_DATA } from "@/lib/mockData";

export default function ExistingReports() {
  const router = useRouter();
  const [reports, setReports] = useState<ExamAnalysis[]>([]);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  useEffect(() => {
    setReports(loadReports());
  }, []);

  const filtered = reports.filter((r) => {
    const matchSearch =
      !search ||
      r.schoolName.includes(search) ||
      r.subject.includes(search) ||
      r.examName.includes(search) ||
      r.grade.includes(search);
    const matchSubject = !filterSubject || r.subject === filterSubject;
    const matchGrade = !filterGrade || r.grade === filterGrade;
    return matchSearch && matchSubject && matchGrade;
  });

  const subjects = Array.from(new Set(reports.map((r) => r.subject)));
  const grades = Array.from(new Set(reports.map((r) => r.grade)));

  const isMock = (id: string) => ALL_MOCK_DATA.some((m) => m.id === id);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMock(id)) {
      alert("기본 샘플 리포트는 삭제할 수 없습니다.");
      return;
    }
    if (confirm("이 리포트를 삭제하시겠습니까?")) {
      deleteReport(id);
      setReports(loadReports());
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-xl">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-[#0B1F4D]">기존 분석 보기</h1>
            <p className="text-sm text-gray-500">{reports.length}개의 분석 리포트</p>
          </div>
          <Button variant="navy" onClick={() => router.push("/analyze")}>
            + 새 분석
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="학교, 과목, 시험명 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4D]"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="">전체 과목</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F4D]"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="">전체 학년</option>
            {grades.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Report Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((report) => {
              const diffColor = DIFFICULTY_COLORS[report.overallDifficulty];
              return (
                <Card
                  key={report.id}
                  className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                  onClick={() => router.push(`/report/${report.id}`)}
                >
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: diffColor }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <Badge variant="navy" className="text-[10px] px-2">
                            {report.subject}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-2">
                            {report.grade}
                          </Badge>
                          {isMock(report.id) && (
                            <Badge variant="secondary" className="text-[10px] px-2">샘플</Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-[#0B1F4D] text-sm leading-tight line-clamp-2">
                          {report.schoolName} {report.examName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!isMock(report.id) && (
                          <button
                            onClick={(e) => handleDelete(report.id, e)}
                            className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#0B1F4D] transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Hash className="h-3 w-3" />
                        <span>{report.totalQuestions}문항</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <GraduationCap className="h-3 w-3" />
                        <span>{report.totalScore}점</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: diffColor }}>
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: diffColor }} />
                        <span className="font-semibold">{report.overallDifficulty}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>생성: {formatDate(report.createdAt)}</span>
                      </div>
                      <span>수정: {formatDate(report.updatedAt)}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
