@echo off
REM Script de setup e start do Dashboard (Windows)

echo 📦 Instalando dependências...
call npm install

echo.
echo 🚀 Iniciando servidores...
echo   • json-server na porta 3000
echo   • http-server na porta 8000
echo.
echo Acesse: http://localhost:8000
echo.

REM Iniciar json-server em background
start "json-server" cmd /k "npx json-server db.json --port 3000"

REM Aguardar um pouco para o json-server iniciar
timeout /t 2 /nobreak

REM Iniciar http-server
npx http-server -p 8000 -c-1
