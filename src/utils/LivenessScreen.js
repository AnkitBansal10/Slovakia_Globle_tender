import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import OzForensicsBridge from '../utils/OzForensicsBridge';

const LivenessScreen = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    // Initialize SDK when component mounts
    initializeSDK();
    
    // Add progress listener
    const progressSubscription = OzForensicsBridge.addAnalysisProgressListener(
      (progressData) => {
        setProgress(progressData);
      }
    );

    return () => {
      progressSubscription.remove();
      OzForensicsBridge.cancelAnalysis();
    };
  }, []);

  const initializeSDK = async () => {
    try {
      // Replace with your actual license asset ID
      await OzForensicsBridge.initializeSDK(12345); // R.raw.forensics
      console.log('SDK initialized successfully');
    } catch (error) {
      Alert.alert('Initialization Error', error.message);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await OzForensicsBridge.setApiConnection(
        'https://your-server-url.com',
        'your-username',
        'your-password'
      );
      Alert.alert('Success', 'Authentication successful');
    } catch (error) {
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLiveness = async () => {
    setLoading(true);
    try {
      const livenessResult = await OzForensicsBridge.startLivenessDetection([
        'Smile',
        'Scan'
      ]);
      setResult(JSON.stringify(livenessResult, null, 2));
      
      // Automatically analyze the captured media
      if (livenessResult.media && livenessResult.media.length > 0) {
        await handleAnalyzeMedia(livenessResult.media);
      }
    } catch (error) {
      if (error.message.includes('USER_CANCELLED')) {
        Alert.alert('Cancelled', 'Liveness detection was cancelled by user');
      } else {
        Alert.alert('Liveness Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeMedia = async (mediaList) => {
    setLoading(true);
    setProgress('Starting analysis...');
    
    try {
      const analysisResult = await OzForensicsBridge.analyzeMedia(mediaList);
      setResult(prev => prev + '\n\nAnalysis Result:\n' + analysisResult);
      Alert.alert('Analysis Complete', 'Media analysis finished successfully');
    } catch (error) {
      Alert.alert('Analysis Error', error.message);
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OzForensics Liveness Detection</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleStartLiveness}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Start Liveness Detection</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.progressText}>{progress}</Text>
        </View>
      )}

      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default LivenessScreen;