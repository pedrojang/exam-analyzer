import type { ExamAnalysis } from "./types";
import { ALL_MOCK_DATA } from "./mockData";

const STORAGE_KEY = "exam-analyzer-reports";

export function loadReports(): ExamAnalysis[] {
  if (typeof window === "undefined") return ALL_MOCK_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ALL_MOCK_DATA;
    const saved: ExamAnalysis[] = JSON.parse(raw);
    return saved.length > 0 ? saved : ALL_MOCK_DATA;
  } catch {
    return ALL_MOCK_DATA;
  }
}

export function saveReport(report: ExamAnalysis): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadReports().filter((r) => !ALL_MOCK_DATA.find((m) => m.id === r.id));
    const updated = [...existing.filter((r) => r.id !== report.id), { ...report, updatedAt: new Date().toISOString() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function saveNewReport(report: ExamAnalysis): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadReports().filter((r) => !ALL_MOCK_DATA.find((m) => m.id === r.id));
    const updated = [...existing.filter((r) => r.id !== report.id), report];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function getReport(id: string): ExamAnalysis | null {
  // localStorage 저장본 우선 (편집 내용 보존)
  const saved = loadReports().find((r) => r.id === id);
  if (saved) return saved;
  return ALL_MOCK_DATA.find((m) => m.id === id) ?? null;
}

export function deleteReport(id: string): void {
  if (typeof window === "undefined") return;
  if (ALL_MOCK_DATA.find((m) => m.id === id)) return;
  try {
    const existing = loadReports().filter((r) => !ALL_MOCK_DATA.find((m) => m.id === r.id));
    const updated = existing.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function getAllSavedIds(): string[] {
  return loadReports().map((r) => r.id);
}
