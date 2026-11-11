@echo off
echo ========================================================
echo Starting AVERA Saanvi Sarees Full-Stack Application...
echo ========================================================

set "JAVA_HOME=C:\Users\Hp\.jdks\ms-17.0.20.1"
set "NODE_HOME=C:\Users\Hp\AppData\Local\Author Software\nvm\installs\v20.19.4"
set "PATH=%NODE_HOME%;%JAVA_HOME%\bin;%PATH%"
set "MVN_CMD=C:\Users\Hp\.m2\wrapper\dists\apache-maven-3.9.9-bin\4nf9hui3q3djbarqar9g711ggc\apache-maven-3.9.9\bin\mvn.cmd"

start "AVERA Backend (Spring Boot:8080)" cmd /k "cd /d ""%~dp0backend"" && ""%MVN_CMD%"" spring-boot:run"
start "AVERA Frontend (Vite:5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo Backend starting on http://localhost:8080
echo Frontend starting on http://localhost:5173
echo Swagger UI at http://localhost:8080/swagger-ui.html
