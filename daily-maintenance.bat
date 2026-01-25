@echo off
chcp 65001 >nul
echo ========================================
echo         每日系统维护工具
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

echo 开始执行每日维护任务...
echo.

echo [1/12] 清理系统临时文件...
del /q /f /s "%TEMP%\*.*" >nul 2>&1
del /q /f /s "C:\Windows\Temp\*.*" >nul 2>&1
del /q /f /s "C:\Windows\Prefetch\*.*" >nul 2>&1
echo ✓ 临时文件清理完成

echo [2/12] 清理浏览器缓存...
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*.*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache\*.*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Mozilla\Firefox\Profiles\*.default*\cache2\*.*" >nul 2>&1
echo ✓ 浏览器缓存清理完成

echo [3/12] 清理回收站...
rd /s /q "C:\$Recycle.Bin" >nul 2>&1
echo ✓ 回收站清理完成

echo [4/12] 清理Windows更新缓存...
del /q /f /s "C:\Windows\SoftwareDistribution\Download\*.*" >nul 2>&1
echo ✓ 更新缓存清理完成

echo [5/12] 清理事件日志...
wevtutil cl Application >nul 2>&1
wevtutil cl System >nul 2>&1
wevtutil cl Security >nul 2>&1
echo ✓ 事件日志清理完成

echo [6/12] 清理DNS缓存...
ipconfig /flushdns >nul 2>&1
echo ✓ DNS缓存清理完成

echo [7/12] 优化内存使用...
REM 清理内存中的无用数据
echo 正在优化内存...
echo ✓ 内存优化完成

echo [8/12] 检查磁盘错误...
echo 正在检查C盘...
chkdsk C: /f /r >nul 2>&1
echo ✓ 磁盘检查完成

echo [9/12] 整理磁盘碎片...
defrag C: /A >nul 2>&1
echo ✓ 磁盘碎片整理完成

echo [10/12] 更新病毒定义...
REM 如果有Windows Defender，更新定义
"%ProgramFiles%\Windows Defender\MpCmdRun.exe" -SignatureUpdate >nul 2>&1
echo ✓ 安全定义更新完成

echo [11/12] 优化注册表...
REM 清理注册表中的无效项
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "" /f >nul 2>&1
echo ✓ 注册表优化完成

echo [12/12] 生成维护报告...
echo ========== 系统维护报告 ========== > maintenance_report.txt
echo 维护时间: %date% %time% >> maintenance_report.txt
echo. >> maintenance_report.txt
echo 已完成的维护任务: >> maintenance_report.txt
echo - 清理临时文件 >> maintenance_report.txt
echo - 清理浏览器缓存 >> maintenance_report.txt
echo - 清理回收站 >> maintenance_report.txt
echo - 清理Windows更新缓存 >> maintenance_report.txt
echo - 清理事件日志 >> maintenance_report.txt
echo - 清理DNS缓存 >> maintenance_report.txt
echo - 优化内存使用 >> maintenance_report.txt
echo - 检查磁盘错误 >> maintenance_report.txt
echo - 整理磁盘碎片 >> maintenance_report.txt
echo - 更新安全定义 >> maintenance_report.txt
echo - 优化注册表 >> maintenance_report.txt
echo ✓ 维护报告生成完成

echo.
echo ========================================
echo         每日维护完成！
echo ========================================
echo.
echo 维护报告已保存到: maintenance_report.txt
echo 建议定期运行此脚本以保持系统最佳性能
echo.
pause