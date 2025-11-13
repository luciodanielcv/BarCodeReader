# PowerShell script to create local.properties file for Android Studio
# This script helps set up the Android SDK path automatically

Write-Host "Setting up local.properties for Android Studio..." -ForegroundColor Green

$sdkPath = $null

# Try to find Android SDK in common locations
$commonPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk",
    "$env:ANDROID_HOME",
    "$env:ANDROID_SDK_ROOT"
)

foreach ($path in $commonPaths) {
    if ($path -and (Test-Path $path)) {
        $sdkPath = $path
        Write-Host "Found Android SDK at: $sdkPath" -ForegroundColor Green
        break
    }
}

# If not found, prompt user
if (-not $sdkPath) {
    Write-Host "Android SDK not found in common locations." -ForegroundColor Yellow
    Write-Host "Please enter your Android SDK path:" -ForegroundColor Yellow
    Write-Host "Common location: C:\Users\YourUsername\AppData\Local\Android\Sdk" -ForegroundColor Cyan
    $sdkPath = Read-Host "SDK Path"
    
    if (-not (Test-Path $sdkPath)) {
        Write-Host "Warning: The specified path does not exist. Creating local.properties anyway..." -ForegroundColor Yellow
    }
}

# Escape backslashes for Gradle
$escapedPath = $sdkPath -replace '\\', '\\'

# Create local.properties file
$propertiesContent = "sdk.dir=$escapedPath"
$propertiesFile = Join-Path $PSScriptRoot "local.properties"

Set-Content -Path $propertiesFile -Value $propertiesContent

Write-Host "`nCreated local.properties file at: $propertiesFile" -ForegroundColor Green
Write-Host "Content: $propertiesContent" -ForegroundColor Cyan
Write-Host "`nYou can now open this project in Android Studio!" -ForegroundColor Green



