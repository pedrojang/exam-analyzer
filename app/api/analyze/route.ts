import { NextRequest, NextResponse } from "next/server";
import { createMockFromMetadata } from "@/lib/mockData";
import { generateId } from "@/lib/utils";
import type { ExamAnalysis } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// GPT 분석 프롬프트
// ─────────────────────────────────────────────────────────────────────────────
const buildAnalysisPrompt = (metadata: {
  schoolName: string;
  grade: string;
  subject: string;
  examName: string;
  examDuration: number;
  totalScore: number;
  totalQuestions: number;
  analysisMode: string;
}) => `
당신은 전문 시험 분석가입니다. 다음 시험지 이미지/텍스트를 분석하여 JSON 형태의 상세 분석 결과를 반환하세요.

시험 메타데이터:
- 학교명: ${metadata.schoolName}
- 학년: ${metadata.grade}
- 과목: ${metadata.subject}
- 시험명: ${metadata.examName}
- 시험 시간: ${metadata.examDuration}분
- 총점: ${metadata.totalScore}점
- 문항 수: ${metadata.totalQuestions}문항
- 분석 톤: ${metadata.analysisMode}

분석 지시사항:
1. PDF는 시험지 스캔본입니다. 전체 문항 수를 먼저 추정하세요.
2. 각 문항별로 다음을 추출하세요:
   - 문항 번호
   - 객관식/서술형/단답형 여부
   - 배점
   - 출제 단원
   - 난이도 (하/중/중상/상/최상)
   - 출제 출처 추정 (교과서/학교 프린트/외부 문항/변형 문항/미확인)
   - 해결에 필요한 핵심 개념
   - 학생이 막힐 가능성이 높은 지점
   - 킬러 문항 여부 (배점이 높고 고난도인 변별 문항)

3. 전체 시험에 대해 다음을 분석하세요:
   - 전반 난이도 (하/중/중상/상/최상)
   - 체감 난이도 (서술형 표현)
   - 단원별 배점 비율
   - 객관식/서술형 배점 비율
   - 난이도별 문항 수 비율
   - 1번~마지막 문항 난이도 흐름 (1~5점 척도)
   - 상위권/중위권/하위권별 체감 차이
   - 기말 대비 전략 3~5가지

반환 형식은 반드시 다음 JSON 스키마를 따르세요:
{
  "title": "string",
  "schoolName": "string",
  "grade": "string",
  "subject": "string",
  "examName": "string",
  "totalScore": number,
  "totalQuestions": number,
  "objectiveCount": number,
  "descriptiveCount": number,
  "overallDifficulty": "하|중|중상|상|최상",
  "perceivedDifficulty": "string",
  "executiveSummary": ["string", "string", "string"],
  "questions": [
    {
      "number": number,
      "type": "객관식|서술형|단답형",
      "score": number,
      "unit": "string",
      "difficulty": "하|중|중상|상|최상",
      "source": "교과서|학교 프린트|외부 문항|변형 문항|미확인",
      "requiredThinking": "string",
      "likelyTrap": "string",
      "studentPanicReason": "string",
      "isKiller": boolean
    }
  ],
  "unitDistribution": [{ "unit": "string", "score": number, "questionCount": number, "percentage": number }],
  "typeScoreDistribution": [{ "type": "string", "score": number, "percentage": number }],
  "difficultyDistribution": [{ "difficulty": "string", "count": number, "percentage": number }],
  "flowData": [{ "questionNumber": number, "difficultyScore": number, "timePressure": number, "zone": "basic|standard|pressure|killer" }],
  "killerSummary": {
    "killerQuestionNumbers": [number],
    "totalKillerScore": number,
    "maxScoreIfMissed": number,
    "message": "string"
  },
  "finalStrategy": ["string"]
}
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const metadataRaw = formData.get("metadata") as string;
    const metadata = JSON.parse(metadataRaw);

    const id = generateId();

    // ─────────────────────────────────────────────────────────────────────────
    // 실제 GPT API 연동 방식 (OPENAI_API_KEY 환경변수가 있을 때 활성화)
    // ─────────────────────────────────────────────────────────────────────────
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";

    if (OPENAI_API_KEY && file) {
      /*
       * 실제 구현 흐름:
       *
       * 1. PDF를 페이지별 이미지로 변환 (pdf2pic, pdfjs 등 사용)
       *    const images = await convertPdfToImages(file);
       *
       * 2. 각 이미지를 base64로 인코딩
       *    const base64Images = images.map(img => img.toString('base64'));
       *
       * 3. GPT-4 Vision API에 이미지 + 프롬프트 전달
       *    const response = await fetch("https://api.openai.com/v1/chat/completions", {
       *      method: "POST",
       *      headers: {
       *        "Content-Type": "application/json",
       *        "Authorization": `Bearer ${OPENAI_API_KEY}`,
       *      },
       *      body: JSON.stringify({
       *        model: OPENAI_MODEL,
       *        messages: [
       *          {
       *            role: "user",
       *            content: [
       *              { type: "text", text: buildAnalysisPrompt(metadata) },
       *              ...base64Images.map(img => ({
       *                type: "image_url",
       *                image_url: { url: `data:image/jpeg;base64,${img}` }
       *              }))
       *            ]
       *          }
       *        ],
       *        response_format: { type: "json_object" },
       *        max_tokens: 4096,
       *      }),
       *    });
       *
       * 4. JSON 파싱 후 ExamAnalysis 타입으로 변환
       *    const data = await response.json();
       *    const analysisData = JSON.parse(data.choices[0].message.content);
       *
       * 5. id, createdAt, updatedAt 추가 후 반환
       */

      // Placeholder — uncomment above and implement when ready
      console.log(`OPENAI_API_KEY 감지됨. 모델: ${OPENAI_MODEL}`);
      console.log("분석 프롬프트:", buildAnalysisPrompt(metadata));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 데모 모드: Mock 데이터 반환
    // ─────────────────────────────────────────────────────────────────────────
    const mockAnalysis: ExamAnalysis = createMockFromMetadata(metadata, id);

    return NextResponse.json(mockAnalysis, { status: 200 });
  } catch (error) {
    console.error("분석 API 오류:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "시험지 분석 API가 정상 동작 중입니다.",
    mode: process.env.OPENAI_API_KEY ? "GPT API 모드" : "Mock 데이터 모드",
    model: process.env.OPENAI_MODEL ?? "gpt-4o (기본값)",
  });
}
