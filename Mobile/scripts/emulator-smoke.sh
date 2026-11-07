#!/usr/bin/env bash
# Emulator-runner executes each script line separately with /bin/sh -c;
# keep conditional launch checks in this single Bash script.
set -euo pipefail
APK="Mobile/android/app/build/outputs/apk/release/app-release.apk"
LOG="Mobile/slowroads-startup-logcat.txt"
PNG="Mobile/slowroads-startup.png"
PKG="com.harleytg.slowroads"

adb install -r "$APK"
adb logcat -c
adb shell am start -W -n "$PKG/.MainActivity"
sleep 18
adb logcat -d -v time > "$LOG"
adb exec-out screencap -p > "$PNG"

if ! adb shell pidof "$PKG" >/dev/null; then
  echo "::error::SlowRoads process exited during emulator cold-start"
  grep -Ei 'FATAL EXCEPTION|AndroidRuntime|com.harleytg.slowroads|expo.modules.gl' "$LOG" | tail -120 || true
  exit 1
fi

# Scan the emulator logs only for known fatal errors; logcat has normal
# Java warnings which are not necessarily crashes.
if grep -Ei 'FATAL EXCEPTION|Didn.t find a correct constructor for class' "$LOG"; then
  echo "::error::Android fatal error found in logcat"
  exit 1
fi
echo 'SlowRoads experimental APK remained running during emulator cold-start check'
