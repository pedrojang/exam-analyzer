"use client";
import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X, ChevronLeft, Settings2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalysisProgress from "@/components/AnalysisProgress";
import { generateId } from "@/lib/utils";
import { createMockFromMetadata } from "@/lib/mockData";
import { saveNewReport } from "@/lib/storage";
import type { AnalysisMode } from "@/lib/types";

const GRADE_OPTIONS = [
  { value: "1학년", label: "1학년" },
  { value: "2학년", label: "2학년" },
  { value: "3학년", label: "3학년" },
];

const SUBJECT_OPTIONS = [
  { value: "수학", label: "수학" },
  { value: "영어", label: "영어" },
  { value: "국어", label: "국어" },
  { value: "과학", label: "과학" },
  { value: "사회", label: "사회" },
  { value: "물리학", label: "물리학" },
  { value: "화학", label: "화학" },
];

const MODE_OPTIONS: { value: AnalysisMode; label: string }[] = [
  { value: "블로그 홍보형", label: "블로그 홍보형 — 학원 SNS / 블로그 업로드용" },
  { value: "학부모 설명형", label: "학부모 설명형 — 학부모 상담 자료용" },
  { value: "내부 진단형", label: "내부 진단형 — 교사 내부 보고용" },
];

export default function UploadScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [metadata, setMetadata] = useState({
    schoolName: "",
    grade: "1학년",
    subject: "수학",
    examName: "1학기 중간고사",
    examDuration: 50,
    totalScore: 100,
    totalQuestions: 21,
    analysisMode: "블로그 홍보형" as AnalysisMode,
  });

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      alert("PDF 파일만 업로드할 수 있습니다.");
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleAnalyze = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = useCallback(() => {
    const id = generateId();
    const analysis = createMockFromMetadata(metadata, id);
    saveNewReport(analysis);
    router.push(`/report/${id}`);
  }, [metadata, router]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0B1F4D] flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{metadata.schoolName || "학교명 미입력"} · {metadata.grade} · {metadata.subject}</p>
              <p className="text-sm font-bold text-[#0B1F4D]">{metadata.examName}</p>
            </div>
          </div>
          <AnalysisProgress onComplete={handleAnalysisComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-xl">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-[#0B1F4D]">새 시험지 분석</h1>
            <p className="text-sm text-gray-500">PDF 업로드 후 분석을 시작하세요</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Upload Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#0B1F4D]" />
                시험지 PDF 업로드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer ${
                  dragOver
                    ? "border-[#F97316] bg-orange-50"
                    : file
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-[#0B1F4D] hover:bg-gray-50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                {file ? (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                      <FileText className="h-7 w-7 text-green-600" />
                    </div>
                    <p className="font-bold text-green-700">{file.name}</p>
                    <p className="text-sm text-green-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    <button
                      className="mt-3 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    >
                      <X className="h-3.5 w-3.5" /> 다른 파일 선택
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-700 mb-1">
                      시험지 PDF를 여기에 끌어다 놓거나 클릭하여 업로드하세요
                    </p>
                    <p className="text-sm text-gray-400">PDF 형식만 지원 · 최대 50MB</p>
                    <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2">
                      <p className="text-xs text-amber-700">
                        💡 데모 모드: 파일 없이도 분석을 시작할 수 있습니다
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-[#0B1F4D]" />
                분석 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">학교명</label>
                  <Input
                    placeholder="예: 동패고등학교"
                    value={metadata.schoolName}
                    onChange={(e) => setMetadata((p) => ({ ...p, schoolName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">학년</label>
                  <Select
                    options={GRADE_OPTIONS}
                    value={metadata.grade}
                    onChange={(e) => setMetadata((p) => ({ ...p, grade: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">과목</label>
                  <Select
                    options={SUBJECT_OPTIONS}
                    value={metadata.subject}
                    onChange={(e) => setMetadata((p) => ({ ...p, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">시험명</label>
                  <Input
                    placeholder="예: 1학기 중간고사"
                    value={metadata.examName}
                    onChange={(e) => setMetadata((p) => ({ ...p, examName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">시험 시간 (분)</label>
                  <Input
                    type="number"
                    min={10}
                    max={180}
                    value={metadata.examDuration}
                    onChange={(e) => setMetadata((p) => ({ ...p, examDuration: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">총점</label>
                  <Input
                    type="number"
                    min={10}
                    max={200}
                    value={metadata.totalScore}
                    onChange={(e) => setMetadata((p) => ({ ...p, totalScore: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">문항 수</label>
                  <Input
                    type="number"
                    min={5}
                    max={50}
                    value={metadata.totalQuestions}
                    onChange={(e) => setMetadata((p) => ({ ...p, totalQuestions: Number(e.target.value) }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">분석 톤</label>
                  <Select
                    options={MODE_OPTIONS}
                    value={metadata.analysisMode}
                    onChange={(e) => setMetadata((p) => ({ ...p, analysisMode: e.target.value as AnalysisMode }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="navy"
            size="lg"
            className="w-full h-14 text-base font-bold rounded-2xl shadow-lg hover:shadow-xl"
            onClick={handleAnalyze}
          >
            <Zap className="h-5 w-5" />
            분석 시작
          </Button>
        </div>
      </div>
    </div>
  );
}
