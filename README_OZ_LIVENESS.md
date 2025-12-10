# OZ Forensics Liveness Detection - React Native Integration

This document provides a complete guide for integrating OZ Forensics liveness detection into your React Native application.

## Overview

The OZ Forensics liveness detection plugin has been successfully integrated into your React Native app with the following features:

- **Real-time face liveness detection**
- **Cross-platform support** (iOS, Android, Web)
- **Configurable quality settings**
- **Comprehensive error handling**
- **TypeScript support**
- **Modern React Native architecture**

## Project Structure

```
src/
├── components/biometrics/
│   ├── LivenessDetection.tsx     # Main liveness detection component
│   └── index.tsx                 # Component exports
├── screens/biometrics/
│   ├── LivenessScreen.tsx        # Full-screen liveness interface
│   ├── BiometricsDemo.tsx        # Demo and testing screen
│   └── index.tsx                 # Screen exports
├── services/biometrics/
│   └── OzLivenessService.ts      # Core service logic
└── types/
    └── webview.d.ts              # WebView type declarations
```

## Installation

### 1. Dependencies

The following dependencies have been added to your `package.json`:

```json
{
  "react-native-webview": "^13.8.6",
  "react-native-permissions": "^4.1.5",
  "react-native-camera": "^4.2.1"
}
```

Install the dependencies:

```bash
npm install
# or
yarn install
```

### 2. iOS Setup

Add camera permissions to `ios/Solvakia/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera for liveness detection</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for liveness detection</string>
```

### 3. Android Setup

Add camera permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Configuration

### 1. License Key Setup

Replace the placeholder license key in your configuration:

```typescript
const config: LivenessConfig = {
  licenseKey: 'your-actual-oz-forensics-license-key',
  endpoint: 'https://web-sdk.cdn.sandbox.ozforensics.com/blstemporary/plugin_liveness.php',
  timeout: 30000,
  quality: 'high',
  enableDebug: false,
};
```

### 2. Environment Configuration

For production, update the endpoint URL:

```typescript
const config: LivenessConfig = {
  licenseKey: 'your-production-license-key',
  endpoint: 'https://your-production-endpoint.com/liveness',
  // ... other config
};
```

## Usage

### Basic Implementation

```typescript
import React from 'react';
import { LivenessDetection, LivenessConfig, LivenessResult } from '../components/biometrics';

const MyComponent = () => {
  const config: LivenessConfig = {
    licenseKey: 'your-license-key',
    quality: 'medium',
    timeout: 30000,
  };

  const handleResult = (result: LivenessResult) => {
    if (result.success) {
      console.log('Liveness Score:', result.livenessScore);
      console.log('Session ID:', result.sessionId);
      // Handle successful verification
    } else {
      console.error('Liveness check failed:', result.error);
      // Handle failure
    }
  };

  return (
    <LivenessDetection
      config={config}
      onResult={handleResult}
      onError={(error) => console.error(error)}
      onCancel={() => console.log('User cancelled')}
    />
  );
};
```

### Navigation Integration

```typescript
import { useNavigation } from '@react-navigation/native';
import { LivenessConfig } from '../components/biometrics';

const MyScreen = () => {
  const navigation = useNavigation();

  const startLivenessCheck = () => {
    const config: LivenessConfig = {
      licenseKey: 'your-license-key',
      quality: 'high',
    };

    (navigation as any).navigate('LivenessScreen', {
      config,
      onComplete: (result) => {
        // Handle completion
        console.log('Liveness result:', result);
      },
    });
  };

  return (
    <TouchableOpacity onPress={startLivenessCheck}>
      <Text>Start Liveness Check</Text>
    </TouchableOpacity>
  );
};
```

## API Reference

### LivenessConfig

```typescript
interface LivenessConfig {
  licenseKey: string;           // Required: Your OZ Forensics license key
  endpoint?: string;            // Optional: API endpoint URL
  timeout?: number;             // Optional: Timeout in milliseconds (default: 30000)
  quality?: 'low' | 'medium' | 'high'; // Optional: Detection quality (default: 'medium')
  enableDebug?: boolean;        // Optional: Enable debug logging (default: false)
}
```

### LivenessResult

