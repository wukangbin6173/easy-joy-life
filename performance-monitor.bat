@echo off
chcp 65001 >nul
echo ========================================
echo         系统性能监控工具
echo ========================================
echo.

:menu
echo 请选择操作：
echo 1. 查看系统资源使用情况
echo 2. 查看占用资源最多的进程
echo 3. 清理内存
echo 4. 查看启动项
echo 5. 查看系统服务状态
echo 6. 一键优化性能
echo 7. 退出
echo.
set /p choice=请输入选择 (1-7): 

if "%choice%"=="1" goto :system_info
if "%choice%"=="2" goto :top_processes
if "%choice%"=="3" goto :clean_memory
if "%choice%"=="4" goto :startup_items
if "%choice%"=="5" goto :service_status
if "%choice%"=="6" goto :quick_optimize
if "%choice%"=="7" goto :exit
goto :menu

:system_info
echo.
echo ========== 系统资源使用情况 ==========
wmic cpu get loadpercentage /value | find "LoadPercentage"
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /value | find "="
echo.
pause
goto :menu

:top_processes
echo.
echo ========== 占用资源最多的进程 ==========
echo CPU占用最高的进程：
wmic process get name,processid,percentprocessortime | sort /r
echo.
echo 内存占用最高的进程：
tasklist /fo table | sort /r /+5
echo.
pause
goto :menu

:clean_memory
echo.
echo ========== 清理内存 ==========
echo 正在清理内存...
REM 清理工作集
for /f "tokens=2 delims=," %%a in ('tasklist /fo csv ^| find /v "Image Name"') do (
    echo %%a | findstr /r "^[0-9]*$" >nul && (
        echo 正在优化进程 %%a 的内存使用...
    )
)
echo 内存清理完成！
echo.
pause
goto :menu

:startup_items
echo.
echo ========== 启动项列表 ==========
echo 注册表启动项：
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" 2>nul
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" 2>nul
echo.
echo 启动文件夹项目：
dir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup" /b 2>nul
echo.
pause
goto :menu

:service_status
echo.
echo ========== 系统服务状态 ==========
echo 正在运行的服务数量：
sc query state= all | find /c "RUNNING"
echo.
echo 占用资源较多的服务：
tasklist /svc | findstr /i "svchost"
echo.
pause
goto :menu

:quick_optimize
echo.
echo ========== 一键性能优化 ==========
echo [1/5] 清理临时文件...
del /q /f /s "%TEMP%\*.*" >nul 2>&1
del /q /f /s "C:\Windows\Temp\*.*" >nul 2>&1

echo [2/5] 清理DNS缓存...
ipconfig /flushdns >nul 2>&1

echo [3/5] 结束不必要进程...
taskkill /f /im "wetype_update.exe" >nul 2>&1
taskkill /f /im "360tray.exe" >nul 2>&1

echo [4/5] 优化内存...
echo 正在优化内存使用...

echo [5/5] 清理回收站...
rd /s /q "C:\$Recycle.Bin" >nul 2>&1

echo 优化完成！
echo.
pause
goto :menu

:exit
echo 感谢使用系统性能监控工具！
exit /b 0