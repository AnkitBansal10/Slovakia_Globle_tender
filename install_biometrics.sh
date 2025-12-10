#!/bin/bash

echo "🚀 Installing OZ Forensics Liveness Detection for React Native..."

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install react-native-webview@^13.8.6 react-native-permissions@^4.1.5 react-native-camera@^4.2.1

# iOS setup
echo "🍎 Setting up iOS..."
if [ -d "ios" ]; then
    echo "Adding camera permissions to iOS Info.plist..."
    # Note: You'll need to manually add the camera permissions to ios/Solvakia/Info.plist
    echo "⚠️  MANUAL STEP REQUIRED: Add camera permissions to ios/Solvakia/Info.plist"
    echo "Add these keys:"
    echo "<key>NSCameraUsageDescription</key>"
    echo "<string>This app needs access to camera for liveness detection</string>"
    echo "<key>NSMicrophoneUsageDescription</key>"
    echo "<string>This app needs access to microphone for liveness detection</string>"
    
    # Install iOS pods
    cd ios && pod install && cd ..
else
    echo "⚠️  iOS directory not found, skipping iOS setup"
fi

# Android setup
echo "🤖 Setting up Android..."
if [ -d "android" ]; then
    echo "⚠️  MANUAL STEP REQUIRED: Add camera permissions to android/app/src/main/AndroidManifest.xml"
    echo "Add these permissions:"
    echo "<uses-permission android:name=\"android.permission.CAMERA\" />"
    echo "<uses-permission android:name=\"android.permission.INTERNET\" />"
    echo "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />"
else
    echo "⚠️  Android directory not found, skipping Android setup"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Replace 'your-oz-forensics-license-key-here' with your actual license key"
echo "2. Add camera permissions to platform manifest files (see above)"
echo "3. Test the integration using the BiometricsDemo screen"
echo "4. Navigate to 'BiometricsDemo' in your app to test the functionality"
echo ""
echo "📖 For detailed documentation, see README_OZ_LIVENESS.md"
echo ""
echo "🎉 Happy coding!"