```typescript
interface LivenessResult {
  success: boolean;             // Whether the check was successful
  livenessScore?: number;       // Confidence score (0-1)
  faceImage?: string;           // Base64 encoded face image
  sessionId?: string;           // Unique session identifier
  error?: string;               // Error message if failed
  details?: any;                // Additional metadata
}
```

### OzLivenessService Methods

```typescript
// Initialize the service
await OzLivenessService.initialize(config);

// Start liveness check
const result = await OzLivenessService.startLivenessCheck();

// Validate result
const isValid = await OzLivenessService.validateResult(result);

// Check if service is initialized
const isInitialized = OzLivenessService.isServiceInitialized();

// Reset service
OzLivenessService.reset();
```

## Components

### LivenessDetection

The main component for liveness detection with WebView integration.

**Props:**
- `config: LivenessConfig` - Configuration object
- `onResult: (result: LivenessResult) => void` - Success callback
- `onError?: (error: string) => void` - Error callback
- `onCancel?: () => void` - Cancel callback
- `style?: any` - Custom styles

### LivenessScreen

Full-screen implementation with instructions and navigation.

**Route Params:**
- `config?: LivenessConfig` - Configuration object
- `onComplete?: (result: LivenessResult) => void` - Completion callback

## Testing

### Demo Screen

Use the `BiometricsDemo` screen to test different configurations:

```typescript
import { BiometricsDemo } from '../screens/biometrics';

// Add to your navigation stack
<Stack.Screen name="BiometricsDemo" component={BiometricsDemo} />
```

### Manual Testing

1. **Basic Flow Test:**
   - Navigate to demo screen
   - Start basic liveness check
   - Follow on-screen instructions
   - Verify results

2. **Error Handling Test:**
   - Test with invalid license key
   - Test network timeout scenarios
   - Test user cancellation

3. **Quality Settings Test:**
   - Compare different quality settings
   - Measure performance impact
   - Validate accuracy differences

## Troubleshooting

### Common Issues

1. **WebView not loading:**
   - Ensure `react-native-webview` is properly installed
   - Check network connectivity
   - Verify endpoint URL

2. **Camera permissions:**
   - Add required permissions to platform manifests
   - Request permissions at runtime
   - Handle permission denied scenarios

3. **License key errors:**
   - Verify license key is correct
   - Check license key expiration
   - Ensure endpoint matches license

4. **TypeScript errors:**
   - Ensure all type declarations are imported
   - Check WebView type definitions
   - Verify React Native version compatibility

### Debug Mode

Enable debug mode for detailed logging:

```typescript
const config: LivenessConfig = {
  licenseKey: 'your-license-key',
  enableDebug: true,
};
```

## Performance Optimization

### Best Practices

1. **Quality Settings:**
   - Use 'medium' quality for most use cases
   - Use 'high' quality only when necessary
   - Use 'low' quality for testing

2. **Timeout Configuration:**
   - Set appropriate timeouts based on network conditions
   - Consider user experience vs accuracy trade-offs

3. **Memory Management:**
   - Reset service when not needed
   - Handle component unmounting properly
   - Clear large image data after processing

## Security Considerations

1. **License Key Protection:**
   - Store license keys securely
   - Use environment variables
   - Implement key rotation

2. **Data Handling:**
   - Encrypt sensitive biometric data
   - Implement secure transmission
   - Follow data retention policies

3. **Network Security:**
   - Use HTTPS endpoints
   - Implement certificate pinning
   - Validate server responses

## Production Deployment

### Checklist

- [ ] Replace sandbox license key with production key
- [ ] Update endpoint URLs for production
- [ ] Test on physical devices
- [ ] Verify camera permissions
- [ ] Test network error scenarios
- [ ] Validate result processing
- [ ] Implement analytics/logging
- [ ] Security audit completed

### Monitoring

Implement monitoring for:
- Success/failure rates
- Performance metrics
- Error patterns
- User experience metrics

## Support

For technical support:

1. **OZ Forensics Documentation:** Check official OZ Forensics documentation
2. **React Native Issues:** Check React Native WebView documentation
3. **Integration Issues:** Review this implementation guide
4. **Custom Requirements:** Consider extending the service class

## License

This integration follows the OZ Forensics licensing terms. Ensure compliance with your OZ Forensics license agreement.

---

**Note:** Remember to replace all placeholder license keys and endpoints with your actual production values before deploying to production.
