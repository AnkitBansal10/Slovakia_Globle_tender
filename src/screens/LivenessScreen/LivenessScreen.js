import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { initAndLogin, startLiveness } from './ozLiveness';
import { API_Server, login, Password } from '../../api/ozforensics';

export default function LivenessAutoScreen() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        // 1. Silent login
        await initAndLogin({
          serverUrl: API_Server,
          username: login,
          password: Password,
        });

        // 2. Open liveness SDK and run analysis
        const resultData = await startLiveness();
        setResult(resultData);
        console.log('Liveness result:', resultData);
      } catch (e) {
        console.log('Liveness error', e);
        Alert.alert('Error', e?.message ?? 'Liveness failed');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Opening Liveness...</Text>
        </>
    </View>
  );
}
