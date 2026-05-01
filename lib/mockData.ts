import type { ExamAnalysis, QuestionAnalysis } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock 1: 동패고등학교 1학년 공통수학1 중간고사
// 25문항 전원 객관식, 총점 100점, 50분
// 참고: 포텐수학과학학원 실제 분석 블로그 기반
// ─────────────────────────────────────────────────────────────────────────────

const dongpaeQuestions: QuestionAnalysis[] = [
  { id: "dp-1",  number: 1,  type: "객관식", score: 3,   unit: "다항식의 연산",   difficulty: "하",  source: "교과서",     requiredThinking: "다항식 덧셈·뺄셈 기본",         likelyTrap: "부호 처리 실수",                     studentPanicReason: "거의 없음",       isKiller: false },
  { id: "dp-2",  number: 2,  type: "객관식", score: 3,   unit: "다항식의 연산",   difficulty: "하",  source: "교과서",     requiredThinking: "지수 법칙 적용",               likelyTrap: "지수 더하기 vs 곱하기 혼동",          studentPanicReason: "거의 없음",       isKiller: false },
  { id: "dp-3",  number: 3,  type: "객관식", score: 3,   unit: "이차방정식과 이차함수", difficulty: "하",  source: "교과서",     requiredThinking: "이차방정식 근의 공식",         likelyTrap: "판별식 부호",                        studentPanicReason: "거의 없음",       isKiller: false },
  { id: "dp-4",  number: 4,  type: "객관식", score: 3,   unit: "이차방정식과 이차함수", difficulty: "하",  source: "교과서",     requiredThinking: "꼭짓점 좌표 변환",            likelyTrap: "완전제곱식 부호 실수",               studentPanicReason: "거의 없음",       isKiller: false },
  { id: "dp-5",  number: 5,  type: "객관식", score: 3,   unit: "나머지정리",      difficulty: "하",  source: "교과서",     requiredThinking: "나머지정리 기본 적용",         likelyTrap: "대입값 부호 실수",                   studentPanicReason: "거의 없음",       isKiller: false },
  { id: "dp-6",  number: 6,  type: "객관식", score: 3,   unit: "인수분해",        difficulty: "하",  source: "교과서",     requiredThinking: "기본 인수분해 공식",           likelyTrap: "공통인수 누락",                      studentPanicReason: "거의 없음",       isKiller: false },
  { id: "dp-7",  number: 7,  type: "객관식", score: 4,   unit: "이차방정식과 이차함수", difficulty: "중",  source: "교과서",     requiredThinking: "이차함수 그래프 해석",         likelyTrap: "계수 부호와 형태 혼동",              studentPanicReason: "낮음",            isKiller: false },
  { id: "dp-8",  number: 8,  type: "객관식", score: 4,   unit: "나머지정리",      difficulty: "중",  source: "교과서",     requiredThinking: "인수정리 활용 + 연립",        likelyTrap: "a·b 값 혼동",                       studentPanicReason: "낮음",            isKiller: false },
  { id: "dp-9",  number: 9,  type: "객관식", score: 4,   unit: "이차방정식과 이차함수", difficulty: "중",  source: "교과서",     requiredThinking: "판별식 조건 설정",            likelyTrap: "≥0 vs >0 혼동",                    studentPanicReason: "낮음",            isKiller: false },
  { id: "dp-10", number: 10, type: "객관식", score: 4,   unit: "다항식의 연산",   difficulty: "중",  source: "교과서",     requiredThinking: "항등식 계수 비교",            likelyTrap: "미지수 개수 파악 오류",              studentPanicReason: "낮음",            isKiller: false },
  { id: "dp-11", number: 11, type: "객관식", score: 4,   unit: "인수분해",        difficulty: "중",  source: "외부 문항",  requiredThinking: "치환 이용한 인수분해",        likelyTrap: "치환 범위 오류",                     studentPanicReason: "낮음",            isKiller: false },
  { id: "dp-12", number: 12, type: "객관식", score: 4,   unit: "이차방정식과 이차함수", difficulty: "중",  source: "교과서",     requiredThinking: "이차함수 최대·최소 기본",     likelyTrap: "정의역 제한 조건 미반영",            studentPanicReason: "낮음",            isKiller: false },
  { id: "dp-13", number: 13, type: "객관식", score: 4,   unit: "나머지정리",      difficulty: "중",  source: "외부 문항",  requiredThinking: "조립제법 + 나머지 추론",      likelyTrap: "계수 정렬 실수",                     studentPanicReason: "중간 정도",       isKiller: false },
  { id: "dp-14", number: 14, type: "객관식", score: 4,   unit: "이차방정식과 이차함수", difficulty: "중",  source: "교과서",     requiredThinking: "직선-이차함수 위치 관계",     likelyTrap: "접선 조건 vs 교점 조건 혼동",        studentPanicReason: "중간 정도",       isKiller: false },
  { id: "dp-15", number: 15, type: "객관식", score: 4,   unit: "이차방정식과 이차함수", difficulty: "중상", source: "학교 프린트", requiredThinking: "정의역 제한 + 최댓값 비교",   likelyTrap: "구간 경계값 대입 누락",              studentPanicReason: "높음",            isKiller: false },
  { id: "dp-16", number: 16, type: "객관식", score: 4,   unit: "나머지정리",      difficulty: "중상", source: "학교 프린트", requiredThinking: "다항식 나눗셈 + 조건 추론",   likelyTrap: "몫과 나머지 구분 오류",              studentPanicReason: "높음",            isKiller: false },
  { id: "dp-17", number: 17, type: "객관식", score: 4,   unit: "인수분해",        difficulty: "중상", source: "학교 프린트", requiredThinking: "조건부 인수분해 응용",        likelyTrap: "인수 범위 설정 오류",                studentPanicReason: "높음",            isKiller: false },
  { id: "dp-18", number: 18, type: "객관식", score: 4,   unit: "이차방정식과 이차함수", difficulty: "중상", source: "학교 프린트", requiredThinking: "이차함수와 절댓값 결합",       likelyTrap: "케이스 분류 누락",                   studentPanicReason: "매우 높음",       isKiller: false },
  { id: "dp-19", number: 19, type: "객관식", score: 4,   unit: "나머지정리",      difficulty: "중상", source: "학교 프린트", requiredThinking: "항등식 + 나머지 종합",        likelyTrap: "항등식 조건 설정 오류",              studentPanicReason: "매우 높음",       isKiller: false },
  { id: "dp-20", number: 20, type: "객관식", score: 4,   unit: "이차방정식과 이차함수", difficulty: "중상", source: "학교 프린트", requiredThinking: "이차부등식 + 범위 분석",      likelyTrap: "부등호 방향 혼동",                   studentPanicReason: "매우 높음",       isKiller: false },
  { id: "dp-21", number: 21, type: "객관식", score: 5,   unit: "이차방정식과 이차함수", difficulty: "상",  source: "학교 프린트", requiredThinking: "이차함수 조건 + 대칭성 추론", likelyTrap: "그래프 형태와 조건 불일치",          studentPanicReason: "매우 높음",       isKiller: true  },
  { id: "dp-22", number: 22, type: "객관식", score: 5,   unit: "나머지정리",      difficulty: "상",  source: "학교 프린트", requiredThinking: "고차 다항식 연립 나머지 추론", likelyTrap: "f(a)=0 조건 누락",                  studentPanicReason: "매우 높음",       isKiller: true  },
  { id: "dp-23", number: 23, type: "객관식", score: 5,   unit: "이차방정식과 이차함수", difficulty: "최상", source: "학교 프린트", requiredThinking: "새로운 함수 g(p) 최솟값 추적", likelyTrap: "움직이는 구간 최솟값 정의 미이해",  studentPanicReason: "극도로 높음 — 킬러", isKiller: true },
  { id: "dp-24", number: 24, type: "객관식", score: 5.5, unit: "이차방정식과 이차함수", difficulty: "상",  source: "학교 프린트", requiredThinking: "이차함수 + 점 조건 역추론",   likelyTrap: "조건 방정식 세팅 오류",             studentPanicReason: "매우 높음",       isKiller: false },
  { id: "dp-25", number: 25, type: "객관식", score: 4.5, unit: "나머지정리",      difficulty: "최상", source: "학교 프린트", requiredThinking: "조건 전체 케이스 분류 + 나머지", likelyTrap: "케이스 누락 — 완벽한 구조적 이해 필수", studentPanicReason: "극도로 높음 — 최고 킬러", isKiller: true },
];

