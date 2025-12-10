// MainScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import OzLivenessSDK from '../OzLivenessSDK/OzLivenessSDK';

const MainScreen = () => {
  const [hint, setHint] = useState('');

  useEffect(() => {
    configureSDK();
  }, []);

  const configureSDK = async () => {
    try {
      await OzLivenessSDK.configure({
        allowDebugVisualization: true,
        maxAttempts: 2,
        maxRetries: 3,
        toolbarTitle: 'React Native Sample'
      });
    } catch (error) {
      setHint(`Configuration error: ${error.message}`);
    }
  };

  const handleStartLiveness = async () => {
    try {
      const actions = ['Smile', 'Scan'];
      const result = await OzLivenessSDK.startLiveness(actions);
      
      setHint(`Result: ${result.code} - ${result.message}`);
      
      if (result.code === 'SUCCESS') {
        // You can analyze media here if needed
        // await analyzeMedia(result.media);
      }
    } catch (error) {
      setHint(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleStartLiveness}>
        <Text style={styles.buttonText}>Start Liveness Check</Text>
      </TouchableOpacity>
      
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default MainScreen;