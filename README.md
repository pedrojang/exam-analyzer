# 시험지 분석 리포트 생성기

GPT API 기반 시험지 자동 분석 및 블로그형 리포트 생성 웹앱 UI 데모입니다.

## 실행 방법

### ✅ 방법 1 — 실행 스크립트 (권장)

**Windows:** `start.bat` 파일을 더블클릭
> 패키지 자동 설치 → 서버 시작 → 브라우저 자동 열림

**macOS / Linux:**
```bash
./start.sh
```

### 방법 2 — 수동 실행

```bash
cd exam-analyzer
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 주요 기능

| 기능 | 설명 |
|------|------|
| PDF 업로드 | 드래그 앤 드롭 / 클릭 업로드 지원 |
| 분석 설정 | 학교명, 학년, 과목, 시험명, 분석 톤 설정 |
| AI 분석 진행 표시 | 단계별 Progress UI (6단계) |
| 블로그형 리포트 | 11개 섹션으로 구성된 전문 분석 리포트 |
| 5종 그래프 | 도넛/막대/라인/산점도 차트 |
| Notion식 편집 | 섹션 클릭 편집, 드래그 순서 변경, 속성 패널 |
| 블로그 복사 | 마크다운 형식으로 클립보드 복사 |
| 로컬 저장 | localStorage 기반 분석 결과 저장 |
| 분석 목록 | 검색/필터 기능이 있는 리포트 목록 |

### 리포트 섹션 구성

1. **표지 / Hero** — 시험 정보 카드 4종
2. **총평 및 핵심 인사이트** — 상/중/하위권 체감 차이, Insight 3개
3. **단원별 출제 비중** — 도넛 차트
4. **서술형/객관식 배점 비율** — 막대 차트
5. **난이도별 문항 수** — 막대 차트
6. **시험 흐름 그래프** — 라인/에리어 차트 (구간 색상 강조)
7. **출처-난이도 매트릭스** — 산점도 차트
8. **문항별 정밀 진단** — 편집 가능한 표
9. **킬러 문항 요약** — 배점 압도감 시각화
10. **킬러 문항 Deep Dive** — 아코디언 카드
11. **최종 처방 / 기말 대비 전략**

## Mock 모드 설명

`OPENAI_API_KEY` 환경변수가 없을 때 자동으로 Mock 데이터를 사용합니다.

기본 제공 샘플:
- **동패고등학교 수학** — 21문항 (객관식 19 + 서술형 2), 총점 100점
- **심학고등학교 영어** — 25문항 (전원 객관식), 총점 100점

새 분석을 실행하면 위 샘플 기반으로 메타데이터만 변경하여 새 리포트를 생성합니다.

## 실제 GPT API 연결 방법

### 1. 환경변수 설정

`.env.local.example`을 `.env.local`로 복사 후 키 입력:

```bash
cp .env.local.example .env.local
```

```env
OPENAI_API_KEY=sk-...your-key...
OPENAI_MODEL=gpt-4o  # 선택사항, 기본값: gpt-4o
```

### 2. API 라우트 활성화

`app/api/analyze/route.ts`에서 주석 처리된 GPT API 코드를 활성화하세요.

실제 연동에 필요한 패키지:
```bash
npm install openai pdf2pic
```

### 3. PDF 스캔본 분석 시 OCR/Vision API 필요

PDF 스캔본(이미지 기반)을 분석하려면 다음 중 하나가 필요합니다:
- **GPT-4 Vision API** — PDF 페이지를 이미지로 변환 후 직접 전달 (권장)
- **Google Cloud Vision OCR** — 텍스트 추출 후 GPT에 전달
- **AWS Textract** — 수식 인식 특화

텍스트 기반 PDF는 `pdf-parse` 라이브러리로 직접 텍스트 추출 가능합니다.

## 기술 스택

- **Next.js 14** App Router
- **TypeScript**
- **Tailwind CSS**
- **Recharts** — 5종 차트
- **lucide-react** — 아이콘
- **@dnd-kit** — 드래그 앤 드롭

## 향후 구현 예정 기능

- [ ] 실제 GPT-4 Vision OCR 연동
- [ ] 문항 영역 자동 분할 (Computer Vision)
- [ ] 학생 풀이 이미지 기반 오답 원인 분석
- [ ] HWP / PDF 리포트 내보내기
- [ ] 교육 블로그 자동 업로드 (Tistory API, 네이버 블로그 API)
- [ ] 다중 시험지 비교 분석
- [ ] 학생별 취약점 매핑
- [ ] 연도별 트렌드 분석

## 디렉토리 구조

```
exam-analyzer/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # 홈 화면
│   ├── analyze/page.tsx      # 업로드 화면
│   ├── reports/page.tsx      # 분석 목록
│   ├── report/[id]/page.tsx  # 리포트 에디터
│   └── api/analyze/route.ts  # GPT 분석 API
├── components/
│   ├── ui/                   # 공통 UI 컴포넌트
│   ├── report/               # 리포트 섹션 컴포넌트
│   └── editor/               # 편집 기능 컴포넌트
└── lib/
    ├── types.ts              # TypeScript 타입 정의
    ├── mockData.ts           # 샘플 분석 데이터
    ├── storage.ts            # localStorage 유틸
    └── utils.ts              # 공통 유틸 함수
```
