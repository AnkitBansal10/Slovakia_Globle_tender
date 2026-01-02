import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import { startLiveness } from './ozLiveness';
import {
  uploadMediaFolder_id,
  runAnalyses,
  GetAnalyses,
} from '../../api/ozApi';
import OZLoadingScreen from './OZLoadingScreen';

const OZ_GREEN = '#12C7C2';
const OZ_RED = '#E74C3C';

export default function LivenessAutoScreen({ route, navigation }) {
  const { token, folderId, imageurl } = route.params || {};

  const [processing, setProcessing] = useState(true);
  const [result, setResult] = useState(null);

  const isVerified =
    result?.resolution === 'SUCCESS' ||
    result?.resolution_status === 'SUCCESS';

  useEffect(() => {
    const runFlow = async () => {
      try {
        setProcessing(true);

        // 1️⃣ Start liveness
        const res = await startLiveness();
        console.log('LIVENESS RESULT:', res);

        // 2️⃣ Upload video + photo
        const uploadRes = await uploadMediaFolder_id({
          accessToken: token,
          folder_id: folderId,
          videoPath: imageurl,
          photoPath: imageurl,
        });

        const mediaId = uploadRes?.[0]?.media_id;
        if (!mediaId) throw new Error('media_id missing');

        // 3️⃣ Run analyses
        const analysesRes = await runAnalyses({
          accessToken: token,
          folder_id: folderId,
          mediaId,
        });

        const analyseId =
          analysesRes?.[0]?.analyse_id ||
          analysesRes?.[0]?.analysis_id;

        if (!analyseId) throw new Error('analyse_id missing');

        // 4️⃣ Get final result
        const finalResult = await GetAnalyses({
          accessToken: token,
          analyse_id: analyseId,
        });

        console.log('FINAL RESULT:', finalResult);
        setResult(finalResult);

        // 5️⃣ Navigate after success
        if (
          finalResult?.resolution === 'SUCCESS' ||
          finalResult?.resolution_status === 'SUCCESS'
        ) {
          setTimeout(() => {
            navigation.replace('ProcessingScreen');
          }, 1500);
        }
      } catch (e) {
        Alert.alert('Liveness Error', e.message);
        navigation.goBack();
      } finally {
        setProcessing(false);
      }
    };

    runFlow();
  }, []);

  // 🔄 Loading screen
  if (processing) {
    return <OZLoadingScreen />;
  }

  // ✅ Result screen
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          { color: isVerified ? OZ_GREEN : OZ_RED },
        ]}
      >
        {isVerified ? 'Verification Successful' : 'Verification Failed'}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