export const dongpaeMock: ExamAnalysis = {
  id: "mock-dongpae-2026",
  title: "[시험지 분석] 2026 동패고 1학년 1학기 중간고사 수학 충격 분석 및 기말고사 생존 전략",
  schoolName: "동패고등학교",
  grade: "1학년",
  subject: "공통수학1",
  examName: "1학기 중간고사",
  totalScore: 100,
  totalQuestions: 25,
  objectiveCount: 25,
  descriptiveCount: 0,
  overallDifficulty: "상",
  perceivedDifficulty: "평균 50점대 추락 예상 — 체감 난이도 폭발",
  executiveSummary: [
    "이번 2026 동패고 1학기 중간고사는 전년도 기출에 익숙한 학생들이 시험지를 넘기는 순간부터 크게 당황했을 시험입니다. 특히 학교 프린트 기반 신유형이 전반부에는 없다가 15번 이후 집중적으로 배치됩니다.",
    "'이차방정식과 이차함수' 단원이 전체 배점의 44%(11문항)를 독점합니다. 이 단원을 완벽히 장악하지 못하면 동패고 상위권 진입은 불가능합니다.",
    "21번·22번·23번·25번 킬러 4문항의 배점 합은 19.5점입니다. 이 구간을 통째로 놓치면 나머지를 완벽히 풀어도 80.5점이 최고점입니다. 90점 돌파는 이 킬러들의 정복 없이는 구조적으로 불가능합니다.",
  ],
  questions: dongpaeQuestions,
  unitDistribution: [
    { unit: "이차방정식과 이차함수", score: 44,  questionCount: 11, percentage: 44   },
    { unit: "나머지정리",           score: 28,  questionCount: 7,  percentage: 28   },
    { unit: "다항식의 연산",        score: 14,  questionCount: 4,  percentage: 14   },
    { unit: "인수분해",             score: 14,  questionCount: 3,  percentage: 14   },
  ],
  typeScoreDistribution: [
    { type: "객관식", score: 100, percentage: 100 },
    { type: "서술형", score: 0,   percentage: 0   },
  ],
  difficultyDistribution: [
    { difficulty: "하",  count: 6,  percentage: 24 },
    { difficulty: "중",  count: 8,  percentage: 32 },
    { difficulty: "중상", count: 6, percentage: 24 },
    { difficulty: "상",  count: 3,  percentage: 12 },
    { difficulty: "최상", count: 2, percentage: 8  },
  ],
  flowData: [
    { questionNumber: 1,  difficultyScore: 1,   timePressure: 1,   label: "기본 구간",   zone: "basic"    },
    { questionNumber: 2,  difficultyScore: 1,   timePressure: 1,   zone: "basic"    },
    { questionNumber: 3,  difficultyScore: 1.2, timePressure: 1,   zone: "basic"    },
    { questionNumber: 4,  difficultyScore: 1.2, timePressure: 1.2, zone: "basic"    },
    { questionNumber: 5,  difficultyScore: 1.3, timePressure: 1.3, zone: "basic"    },
    { questionNumber: 6,  difficultyScore: 1.5, timePressure: 1.5, zone: "basic"    },
    { questionNumber: 7,  difficultyScore: 2,   timePressure: 2,   zone: "standard" },
    { questionNumber: 8,  difficultyScore: 2,   timePressure: 2,   zone: "standard" },
    { questionNumber: 9,  difficultyScore: 2.2, timePressure: 2.2, zone: "standard" },
    { questionNumber: 10, difficultyScore: 2.3, timePressure: 2.3, zone: "standard" },
    { questionNumber: 11, difficultyScore: 2.3, timePressure: 2.4, zone: "standard" },
    { questionNumber: 12, difficultyScore: 2.4, timePressure: 2.4, zone: "standard" },
    { questionNumber: 13, difficultyScore: 2.5, timePressure: 2.5, zone: "standard" },
    { questionNumber: 14, difficultyScore: 2.6, timePressure: 2.6, label: "계산 실수 구간", zone: "standard" },
    { questionNumber: 15, difficultyScore: 3.2, timePressure: 3,   zone: "pressure" },
    { questionNumber: 16, difficultyScore: 3.3, timePressure: 3.2, zone: "pressure" },
    { questionNumber: 17, difficultyScore: 3.4, timePressure: 3.4, zone: "pressure" },
    { questionNumber: 18, difficultyScore: 3.6, timePressure: 3.6, zone: "pressure" },
    { questionNumber: 19, difficultyScore: 3.7, timePressure: 3.8, zone: "pressure" },
    { questionNumber: 20, difficultyScore: 3.8, timePressure: 4,   zone: "pressure" },
    { questionNumber: 21, difficultyScore: 4.5, timePressure: 4.5, label: "킬러 구간",   zone: "killer"   },
    { questionNumber: 22, difficultyScore: 4.5, timePressure: 4.8, zone: "killer"   },
    { questionNumber: 23, difficultyScore: 5,   timePressure: 5,   zone: "killer"   },
    { questionNumber: 24, difficultyScore: 4.3, timePressure: 5,   zone: "killer"   },
    { questionNumber: 25, difficultyScore: 5,   timePressure: 5,   label: "최고 킬러",   zone: "killer"   },
  ],
  killerSummary: {
    killerQuestionNumbers: [21, 22, 23, 25],
    totalKillerScore: 19.5,
    maxScoreIfMissed: 80,
    message: "킬러 문항 4개(21·22·23·25번)의 배점 합은 19.5점입니다. 이 문항들을 모두 놓치면 나머지를 완벽히 풀어도 80점이 최고점입니다. 90점 돌파는 이 세 문제의 정복 없이는 구조적으로 불가능합니다.",
  },
  finalStrategy: [
    "학교 프린트 연계 문항 완벽 해부 — 킬러 4문항 전부가 학교 프린트 출처. 프린트를 마스터하면 1등급의 보증수표입니다",
    "이차방정식·이차함수 단원 집중 투자 — 전체 배점 44%, 킬러 중 3문항이 이 단원에서 출제됨",
    "서술형 없음 → 속도 훈련 필수 — 25문항 50분, 1문제당 2분. 중반부(15~20번)에서 시간을 지체했다면 뒷장 구경도 못 한 시험",
    "새로운 함수 g(p) 유형 반복 훈련 — 23번 유형은 '움직이는 구간의 최솟값' 정의를 완벽히 이해해야 접근 가능",
    "나머지정리 연립 조건 추론 훈련 — 22번·25번 유형은 항등식 설정 → 케이스 분류 → 나머지 산출의 3단계 구조 체화 필수",
  ],
  createdAt: "2026-04-24T10:01:00.000Z",
  updatedAt: "2026-04-24T10:01:00.000Z",
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock 2: 심학고등학교 1학년 공통수학1 중간고사
// 21문항 (객관식 19 + 서술형 2), 총점 100점
// 참고: 포텐수학과학학원 실제 분석 블로그 기반
// ─────────────────────────────────────────────────────────────────────────────

const simhakQuestions: QuestionAnalysis[] = [
  { id: "sh-1",  number: 1,  type: "객관식", score: 3.2, unit: "다항식의 연산",        difficulty: "하",  source: "교과서",     requiredThinking: "다항식 기본 연산",              likelyTrap: "부호 처리 실수",              studentPanicReason: "거의 없음",        isKiller: false },
  { id: "sh-2",  number: 2,  type: "객관식", score: 3.2, unit: "다항식의 연산",        difficulty: "하",  source: "교과서",     requiredThinking: "지수 법칙",                     likelyTrap: "지수 덧셈 혼동",             studentPanicReason: "거의 없음",        isKiller: false },
  { id: "sh-3",  number: 3,  type: "객관식", score: 3.2, unit: "이차방정식과 이차함수", difficulty: "하",  source: "교과서",     requiredThinking: "이차방정식 근의 공식",           likelyTrap: "판별식 부호",                studentPanicReason: "거의 없음",        isKiller: false },
  { id: "sh-4",  number: 4,  type: "객관식", score: 3.2, unit: "나머지정리",           difficulty: "하",  source: "교과서",     requiredThinking: "나머지정리 기본",               likelyTrap: "대입값 부호 실수",           studentPanicReason: "거의 없음",        isKiller: false },
  { id: "sh-5",  number: 5,  type: "객관식", score: 3.2, unit: "인수분해",             difficulty: "하",  source: "교과서",     requiredThinking: "기본 인수분해",                 likelyTrap: "공통인수 누락",              studentPanicReason: "거의 없음",        isKiller: false },
  { id: "sh-6",  number: 6,  type: "객관식", score: 3.2, unit: "다항식의 연산",        difficulty: "하",  source: "교과서",     requiredThinking: "항등식 계수 비교",              likelyTrap: "미지수 파악 오류",           studentPanicReason: "거의 없음",        isKiller: false },
  { id: "sh-7",  number: 7,  type: "객관식", score: 4.2, unit: "이차방정식과 이차함수", difficulty: "중",  source: "외부 문항",  requiredThinking: "그래프 해석",                   likelyTrap: "계수 부호 혼동",             studentPanicReason: "낮음",             isKiller: false },
  { id: "sh-8",  number: 8,  type: "객관식", score: 4.2, unit: "이차방정식과 이차함수", difficulty: "중",  source: "교과서",     requiredThinking: "최대·최소 기본",                likelyTrap: "정의역 미적용",              studentPanicReason: "낮음",             isKiller: false },
  { id: "sh-9",  number: 9,  type: "객관식", score: 4.2, unit: "나머지정리",           difficulty: "중",  source: "교과서",     requiredThinking: "인수정리 + 조립제법",           likelyTrap: "계수 정렬 실수",             studentPanicReason: "낮음",             isKiller: false },
  { id: "sh-10", number: 10, type: "객관식", score: 4.2, unit: "인수분해",             difficulty: "중",  source: "교과서",     requiredThinking: "치환 인수분해",                 likelyTrap: "치환 범위 오류",             studentPanicReason: "낮음",             isKiller: false },
  { id: "sh-11", number: 11, type: "객관식", score: 4.2, unit: "나머지정리",           difficulty: "중",  source: "외부 문항",  requiredThinking: "나머지 연립 추론",              likelyTrap: "식 설정 오류",               studentPanicReason: "중간 정도",        isKiller: false },
  { id: "sh-12", number: 12, type: "객관식", score: 5.2, unit: "이차방정식과 이차함수", difficulty: "중상", source: "학교 프린트", requiredThinking: "정의역 제한 최댓값 비교",        likelyTrap: "경계값 대입 누락",           studentPanicReason: "높음",             isKiller: false },
  { id: "sh-13", number: 13, type: "객관식", score: 5.2, unit: "이차방정식과 이차함수", difficulty: "중상", source: "학교 프린트", requiredThinking: "이차부등식 + 조건 분석",        likelyTrap: "부등호 방향 실수",           studentPanicReason: "높음",             isKiller: false },
  { id: "sh-14", number: 14, type: "객관식", score: 5.2, unit: "나머지정리",           difficulty: "중상", source: "학교 프린트", requiredThinking: "항등식 + 나머지 종합",          likelyTrap: "항등식 조건 설정 오류",      studentPanicReason: "높음",             isKiller: false },
  { id: "sh-15", number: 15, type: "객관식", score: 5.2, unit: "나머지정리",           difficulty: "중상", source: "외부 문항",  requiredThinking: "다항식 나눗셈 추론",            likelyTrap: "몫·나머지 혼동",             studentPanicReason: "높음",             isKiller: false },
  { id: "sh-16", number: 16, type: "객관식", score: 5.2, unit: "이차방정식과 이차함수", difficulty: "중상", source: "학교 프린트", requiredThinking: "직선-이차함수 위치 관계",        likelyTrap: "접선 vs 교점 조건 혼동",     studentPanicReason: "높음",             isKiller: false },
  { id: "sh-17", number: 17, type: "객관식", score: 5.2, unit: "이차방정식과 이차함수", difficulty: "중상", source: "외부 문항",  requiredThinking: "이차함수 + 절댓값 결합",         likelyTrap: "케이스 분류 누락",           studentPanicReason: "매우 높음",        isKiller: false },
  { id: "sh-18", number: 18, type: "객관식", score: 5.5, unit: "이차방정식과 이차함수", difficulty: "상",  source: "학교 프린트", requiredThinking: "이차함수 조건 + 대칭성 추론",    likelyTrap: "그래프-조건 불일치",         studentPanicReason: "매우 높음",        isKiller: true  },
  { id: "sh-19", number: 19, type: "객관식", score: 5.5, unit: "나머지정리",           difficulty: "상",  source: "학교 프린트", requiredThinking: "고차 다항식 연립 + 나머지 추론", likelyTrap: "f(a)=0 조건 누락",          studentPanicReason: "극도로 높음 — 킬러", isKiller: true },
  { id: "sh-20", number: 20, type: "서술형", score: 5.0, unit: "다항식의 연산",        difficulty: "중",  source: "교과서",     requiredThinking: "항등식 서술 풀이",              likelyTrap: "서술 단계 생략으로 감점",     studentPanicReason: "높음 — 서술 구성", isKiller: false },
  { id: "sh-21", number: 21, type: "서술형", score: 6.0, unit: "이차방정식과 이차함수", difficulty: "최상", source: "학교 프린트", requiredThinking: "이차함수 조건 증명 + 값 산출",   likelyTrap: "논리 비약 — 감점 불가피",    studentPanicReason: "극도로 높음 — 킬러", isKiller: true },
];

export const simhakMock: ExamAnalysis = {
  id: "mock-simhak-2026",
  title: "[시험지 분석] 2026 심학고 1학년 1학기 중간고사 수학 난이도 분석 및 90점 이상 고득점 달성 전략",
  schoolName: "심학고등학교",
  grade: "1학년",
  subject: "공통수학1",
  examName: "1학기 중간고사",
  totalScore: 100,
  totalQuestions: 21,
  objectiveCount: 19,
  descriptiveCount: 2,
  overallDifficulty: "상",
  perceivedDifficulty: "체감 난이도 양극화 — 해답은 '학교 프린트'",
  executiveSummary: [
    "이번 2026 심학고 1학기 공통수학1 중간고사는 작년 기출 대비 전반적인 변별력이 한층 강화되어 출제되었습니다. 가장 주목할 만한 특징은 상위권과 중하위권 학생 간의 '체감 난이도 양극화' 현상입니다.",
    "최상위권 등급을 가르는 고난도 문항의 대다수가 '학교 프린트'에서 연계 출제되었기 때문에, 학교 프린트를 완벽히 다독한 최상위권에게는 오히려 시간 단축이 가능한 구조입니다.",
    "킬러 문항 3개(18·19·21번)의 배점 합은 17점입니다. 이 문항들을 놓친다면 완벽하게 풀어도 최고점은 83점입니다. 90점 돌파는 이 세 문제의 정복 없이는 구조적으로 불가능합니다.",
  ],
  questions: simhakQuestions,
  unitDistribution: [
    { unit: "이차함수",   score: 35, questionCount: 6, percentage: 28.6 },
    { unit: "나머지정리", score: 20, questionCount: 5, percentage: 23.8 },
    { unit: "기타 단원",  score: 45, questionCount: 10, percentage: 47.6 },
  ],
  typeScoreDistribution: [
    { type: "객관식", score: 89, percentage: 89 },
    { type: "서술형", score: 11, percentage: 11 },
  ],
  difficultyDistribution: [
    { difficulty: "하",  count: 6,  percentage: 28.6 },
    { difficulty: "중",  count: 5,  percentage: 23.8 },
    { difficulty: "중상", count: 6, percentage: 28.6 },
    { difficulty: "상",  count: 2,  percentage: 9.5  },
    { difficulty: "최상", count: 2, percentage: 9.5  },
  ],
  flowData: [
    { questionNumber: 1,  difficultyScore: 1,   timePressure: 1,   label: "기본 구간",   zone: "basic"    },
    { questionNumber: 2,  difficultyScore: 1,   timePressure: 1,   zone: "basic"    },
    { questionNumber: 3,  difficultyScore: 1.2, timePressure: 1,   zone: "basic"    },
    { questionNumber: 4,  difficultyScore: 1.2, timePressure: 1.2, zone: "basic"    },
    { questionNumber: 5,  difficultyScore: 1.3, timePressure: 1.3, zone: "basic"    },
    { questionNumber: 6,  difficultyScore: 1.5, timePressure: 1.5, zone: "basic"    },
    { questionNumber: 7,  difficultyScore: 2,   timePressure: 2,   zone: "standard" },
    { questionNumber: 8,  difficultyScore: 2,   timePressure: 2,   zone: "standard" },
    { questionNumber: 9,  difficultyScore: 2.2, timePressure: 2.2, zone: "standard" },
    { questionNumber: 10, difficultyScore: 2.3, timePressure: 2.3, zone: "standard" },
    { questionNumber: 11, difficultyScore: 2.4, timePressure: 2.4, label: "변별력 시작", zone: "standard" },
    { questionNumber: 12, difficultyScore: 3,   timePressure: 2.8, zone: "pressure" },
    { questionNumber: 13, difficultyScore: 3.1, timePressure: 3,   zone: "pressure" },
    { questionNumber: 14, difficultyScore: 3.3, timePressure: 3.2, zone: "pressure" },
    { questionNumber: 15, difficultyScore: 3.4, timePressure: 3.4, zone: "pressure" },
    { questionNumber: 16, difficultyScore: 3.5, timePressure: 3.5, zone: "pressure" },
    { questionNumber: 17, difficultyScore: 3.7, timePressure: 3.8, zone: "pressure" },
    { questionNumber: 18, difficultyScore: 4.5, timePressure: 4.5, label: "킬러 구간",   zone: "killer"   },
    { questionNumber: 19, difficultyScore: 4.5, timePressure: 4.8, zone: "killer"   },
    { questionNumber: 20, difficultyScore: 3.5, timePressure: 4.5, zone: "killer"   },
    { questionNumber: 21, difficultyScore: 5,   timePressure: 5,   label: "최고 킬러",   zone: "killer"   },
  ],
  killerSummary: {
    killerQuestionNumbers: [18, 19, 21],
    totalKillerScore: 17,
    maxScoreIfMissed: 83,
    message: "킬러 문항 3개(18번·19번·21번)의 배점 합은 17.0점입니다. 이 문항들을 놓친다면 완벽하게 풀어도 최고점이 83점이 불과합니다. 90점 돌파는 이 세 문제의 정복 없이는 구조적으로 불가능합니다.",
  },
  finalStrategy: [
    "학교 프린트 연계 문항의 완벽한 해부 — 프린트를 완벽히 마스터한다면 90점 이상 고득점이 가능한 구조입니다",
    "배점의 구조적 역학 이해 — 5.5~6.0점짜리 고배점 문항을 단 1개라도 더 맞히면 등급이 바뀝니다",
    "서술형 감점 방어 훈련 — 20번·21번은 답만 맞혀서는 부족. 수식과 결론을 오류 없이 서술하는 연습 필수",
    "이차함수 단원 집중 투자 — 배점 비중 1위(28.6%), 킬러 2문항이 이 단원에서 출제됨",
    "나머지정리 연립 조건 추론 고속 처리 — 19번 유형은 항등식 설정 → 케이스 분류 → 나머지 산출의 3단계 체화 필수",
  ],
  createdAt: "2026-04-24T09:00:00.000Z",
  updatedAt: "2026-04-24T09:00:00.000Z",
};

export const ALL_MOCK_DATA: ExamAnalysis[] = [simhakMock, dongpaeMock];

export function createMockFromMetadata(
  metadata: {
    schoolName: string;
    grade: string;
    subject: string;
    examName: string;
    totalScore: number;
    totalQuestions: number;
    analysisMode: string;
  },
  id: string
): ExamAnalysis {
  const base = metadata.totalQuestions <= 22 ? simhakMock : dongpaeMock;
  return {
    ...base,
    id,
    title: `[시험지 분석] ${new Date().getFullYear()} ${metadata.schoolName || base.schoolName} ${metadata.grade || base.grade} ${metadata.examName || base.examName} ${metadata.subject || base.subject} 난이도 분석 및 기말 대비 전략`,
    schoolName: metadata.schoolName || base.schoolName,
    grade: metadata.grade || base.grade,
    subject: metadata.subject || base.subject,
    examName: metadata.examName || base.examName,
    totalScore: metadata.totalScore || base.totalScore,
    totalQuestions: metadata.totalQuestions || base.totalQuestions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
