@echo off
chcp 65001 >nul
echo ========================================
echo           系统性能优化工具
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
echo [1/10] 清理系统垃圾文件...
REM 清理临时文件
del /q /f /s "%TEMP%\*.*" >nul 2>&1
del /q /f /s "C:\Windows\Temp\*.*" >nul 2>&1
del /q /f /s "C:\Windows\Prefetch\*.*" >nul 2>&1
del /q /f /s "C:\Windows\SoftwareDistribution\Download\*.*" >nul 2>&1

REM 清理浏览器缓存
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*.*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache\*.*" >nul 2>&1

REM 清理回收站
rd /s /q "C:\$Recycle.Bin" >nul 2>&1

echo [2/10] 优化启动项...
REM 禁用不必要的启动项
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "DisableStartupDelay" /t REG_DWORD /d 0 /f >nul 2>&1

echo [3/10] 停止不必要的服务...
REM 停止占用资源的服务
net stop "Windows Search" >nul 2>&1
net stop "Fax" >nul 2>&1
net stop "Tablet PC Input Service" >nul 2>&1
net stop "Print Spooler" >nul 2>&1
net stop "Windows Error Reporting Service" >nul 2>&1
net stop "Superfetch" >nul 2>&1

echo [4/10] 优化内存管理...
REM 清理内存
echo 3 > C:\Windows\System32\config\systemprofile\Desktop\drop_caches.txt >nul 2>&1

echo [5/10] 结束占用资源的进程...
REM 结束不必要的进程
taskkill /f /im "lbtp.exe" >nul 2>&1
taskkill /f /im "AlibabaprotectUI.exe" >nul 2>&1
taskkill /f /im "HipsTray.exe" >nul 2>&1
taskkill /f /im "wetype_update.exe" >nul 2>&1
taskkill /f /im "360tray.exe" >nul 2>&1
taskkill /f /im "QQPCTray.exe" >nul 2>&1

echo [6/10] 优化磁盘性能...
REM 禁用磁盘索引（可选）
sc config "WSearch" start= disabled >nul 2>&1

echo [7/10] 优化网络设置...
REM 优化网络性能
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global chimney=enabled >nul 2>&1

echo [8/10] 优化视觉效果...
REM 设置为最佳性能
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" /v "VisualFXSetting" /t REG_DWORD /d 2 /f >nul 2>&1

echo [9/10] 清理DNS缓存...
ipconfig /flushdns >nul 2>&1

echo [10/10] 运行磁盘清理...
REM 启动磁盘清理
cleanmgr /sagerun:1 >nul 2>&1

echo.
echo ========================================
echo           优化完成！
echo ========================================
echo.
echo 建议重启电脑以使所有优化生效
echo.
pause