# Aegis

Android WebView wrapper for the Aegis AI weather assistant at  
**https://qualie--aegis-weather.asia-southeast1.hosted.app/listen**

Built with Apache Cordova.

---

## Features

- Full-screen WebView loading the Aegis web app
- Pull-down to reload (swipe from the top edge)
- Native Android runtime permission requests (microphone, camera, location)
- Location-services check on launch — prompts user to enable GPS if it's off
- Splash screen while the app loads

## Requirements

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| Cordova CLI | 12+ |
| Android SDK | API 22–35 |
| Java JDK | 17+ |

## Setup

```bash
npm install -g cordova
npm install
cordova platform add android
```

## Build

```bash
# Debug APK
cd platforms/android
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease
```

## Install on device

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Plugins

| Plugin | Purpose |
|--------|---------|
| `cordova-plugin-inappbrowser` | WebView navigation |
| `cordova-plugin-android-permissions` | Native runtime permission dialogs |
| `cordova.plugins.diagnostic` | Location services state + settings redirect |

## Permissions requested

- `RECORD_AUDIO` / `MODIFY_AUDIO_SETTINGS` — microphone for voice input
- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` — GPS for weather
- `CAMERA` — camera access for the web app

## Project structure

```
www/
  index.html        # Splash, permission flow, iframe loader, pull-to-refresh
config.xml          # Cordova config & Android permissions manifest
hooks/
  after_prepare/
    fix_gradle_versions.js
platforms/android/  # Generated Android project (do not edit directly)
plugins/            # Installed Cordova plugins
```
