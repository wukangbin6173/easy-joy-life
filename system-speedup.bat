@echo off
echo 正在优化系统性能...

REM 清理临时文件
echo 清理临时文件...
del /q /f /s %TEMP%\*.*
del /q /f /s C:\Windows\Temp\*.*

REM 清理回收站
echo 清理回收站...
rd /s /q C:\$Recycle.Bin

REM 停止不必要的服务
echo 停止不必要的服务...
net stop "Windows Search" >nul 2>&1
net stop "Fax" >nul 2>&1
net stop "Tablet PC Input Service" >nul 2>&1

REM 结束占用资源的进程
echo 结束不必要的进程...
taskkill /f /im "lbtp.exe" >nul 2>&1
taskkill /f /im "AlibabaprotectUI.exe" >nul 2>&1
taskkill /f /im "HipsTray.exe" >nul 2>&1
taskkill /f /im "wetype_update.exe" >nul 2>&1

echo 系统优化完成！
pause