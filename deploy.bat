@echo off
REM Vercel 部署自动化脚本 (Windows 版本)
REM 用法：deploy.bat [backend|frontend|all]

setlocal enabledelayedexpansion

echo ========================================
echo    Vercel 部署工具
echo ========================================
echo.

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [信息] ✓ Node.js 已安装
)

REM 检查 pnpm
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] pnpm 未安装，建议使用 pnpm 进行部署
    echo 安装 pnpm: npm install -g pnpm
) else (
    echo [信息] ✓ pnpm 已安装
)

REM 检查 Vercel CLI
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [信息] Vercel CLI 未安装，正在安装...
    npm install -g vercel
) else (
    echo [信息] ✓ Vercel CLI 已安装
)

echo.

REM 登录 Vercel
echo [信息] 登录 Vercel...
vercel login
if %errorlevel% neq 0 (
    echo [错误] Vercel 登录失败
    pause
    exit /b 1
)

echo.

REM 部署后端
if "%1"=="backend" (
    goto :deploy_backend
)

REM 部署前端
if "%1"=="frontend" (
    goto :deploy_frontend
)

REM 部署全部
if "%1"=="all" (
    goto :deploy_all
)

REM 显示帮助信息
echo 用法：%~nx0 [backend^|frontend^|all]
echo.
echo 参数说明:
echo   backend   - 只部署后端服务
echo   frontend  - 只部署前端应用
echo   all       - 部署整个项目（先后端后前端）
echo.
echo 示例:
echo   %~nx0 backend    # 部署后端
echo   %~nx0 frontend   # 部署前端
echo   %~nx0 all        # 部署全部
echo.
pause
exit /b 0

:deploy_backend
echo [信息] ===== 开始部署后端 =====
cd /d "%~dp0server"

if not exist "vercel.json" (
    echo [错误] server\vercel.json 不存在
    pause
    exit /b 1
)

echo [信息] 部署到 Vercel（生产环境）...
vercel --prod
if %errorlevel% neq 0 (
    echo [错误] 后端部署失败
    cd /d "%~dp0"
    pause
    exit /b 1
)

echo [信息] ✓ 后端部署完成
echo [警告] 请记得在 Vercel Dashboard 中配置以下环境变量：
echo   - MONGODB_URI
echo   - DB_NAME
echo   - JWT_SECRET
echo   - NODE_ENV=production
echo   - PORT=8899
echo   - FRONTEND_URL ^(部署前端后填写^)
echo.

cd /d "%~dp0"
pause
exit /b 0

:deploy_frontend
echo [信息] ===== 开始部署前端 =====
cd /d "%~dp0frontend"

if not exist "package.json" (
    echo [错误] frontend\package.json 不存在
    pause
    exit /b 1
)

echo [信息] 部署到 Vercel（生产环境）...
vercel --prod
if %errorlevel% neq 0 (
    echo [错误] 前端部署失败
    cd /d "%~dp0"
    pause
    exit /b 1
)

echo [信息] ✓ 前端部署完成
echo [警告] 请记得在 Vercel Dashboard 中配置以下环境变量：
echo   - REACT_APP_API_URL ^(指向后端服务 URL^)
echo.

cd /d "%~dp0"
pause
exit /b 0

:deploy_all
echo [信息] ===== 开始全栈部署 =====

call :deploy_backend

echo.
echo [信息] 等待 10 秒让后端服务启动...
timeout /t 10 /nobreak >nul

call :deploy_frontend

echo.
echo [信息] ===== 部署完成 =====
echo [警告] 下一步操作：
echo 1. 在 Vercel Dashboard 中为后端项目配置环境变量
echo 2. 在 Vercel Dashboard 中为前端项目配置 REACT_APP_API_URL
echo 3. 更新后端的 FRONTEND_URL 环境变量并重新部署
echo 4. 测试前后端通信是否正常
echo.

pause
exit /b 0
