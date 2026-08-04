@echo off
REM (c) 2026 Mr-Aurevo-X - MetaStrip - 100% local - free - updates not guaranteed
cd /d "%~dp0"
if exist "%~dp0ui\vendor\pc-command-kit\" if exist "..\..\UI proprietaire\scripts\sync-ui-kit.ps1" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "..\..\UI proprietaire\scripts\sync-ui-kit.ps1" -Target "%~dp0ui\vendor\pc-command-kit" -KitRoot "..\..\UI proprietaire"
)
if exist "%~dp0.venv\Scripts\python.exe" (
  "%~dp0.venv\Scripts\python.exe" -m PyInstaller --noconfirm --clean MetaStrip.spec
) else (
  python -m PyInstaller --noconfirm --clean MetaStrip.spec
)
if exist "dist\MetaStrip.exe" (
  copy /Y "dist\MetaStrip.exe" "MetaStrip.exe" >nul
  echo OK: MetaStrip.exe
) else (
  echo Build failed.
  exit /b 1
)
