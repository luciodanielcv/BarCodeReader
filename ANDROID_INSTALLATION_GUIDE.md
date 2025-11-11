# Android Installation Guide
## Installing POS App on Android Device (Without USB Connection)

This guide explains how to build and install the POS application on an Android device when USB ports are disabled.

---

## Prerequisites

### On Your Windows Laptop:
1. **Java Development Kit (JDK)** - Version 17 or higher
   - Check: `java -version`
   - Download: https://adoptium.net/

2. **Android Studio** (for Android SDK)
   - Download: https://developer.android.com/studio
   - Install Android SDK and build tools

3. **Environment Variables** (set these in Windows):
   ```
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   JAVA_HOME=C:\Program Files\Java\jdk-17 (or your JDK path)
   ```
   Add to PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   %JAVA_HOME%\bin
   ```

### On Your Android Device:
1. Enable "Install from Unknown Sources" or "Install Unknown Apps"
   - Settings → Security → Unknown Sources (older Android)
   - Settings → Apps → Special Access → Install Unknown Apps (Android 8+)
   - Select your file manager/browser app and enable it

---

## Step 1: Build the APK File

### Option A: Debug APK (For Testing - Easier)

```powershell
# Navigate to android directory
cd android

# Build debug APK
.\gradlew assembleDebug

# The APK will be created at:
# android\app\build\outputs\apk\debug\app-debug.apk
```

### Option B: Release APK (For Production - Requires Signing)

```powershell
# Navigate to android directory
cd android

# Build release APK (unsigned)
.\gradlew assembleRelease

# The APK will be created at:
# android\app\build\outputs\apk\release\app-release-unsigned.apk
```

**Note:** For release APK, you'll need to sign it. See "Signing the APK" section below.

---

## Step 2: Sign the APK (For Release Builds)

### Create a Keystore (First Time Only):

```powershell
# Navigate to android\app directory
cd android\app

# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore pos-release-key.keystore -alias pos-key-alias -keyalg RSA -keysize 2048 -validity 10000

# You'll be prompted for:
# - Password (remember this!)
# - Your name, organization, etc.
```

### Sign the Release APK:

```powershell
# Navigate to android directory
cd android

# Sign the APK (replace with your keystore password)
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore app\pos-release-key.keystore app\build\outputs\apk\release\app-release-unsigned.apk pos-key-alias

# Align the APK
.\gradlew bundleRelease
# OR use zipalign manually:
# zipalign -v 4 app\build\outputs\apk\release\app-release-unsigned.apk app\build\outputs\apk\release\app-release-signed.apk
```

**For Testing:** Use the debug APK (Option A) - it's already signed with a debug keystore.

---

## Step 3: Transfer APK to Android Device

Since USB is disabled, use one of these methods:

### Method 1: Email
1. Email the APK file to yourself
2. Open email on Android device
3. Download the attachment
4. Tap to install

### Method 2: Cloud Storage
1. Upload APK to Google Drive, Dropbox, or OneDrive
2. Open the cloud app on Android device
3. Download the APK
4. Tap to install

### Method 3: QR Code
1. Upload APK to a file sharing service
2. Generate a QR code with the download link
3. Scan QR code with Android device
4. Download and install

### Method 4: Network Share
1. Share the APK folder on your local network
2. Access from Android device using a file manager
3. Download and install

---

## Step 4: Install on Android Device

1. **Locate the APK file** on your device (Downloads folder, etc.)

2. **Tap the APK file** to start installation

3. **If prompted "Blocked by Play Protect":**
   - Tap "More details"
   - Tap "Install anyway" (this is safe for your own app)

4. **Grant permissions** if prompted:
   - Allow installation from this source
   - Grant camera permission (for barcode scanning)

5. **Complete installation** - Tap "Install" when ready

6. **Open the app** from your app drawer

---

## Step 5: Grant Required Permissions

When you first run the app:

1. **Camera Permission** - Required for barcode scanning
   - The app will prompt you
   - Tap "Allow" when asked

2. **Storage Permission** (if needed for products.json)
   - May be requested depending on implementation

---

## Troubleshooting

### APK Installation Fails

**Error: "App not installed"**
- Check if another version is installed - uninstall first
- Ensure "Install from Unknown Sources" is enabled
- Try the debug APK instead of release

**Error: "Package appears to be corrupt"**
- Rebuild the APK
- Check file wasn't corrupted during transfer
- Try downloading again

### App Crashes on Launch

**Check Logs:**
```powershell
# Connect via WiFi ADB (if device is on same network)
adb connect <device-ip>:5555
adb logcat | findstr "ReactNative"
```

**Common Issues:**
- Missing permissions - grant camera permission
- Outdated Android version - requires Android 6.0 (API 23) or higher
- Insufficient storage space

### Build Errors

**"SDK location not found"**
- Set ANDROID_HOME environment variable
- Check `local.properties` in android folder has: `sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk`

**"Gradle sync failed"**
- Check internet connection (Gradle downloads dependencies)
- Run: `cd android && .\gradlew clean`

---

## Quick Reference Commands

```powershell
# Build debug APK (easiest for testing)
cd android
.\gradlew assembleDebug
# APK location: android\app\build\outputs\apk\debug\app-debug.apk

# Build release APK
cd android
.\gradlew assembleRelease
# APK location: android\app\build\outputs\apk\release\app-release-unsigned.apk

# Clean build
cd android
.\gradlew clean

# Check APK size
# Debug APK: Usually 30-50 MB
# Release APK: Usually 15-25 MB (smaller, optimized)
```

---

## File Locations

After building, find your APK at:

**Debug APK:**
```
android\app\build\outputs\apk\debug\app-debug.apk
```

**Release APK (unsigned):**
```
android\app\build\outputs\apk\release\app-release-unsigned.apk
```

**Release APK (signed):**
```
android\app\build\outputs\apk\release\app-release-signed.apk
```

---

## Notes

1. **Debug APK** is larger but easier to build - good for testing
2. **Release APK** is smaller and optimized - better for production
3. **First build** may take 5-10 minutes (downloads dependencies)
4. **Subsequent builds** are much faster (1-2 minutes)
5. **APK file size** is typically 30-50 MB for debug, 15-25 MB for release

---

## Alternative: Using React Native CLI

If you have issues with Gradle, you can also try:

```powershell
# From project root
npx react-native run-android --mode=release

# This builds and attempts to install via ADB
# Since USB is disabled, you'll need to extract the APK manually
```

---

## Security Note

- Debug APKs are signed with a debug certificate (not secure for production)
- Release APKs should be signed with your own keystore
- Keep your keystore file and password secure - you'll need them for updates

---

## Next Steps After Installation

1. Test barcode scanning functionality
2. Test product management
3. Verify products.json is accessible
4. Test all POS features

For updates, rebuild the APK and install again (will replace existing app).

