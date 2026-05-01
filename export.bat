@echo off
chcp 65001 > nul
title 프로젝트 패키징

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   시험지 분석기 — 이식용 ZIP 생성           ║
echo  ╚══════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: 날짜를 PowerShell로 가져오기 (Windows 지역 설정 무관)
for /f %%d in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd"') do set TODAY=%%d
set "ZIPNAME=exam-analyzer-%TODAY%.zip"

if exist "%ZIPNAME%" del /f /q "%ZIPNAME%"

echo  node_modules, .next, .env 제외 후 ZIP 압축 중...
echo.

:: 임시 폴더에 소스 복사 (node_modules, .next 는 재귀 제외)
set "TMPDIR=%TEMP%\exam-analyzer-export-%RANDOM%"
if exist "%TMPDIR%" rd /s /q "%TMPDIR%" >nul 2>&1

robocopy "%~dp0" "%TMPDIR%" /E /XD node_modules .next /XF *.zip .env .env.local .env.*.local >nul 2>&1

if not exist "%TMPDIR%\" (
    echo  ❌ 파일 복사 실패.
    pause
    exit /b 1
)

:: 임시 폴더 → ZIP (상대 경로 유지 — ZipFile::CreateFromDirectory 사용)
set "EXPORT_SRC=%TMPDIR%"
set "EXPORT_DST=%~dp0%ZIPNAME%"
powershell -NoProfile -Command ^
    "Add-Type -Assembly 'System.IO.Compression.FileSystem'; [System.IO.Compression.ZipFile]::CreateFromDirectory($env:EXPORT_SRC, $env:EXPORT_DST)"

:: 임시 폴더 정리
rd /s /q "%TMPDIR%" >nul 2>&1

if exist "%ZIPNAME%" (
    for %%S in ("%ZIPNAME%") do set ZIPSIZE=%%~zS
    echo  ✅ 완료: %ZIPNAME%
    echo.
    echo  ─────────────────────────────────────────────
    echo  새 컴퓨터에서 실행하는 방법:
    echo     1. 새 폴더 만들기 (예: exam-analyzer)
    echo     2. ZIP 파일을 그 폴더 안에 압축 해제
    echo     3. start.bat 더블클릭
    echo        (Node.js 없으면 자동 설치 후 서버 시작)
    echo  ─────────────────────────────────────────────
) else (
    echo  ❌ ZIP 생성 실패. 오류 내용을 확인하세요.
)

echo.
pause
