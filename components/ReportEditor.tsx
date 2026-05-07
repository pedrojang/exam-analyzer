"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { ChevronLeft, Save, Copy, Download, Image, Plus, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import DocumentSidebar from "@/components/editor/DocumentSidebar";
import MobilePreviewModal from "@/components/editor/MobilePreviewModal";
import EditableBlock from "@/components/editor/EditableBlock";
import RightPropertyPanel from "@/components/editor/RightPropertyPanel";

import ReportHero from "@/components/report/ReportHero";
import ExecutiveSummaryCards from "@/components/report/ExecutiveSummaryCards";
import UnitDistributionChart from "@/components/report/UnitDistributionChart";
import TypeScoreDistributionChart from "@/components/report/TypeScoreDistributionChart";
import DifficultyDistributionChart from "@/components/report/DifficultyDistributionChart";
import ExamFlowChart from "@/components/report/ExamFlowChart";
import SourceDifficultyMatrix from "@/components/report/SourceDifficultyMatrix";
import QuestionDiagnosisTable from "@/components/report/QuestionDiagnosisTable";
import KillerQuestionSummary from "@/components/report/KillerQuestionSummary";
import KillerQuestionDeepDive from "@/components/report/KillerQuestionDeepDive";
import FinalStrategySection from "@/components/report/FinalStrategySection";

import { StyleContext, type TextStyleData } from "@/components/ui/EditableText";
import type { ExamAnalysis, ReportSection, SectionType } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";
import { analysisToMarkdown, copyToClipboard } from "@/lib/utils";
import { saveReport } from "@/lib/storage";

const DEFAULT_SECTIONS: Omit<ReportSection, "id">[] = [
  { type: "hero", title: "표지 / 제목", visible: true, order: 0 },
  { type: "executive_summary", title: "총평 및 핵심 인사이트", visible: true, order: 1 },
  { type: "unit_distribution", title: "단원별 출제 비중", visible: true, order: 2 },
  { type: "type_distribution", title: "서술형/객관식 배점 비율", visible: true, order: 3 },
  { type: "difficulty_distribution", title: "난이도별 문항 수", visible: true, order: 4 },
  { type: "exam_flow", title: "시험 흐름 그래프", visible: true, order: 5 },
  { type: "source_matrix", title: "출처-난이도 매트릭스", visible: true, order: 6 },
  { type: "question_diagnosis", title: "문항별 정밀 진단", visible: true, order: 7 },
  { type: "killer_summary", title: "킬러 문항 요약", visible: true, order: 8 },
  { type: "killer_deepdive", title: "킬러 문항 심층 분석", visible: true, order: 9 },
  { type: "final_strategy", title: "최종 처방 / 기말 대비 전략", visible: true, order: 10 },
];

interface Props {
  analysis: ExamAnalysis;
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="h-8 w-1.5 rounded-full bg-[#F97316]" />
      <h2 className="text-3xl font-black text-[#0B1F4D]">{title}</h2>
    </div>
  );
}

