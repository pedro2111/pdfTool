@echo off

echo Verificando se aplicacao ja esta rodando...

netstat -ano | findstr :3000 > nul
if %errorlevel%==0 (
    echo Backend ja esta em execucao.
    goto END
)

echo Iniciando Backend...
cd backend
start "" /b cmd /c "npm run dev > ..\backend.log 2>&1"

timeout /t 5 > nul

echo Iniciando Frontend...
cd ..\frontend
start "" /b cmd /c "npm run dev > ..\frontend.log 2>&1"

:END
exit
