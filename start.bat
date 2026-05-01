@echo off
chcp 65001 > nul
title Exam Analyzer

echo.
echo  ===========================================
echo   Exam Analyzer - Starting
echo  ===========================================
echo.

cd /d "%~dp0"

:: ── Step 1: Check Node.js ────────────────────────────────────────────
where node >nul 2>&1
if not errorlevel 1 goto :install_packages

echo  [!!] Node.js not found. Starting auto-install...
echo.

:: Try winget first (built into Windows 10 1709+)
where winget >nul 2>&1
if errorlevel 1 goto :try_msi

echo  [1/2] Installing Node.js LTS via winget...
echo        (This may take a few minutes)
winget install --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
if not errorlevel 1 (
    echo  [OK] Installed via winget.
    goto :refresh_path
)
echo  [!!] winget failed. Trying direct download...

:try_msi
echo  [2/2] Downloading Node.js from nodejs.org...
echo        (Click Yes if a UAC prompt appears)
echo.

set "NODE_MSI=%TEMP%\node_lts_installer.msi"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$v=((Invoke-WebRequest 'https://nodejs.org/dist/index.json' -UseBasicParsing|ConvertFrom-Json)|Where-Object{$_.lts}|Select-Object -First 1).version;$url='https://nodejs.org/dist/'+$v+'/node-'+$v+'-x64.msi';Write-Host('Downloading: '+$url);Invoke-WebRequest -Uri $url -OutFile '%NODE_MSI%' -UseBasicParsing"

if not exist "%NODE_MSI%" goto :install_failed

msiexec /i "%NODE_MSI%" /quiet /norestart
set "MSI_ERR=%errorlevel%"
del /f /q "%NODE_MSI%" >nul 2>&1

if "%MSI_ERR%"=="0" (
    echo  [OK] Installed via MSI.
    goto :refresh_path
)
if "%MSI_ERR%"=="1602" echo  [!!] Installation cancelled by user.
if "%MSI_ERR%"=="1603" echo  [!!] Admin rights required - right-click start.bat and choose Run as administrator.
goto :install_failed

:refresh_path
:: Add all common Node.js install locations to PATH
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LOCALAPPDATA%\Programs\nodejs;%APPDATA%\npm;%PATH%"

where node >nul 2>&1
if errorlevel 1 goto :need_reopen

echo  [OK] Node.js detected.
echo.
goto :install_packages

:need_reopen
echo.
echo  [!!] Node.js was installed but this window cannot detect it yet.
echo       Close this window and run start.bat again.
echo.
pause
exit /b 0

:install_failed
echo.
echo  [X] Auto-install failed.
echo      Install Node.js manually from: https://nodejs.org/en/download
echo      Then run start.bat again.
echo.
pause
exit /b 1

:: ── Step 2: Install packages ─────────────────────────────────────────
:install_packages
if not exist "node_modules\" (
    echo  [1/2] Installing packages... (first run only)
    call npm install
    if errorlevel 1 (
        echo.
        echo  [X] npm install failed.
        pause
        exit /b 1
    )
    echo  [OK] Packages installed.
    echo.
)

:: ── Step 3: Start server ─────────────────────────────────────────────
echo  [2/2] Starting development server...
echo.
echo  -------------------------------------------
echo   URL: http://localhost:3000
echo  -------------------------------------------
echo   Press Ctrl+C to stop the server.
echo.

:: Open browser after 3 seconds (PowerShell avoids URL quoting issues)
start /b powershell -NoProfile -Command "Start-Sleep 3; Start-Process 'http://localhost:3000'"

call npm run dev

pause
