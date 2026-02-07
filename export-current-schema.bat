@echo off
REM 导出当前数据库结构
echo 正在导出数据库结构...

mysql -h 121.43.96.127 -P 3306 -u root -p -D easy_joy_life_db -e "SHOW TABLES;" > current-tables.txt

echo.
echo 导出完成！请查看 current-tables.txt
pause
