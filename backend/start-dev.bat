@echo off
echo Starting Qiupai Chess Room Management System...
echo.
echo Using H2 in-memory database for development
echo Backend will be available at: http://localhost:8080/api
echo API Documentation: http://localhost:8080/api/swagger-ui/index.html
echo H2 Database Console: http://localhost:8080/api/h2-console
echo.
echo Press Ctrl+C to stop the server
echo.

mvnw.cmd spring-boot:run