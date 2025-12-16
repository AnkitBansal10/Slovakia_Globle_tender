import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { startLiveness } from './ozLiveness';
import { authorize, uploadMedia } from '../../api/ozApi';


export default function LivenessAutoScreen() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        // 1️⃣ Open SDK → VIDEO
        const videoPath = await startLiveness();
        console.log('Video path:', videoPath);
        console.log('Video path:', videoPath?.folderId);


        // 2️⃣ Auth
        const token = await authorize();
        console.log('Access token:', token);

        // 3️⃣ Upload VIDEO + PHOTO
        const response = await uploadMedia({
          accessToken: token,
          folderId:videoPath?.folderId,
          videoPath:"",
          photoPath: "", // ✅ media_key2
        });

        console.log('Upload response:', response);
        setResult(response);

      } catch (e) {
        console.log('Error:', e);
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <>
          <ActivityIndicator size="large" />
          <Text>Opening Liveness…</Text>
        </>
      ) : (
        <Text style={{ padding: 12 }}>
          {JSON.stringify(result, null, 2)}
        </Text>
      )}
    </View>
  );
}