export default function ReportEditor({ analysis: initialAnalysis }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<ExamAnalysis>(initialAnalysis);
  const [sections, setSections] = useState<ReportSection[]>(
    DEFAULT_SECTIONS.map((s, i) => ({ ...s, id: `section-${i}` }))
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [styleRevision, setStyleRevision] = useState(0);
  const isFirstRender = React.useRef(true);

  // 텍스트 변경 시 2초 디바운스 자동저장
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const timer = setTimeout(() => {
      saveReport(analysis);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [analysis]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const visibleSections = sortedSections.filter((s) => s.visible);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      return reordered.map((s, i) => ({ ...s, order: i }));
    });
  };

  const toggleVisibility = (id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const updateTitle = (id: string, title: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  };

  const handleSave = () => {
    saveReport(analysis);
    setIsSaved(true);
    toast("리포트가 저장되었습니다.", "success");
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = async () => {
    const md = analysisToMarkdown(analysis);
    await copyToClipboard(md);
    toast("블로그 글이 마크다운 형식으로 복사되었습니다.", "success");
  };

  const handleExportPDF = () => {
    toast("PDF 내보내기 기능은 추후 연결 예정입니다.", "info");
  };

  const handleExportImage = () => {
    toast("이미지 저장 기능은 추후 연결 예정입니다.", "info");
  };

  const handleAiRewrite = (mode: "blog" | "parent" | "internal") => {
    const labels = { blog: "블로그 홍보형", parent: "학부모 설명형", internal: "내부 진단형" };
    toast(`"${labels[mode]}" 톤으로 재작성하려면 OPENAI_API_KEY를 설정하세요.`, "info");
  };

  const addSection = () => {
    const newSection: ReportSection = {
      id: `section-custom-${Date.now()}`,
      type: "executive_summary",
      title: "새 섹션",
      visible: true,
      order: sections.length,
    };
    setSections((prev) => [...prev, newSection]);
  };

  const selectedSection = sections.find((s) => s.id === activeId) ?? null;

  const getStyle = useCallback((key: string): TextStyleData | undefined => {
    const raw = analysis.overrides?.[`__s_${key}`];
    if (!raw) return undefined;
    try { return JSON.parse(raw) as TextStyleData; } catch { return undefined; }
  }, [analysis.overrides]);

  const setStyle = useCallback((key: string, style: TextStyleData) => {
    setAnalysis((prev) => ({
      ...prev,
      overrides: { ...(prev.overrides ?? {}), [`__s_${key}`]: JSON.stringify(style) },
    }));
    setStyleRevision((r) => r + 1);
  }, []);

  const renderSectionContent = (section: ReportSection, isPreview = false) => {
    const sc = analysis.sectionConfig?.[section.type as SectionType];
    switch (section.type as SectionType) {
      case "hero": return <ReportHero analysis={analysis} onUpdate={setAnalysis} sectionConfig={sc} />;
      case "executive_summary": return <><SectionTitle title={section.title} /><ExecutiveSummaryCards analysis={analysis} onUpdate={setAnalysis} sectionConfig={sc} /></>;
      case "unit_distribution": return <><SectionTitle title={section.title} /><UnitDistributionChart analysis={analysis} /></>;
      case "type_distribution": return <><SectionTitle title={section.title} /><TypeScoreDistributionChart analysis={analysis} onUpdate={setAnalysis} /></>;
      case "difficulty_distribution": return <><SectionTitle title={section.title} /><DifficultyDistributionChart analysis={analysis} onUpdate={setAnalysis} /></>;
      case "exam_flow": return <><SectionTitle title={section.title} /><ExamFlowChart analysis={analysis} onUpdate={setAnalysis} /></>;
      case "source_matrix": return <><SectionTitle title={section.title} /><SourceDifficultyMatrix analysis={analysis} onUpdate={setAnalysis} /></>;
      case "question_diagnosis": return <><SectionTitle title={section.title} /><QuestionDiagnosisTable analysis={analysis} onUpdate={setAnalysis} editable={!isPreview} sectionConfig={sc} /></>;
      case "killer_summary": return <><SectionTitle title={section.title} /><KillerQuestionSummary analysis={analysis} onUpdate={setAnalysis} sectionConfig={sc} /></>;
      case "killer_deepdive": return <><SectionTitle title={section.title} /><KillerQuestionDeepDive analysis={analysis} onUpdate={setAnalysis} /></>;
      case "final_strategy": return <><SectionTitle title={section.title} /><FinalStrategySection analysis={analysis} onUpdate={setAnalysis} sectionConfig={sc} /></>;
      default: return <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 text-sm text-gray-500">섹션 내용을 여기에 추가하세요.</div>;
    }
  };

  return (
    <StyleContext.Provider value={{ getStyle, setStyle, readOnly: false }}>
    <div className="flex h-screen flex-col overflow-hidden bg-[#F8FAFC]">
      {/* Top Bar */}
      <header className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-xl">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">{analysis.schoolName} · {analysis.grade} · {analysis.subject}</p>
            <p className="text-sm font-bold text-[#0B1F4D] truncate max-w-xs md:max-w-md">{analysis.examName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setMobilePreview(true)} className="gap-1.5 text-xs hidden md:flex">
            <Smartphone className="h-3.5 w-3.5" /> 모바일 미리보기
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs hidden md:flex">
            <Copy className="h-3.5 w-3.5" /> 블로그 글 복사
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportImage} className="gap-1.5 text-xs hidden md:flex">
            <Image className="h-3.5 w-3.5" /> 이미지 저장
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> PDF 내보내기
          </Button>
          <Button variant={isSaved ? "secondary" : "navy"} size="sm" onClick={handleSave} className="gap-1.5 text-xs">
            <Save className="h-3.5 w-3.5" /> {isSaved ? "저장됨" : "저장"}
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <DocumentSidebar
          sections={sections}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setPanelOpen(true); }}
          onToggleVisibility={toggleVisibility}
        />

        {/* Main Content — 콘텐츠 너비 380px, 모바일 미리보기와 동일 */}
        <main className="flex-1 overflow-y-auto bg-[#E8ECF0]">
          <div className="mx-auto py-8 space-y-4" style={{ width: "min(456px, 100%)", padding: "2rem 20px" }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={visibleSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {visibleSections.map((section) => (
                  <EditableBlock
                    key={section.id}
                    section={section}
                    isSelected={activeId === section.id}
                    onSelect={() => { setActiveId(section.id); setPanelOpen(true); }}
                    onDelete={deleteSection}
                    onToggleVisibility={toggleVisibility}
                  >
                    {renderSectionContent(section)}
                  </EditableBlock>
                ))}
              </SortableContext>
            </DndContext>

            <button
              onClick={addSection}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 py-5 text-sm font-medium text-gray-400 hover:border-[#0B1F4D] hover:text-[#0B1F4D] hover:bg-[#0B1F4D]/3 transition-all"
            >
              <Plus className="h-4 w-4" />
              섹션 추가
            </button>
          </div>
        </main>

        {/* Right Panel — absolute 오버레이, 콘텐츠 너비에 영향 없음 */}
        {panelOpen && (
          <div className="absolute right-0 top-0 bottom-0 z-30 shadow-2xl">
            <RightPropertyPanel
              section={selectedSection}
              analysis={analysis}
              onUpdate={setAnalysis}
              onClose={() => setPanelOpen(false)}
              onTitleChange={updateTitle}
              onAiRewrite={handleAiRewrite}
            />
          </div>
        )}
      </div>

      {/* 모바일 미리보기 모달 */}
      {mobilePreview && (
        <MobilePreviewModal onClose={() => setMobilePreview(false)}>
          <StyleContext.Provider value={{ getStyle, setStyle, readOnly: true, overrides: analysis.overrides }}>
            <div key={styleRevision}>
            {visibleSections.map((section) => (
              <div key={section.id}>
                {section.type !== "hero" && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-1 rounded-full bg-[#F97316]" />
                    <h2 className="text-base font-black text-[#0B1F4D]">{section.title}</h2>
                  </div>
                )}
                {renderSectionContent(section, true)}
              </div>
            ))}
            </div>
          </StyleContext.Provider>
        </MobilePreviewModal>
      )}
    </div>
    </StyleContext.Provider>
  );
}
