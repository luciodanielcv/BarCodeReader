# Android Studio Setup Guide

This guide will help you open and work with this React Native project in Android Studio.

## Prerequisites

1. **Android Studio** - Download and install from [developer.android.com/studio](https://developer.android.com/studio)
2. **Android SDK** - Installed via Android Studio SDK Manager
3. **Java Development Kit (JDK)** - JDK 17 or higher (Android Studio includes JDK)
4. **Node.js** - Version 20 or higher (already required for React Native)

## Opening the Project in Android Studio

### Step 1: Install Dependencies

First, make sure you have all Node.js dependencies installed:

```bash
npm install
```

### Step 2: Open Android Project

**Important:** Open the `android` folder, NOT the root project folder.

1. Launch Android Studio
2. Click **File** → **Open**
3. Navigate to your project directory: `C:\Projects\AI\BarCodeReader\android`
4. Select the `android` folder and click **OK**

### Step 3: Configure SDK Path (if needed)

Android Studio will automatically create a `local.properties` file in the `android` folder with your SDK path. If it doesn't, you can create it manually:

**Windows:**
```properties
sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

**Or use environment variable:**
```properties
sdk.dir=${ANDROID_HOME}
```

Replace `YourUsername` with your actual Windows username, or set the `ANDROID_HOME` environment variable to your Android SDK path.

### Step 4: Sync Gradle

1. Android Studio will prompt you to sync Gradle files
2. Click **Sync Now** or go to **File** → **Sync Project with Gradle Files**
3. Wait for the sync to complete (this may take a few minutes on first run)

### Step 5: Install Required SDK Components

If prompted, install any missing SDK components:
- Android SDK Platform 36
- Android SDK Build-Tools 36.0.0
- Android NDK 27.1.12297006
- Any other components Android Studio suggests

## Project Structure

```
BarCodeReader/
├── android/              ← Open THIS folder in Android Studio
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/barcodereader/
│   │   │       │   ├── MainActivity.kt
│   │   │       │   └── MainApplication.kt
│   │   │       ├── AndroidManifest.xml
│   │   │       └── res/
│   │   └── build.gradle
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradle.properties
├── src/                  ← React Native source code
└── package.json
```

## Building and Running

### From Android Studio:

1. Connect an Android device or start an emulator
2. Click the **Run** button (green play icon) or press `Shift + F10`
3. Select your device/emulator
4. The app will build and install automatically

### From Command Line:

```bash
# Start Metro bundler (in project root)
npm start

# In another terminal, run Android app
npm run android
```

## Troubleshooting

### Issue: "SDK location not found"
- Solution: Create `android/local.properties` with your SDK path (see Step 3 above)

### Issue: Gradle sync fails
- Solution: 
  1. Go to **File** → **Invalidate Caches** → **Invalidate and Restart**
  2. Check your internet connection (Gradle needs to download dependencies)
  3. Ensure you have JDK 17+ installed

### Issue: "NDK version not found"
- Solution: Install NDK 27.1.12297006 via Android Studio SDK Manager:
  1. **Tools** → **SDK Manager**
  2. **SDK Tools** tab
  3. Check **Show Package Details**
  4. Expand **NDK (Side by side)**
  5. Select version 27.1.12297006

### Issue: Build fails with "react-native" errors
- Solution: Make sure you've run `npm install` in the project root first

### Issue: Metro bundler not starting
- Solution: Run `npm start` in the project root directory (not the android folder)

## Development Tips

1. **Always keep Metro bundler running** when developing React Native apps
2. **Use Android Studio for native Android code** (Kotlin/Java files in `android/app/src/main/java/`)
3. **Use your preferred editor** (VS Code, etc.) for React Native/TypeScript code in the `src/` folder
4. **Hot Reload** works automatically when Metro is running

## Key Files

- `android/app/build.gradle` - App-level build configuration
- `android/build.gradle` - Project-level build configuration
- `android/app/src/main/AndroidManifest.xml` - Android app manifest
- `android/app/src/main/java/com/barcodereader/MainActivity.kt` - Main Android activity

## Additional Resources

- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio User Guide](https://developer.android.com/studio/intro)



