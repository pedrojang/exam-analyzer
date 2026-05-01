#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   시험지 분석 리포트 생성기 - 시작 중   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# node_modules 없으면 먼저 설치
if [ ! -d "node_modules" ]; then
  echo "[1/2] 패키지 설치 중... (최초 1회만 실행됩니다)"
  npm install
  echo "✅ 패키지 설치 완료"
  echo ""
fi

echo "[2/2] 개발 서버 시작 중..."
echo ""
echo "──────────────────────────────────────────"
echo "🌐 브라우저에서 접속:  http://localhost:3000"
echo "──────────────────────────────────────────"
echo "종료하려면 Ctrl+C 를 누르세요."
echo ""

# macOS / Linux 브라우저 자동 오픈
( sleep 3 && \
  if command -v open &>/dev/null; then open http://localhost:3000; \
  elif command -v xdg-open &>/dev/null; then xdg-open http://localhost:3000; \
  fi ) &

npm run dev
