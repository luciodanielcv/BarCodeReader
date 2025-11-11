# Environment Check Script for React Native Android Build
Write-Host "=== React Native Android Build Environment Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Java
Write-Host "Java Configuration:" -ForegroundColor Yellow
$javaVersion = java -version 2>&1 | Select-Object -First 1
Write-Host "  Java Version: $javaVersion"
if ($javaVersion -match 'version "25') {
    Write-Host "  WARNING: Java 25 detected. React Native requires Java 17 (LTS)" -ForegroundColor Red
    Write-Host "     Download Java 17 from: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
} elseif ($javaVersion -match 'version "17') {
    Write-Host "  OK: Java 17 detected (correct version)" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Java version may not be compatible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Environment Variables:" -ForegroundColor Yellow
Write-Host "  JAVA_HOME: $env:JAVA_HOME"
Write-Host "  ANDROID_HOME: $env:ANDROID_HOME"

if (-not $env:JAVA_HOME) {
    Write-Host "  WARNING: JAVA_HOME is not set!" -ForegroundColor Red
} else {
    Write-Host "  OK: JAVA_HOME is set" -ForegroundColor Green
}

if (-not $env:ANDROID_HOME) {
    Write-Host "  WARNING: ANDROID_HOME is not set!" -ForegroundColor Red
} else {
    Write-Host "  OK: ANDROID_HOME is set" -ForegroundColor Green
    if (Test-Path $env:ANDROID_HOME) {
        Write-Host "  OK: ANDROID_HOME path exists" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: ANDROID_HOME path does not exist!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "SSL Certificate Test:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://services.gradle.org" -UseBasicParsing -TimeoutSec 5
    Write-Host "  OK: Can connect to Gradle services" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Cannot connect to Gradle services: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "     This may indicate SSL certificate or network issues" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Recommendations ===" -ForegroundColor Cyan
Write-Host "1. Install Java 17 (LTS) from https://adoptium.net" -ForegroundColor White
Write-Host "2. Update JAVA_HOME to point to Java 17" -ForegroundColor White
Write-Host "3. Restart your terminal after changing environment variables" -ForegroundColor White
Write-Host "4. If behind corporate proxy, configure proxy in gradle.properties" -ForegroundColor White

