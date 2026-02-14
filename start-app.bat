@echo off
title Minha Ferramenta PDF + Simulador

echo Iniciando Backend...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 > nul

echo Iniciando Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 > nul

echo Abrindo aplicacao...
start http://direcional.simulador:5173

exit
