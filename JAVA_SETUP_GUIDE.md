# Java Setup Guide for React Native Android

## Problem
You're using Java 25, but React Native requires Java 17 (LTS) for Android builds.

## Solution: Install Java 17

### Step 1: Download Java 17
1. Go to: https://adoptium.net/temurin/releases/?version=17
2. Download **JDK 17 (LTS)** for Windows x64
3. Choose **.msi installer** (easier) or .zip

### Step 2: Install Java 17
- Run the installer
- Install to default location: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`

### Step 3: Update JAVA_HOME Environment Variable

**In PowerShell (as Administrator):**
```powershell
# Set JAVA_HOME to Java 17
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.13+11-hotspot', 'Machine')

# Update PATH (remove old Java 25, add Java 17)
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$newPath = $currentPath -replace 'C:\\Program Files\\Eclipse Adoptium\\jdk-25[^;]*', ''
$newPath = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13+11-hotspot\bin;" + $newPath
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')
```

**Or manually via Windows:**
1. Press `Win + X` → System → Advanced system settings
2. Click "Environment Variables"
3. Edit `JAVA_HOME` → Set to: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
4. Edit `Path` → Remove Java 25 entry, add: `%JAVA_HOME%\bin`
5. **Restart your terminal/PowerShell**

### Step 4: Verify
```powershell
java -version
# Should show: openjdk version "17.x.x"
```

### Step 5: Try Building Again
```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```


