# Quick Guide: Build Android APK (No USB Required)

## Prerequisites

1. **Java JDK 17+** installed
   - Check: `java -version`
   - Download: https://adoptium.net/

2. **Android SDK** installed
   - Download Android Studio: https://developer.android.com/studio
   - Install Android SDK (API 23 or higher)
   - Set environment variable:
     ```
     ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
     ```

3. **Set PATH** (add to Windows PATH):
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

---

## Step 1: Build Debug APK (Easiest - For Testing)

```powershell
# Navigate to android folder
cd android

# Build debug APK (already signed with debug keystore)
.\gradlew assembleDebug
```

**APK Location:**
```
android\app\build\outputs\apk\debug\app-debug.apk
```

**File Size:** ~30-50 MB

---

## Step 2: Transfer APK to Android Device

Since USB is disabled, use one of these methods:

### Method 1: Email (Easiest)
1. Email `app-debug.apk` to yourself
2. Open email on Android device
3. Download attachment
4. Tap to install

### Method 2: Google Drive / Cloud Storage
1. Upload APK to Google Drive/Dropbox/OneDrive
2. Open cloud app on Android device
3. Download APK
4. Tap to install

### Method 3: QR Code
1. Upload APK to a file sharing service (e.g., WeTransfer, SendAnywhere)
2. Generate QR code with download link
3. Scan QR code with Android device
4. Download and install

---

## Step 3: Install on Android Device

1. **Enable Unknown Sources:**
   - Settings → Security → Unknown Sources (Android 7 and below)
   - OR Settings → Apps → Special Access → Install Unknown Apps (Android 8+)
   - Select your file manager/browser and enable it

2. **Locate APK file** (Downloads folder usually)

3. **Tap the APK file** to install

4. **If "Play Protect" blocks it:**
   - Tap "More details"
   - Tap "Install anyway"

5. **Grant permissions:**
   - Allow Camera permission (for barcode scanning)
   - Allow Storage permission (if needed)

6. **Open the app** from app drawer

---

## Troubleshooting

### Build Fails: "SDK location not found"
Create `android\local.properties` file:
```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Build Fails: "Gradle sync failed"
```powershell
cd android
.\gradlew clean
.\gradlew assembleDebug
```

### APK Won't Install: "App not installed"
- Uninstall any existing version first
- Check "Install from Unknown Sources" is enabled
- Try downloading APK again (may be corrupted)

### App Crashes: Camera Permission
- Go to Settings → Apps → POS App → Permissions
- Enable Camera permission

---

## Complete Build Command Sequence

```powershell
# From project root
cd android
.\gradlew clean
.\gradlew assembleDebug

# APK will be at:
# android\app\build\outputs\apk\debug\app-debug.apk
```

---

## For Production: Build Release APK

```powershell
cd android
.\gradlew assembleRelease

# APK at: android\app\build\outputs\apk\release\app-release-unsigned.apk
# Note: This needs to be signed before installation
```

**Note:** Current build.gradle uses debug signing for release builds (for testing). For production, create your own keystore.

---

## Quick Reference

| Item | Location |
|------|----------|
| Debug APK | `android\app\build\outputs\apk\debug\app-debug.apk` |
| Release APK | `android\app\build\outputs\apk\release\app-release-unsigned.apk` |
| Build Time | 5-10 min (first time), 1-2 min (subsequent) |
| APK Size | 30-50 MB (debug), 15-25 MB (release) |

---

## Next Steps After Installation

1. ✅ Test barcode scanning
2. ✅ Test product management
3. ✅ Verify products.json loads correctly
4. ✅ Test all POS features

For updates: Rebuild APK and install again (replaces existing app).

