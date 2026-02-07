@echo off
echo ========================================
echo   تست نسخه Build شده برگرلند
echo ========================================
echo.

cd dist

echo راه‌اندازی سرور تست...
echo آدرس: http://localhost:3002
echo.
echo برای توقف سرور، Ctrl+C را فشار دهید
echo.

python -m http.server 3002

pause