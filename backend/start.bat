@echo off
echo Iniciando Conversor de PDF...
echo Por favor, aguarde enquanto o servidor inicia.
echo O navegador abrira automaticamente em http://localhost:3000
start http://localhost:3000
node dist/server.js
pause
