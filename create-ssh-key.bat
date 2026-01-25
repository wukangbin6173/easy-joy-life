@echo off
echo.
echo.
| ssh-keygen -t rsa -b 4096 -f "%USERPROFILE%\.ssh\id_rsa_easyjoylife" -C "easyjoylife-auto" -q