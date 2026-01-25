@echo off
chcp 65001 >nul
echo ========================================
echo         开机启动优化工具
echo ========================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [✓] 已获得管理员权限
) else (
    echo [!] 需要管理员权限，请右键以管理员身份运行
    pause
    exit /b 1
)

echo.
echo [1/8] 优化开机启动延迟...
REM 减少开机启动延迟
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Serialize" /v "StartupDelayInMSec" /t REG_DWORD /d 0 /f >nul 2>&1

echo [2/8] 禁用不必要的启动程序...
REM 禁用常见的不必要启动项
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Steam" /f >nul 2>&1
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Spotify" /f >nul 2>&1
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Discord" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v "iTunesHelper" /f >nul 2>&1

echo [3/8] 优化系统服务启动类型...
REM 将非关键服务设为手动启动
sc config "Themes" start= demand >nul 2>&1
sc config "TabletInputService" start= demand >nul 2>&1
sc config "Fax" start= disabled >nul 2>&1
sc config "WerSvc" start= demand >nul 2>&1
sc config "WSearch" start= demand >nul 2>&1

echo [4/8] 优化快速启动设置...
REM 启用快速启动
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /v "HiberbootEnabled" /t REG_DWORD /d 1 /f >nul 2>&1

echo [5/8] 清理启动文件夹...
REM 清理启动文件夹中的无用文件
del /q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\*.lnk" >nul 2>&1

echo [6/8] 优化内存管理...
REM 优化虚拟内存设置
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "ClearPageFileAtShutdown" /t REG_DWORD /d 0 /f >nul 2>&1

echo [7/8] 禁用不必要的计划任务...
REM 禁用一些占用资源的计划任务
schtasks /change /tn "Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser" /disable >nul 2>&1
schtasks /change /tn "Microsoft\Windows\Customer Experience Improvement Program\Consolidator" /disable >nul 2>&1
schtasks /change /tn "Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector" /disable >nul 2>&1

echo [8/8] 优化启动顺序...
REM 设置启动顺序优化
bcdedit /set {current} bootmenupolicy legacy >nul 2>&1
bcdedit /timeout 3 >nul 2>&1

echo.
echo ========================================
echo         开机优化完成！
echo ========================================
echo.
echo 优化内容：
echo - 减少启动延迟
echo - 禁用不必要的启动程序
echo - 优化系统服务
echo - 启用快速启动
echo - 清理启动项
echo - 优化内存管理
echo - 禁用资源占用任务
echo.
echo 建议重启电脑以使优化生效
echo.
pause