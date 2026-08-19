@echo off
REM (c) 2026 Mr-Aurevo-X - PixClean - 100% local - free - updates not guaranteed
cd /d "%~dp0"
if exist "%~dp0ui\vendor\pc-command-kit\" if exist "..\..\02_Shared_Infrastructure\UI-proprietaire\scripts\sync-ui-kit.ps1" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "..\..\02_Shared_Infrastructure\UI-proprietaire\scripts\sync-ui-kit.ps1" -Target "%~dp0ui\vendor\pc-command-kit" -KitRoot "..\..\02_Shared_Infrastructure\UI-proprietaire"
)
if exist "%~dp0.venv\Scripts\python.exe" (
  "%~dp0.venv\Scripts\python.exe" -m PyInstaller --noconfirm --clean PixClean.spec
) else (
  python -m PyInstaller --noconfirm --clean PixClean.spec
)
if exist "dist\PixClean.exe" (
  copy /Y "dist\PixClean.exe" "PixClean.exe" >nul
  echo OK: PixClean.exe
) else (
  echo Build failed.
  exit /b 1
)
