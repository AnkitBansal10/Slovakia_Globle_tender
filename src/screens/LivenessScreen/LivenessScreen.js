import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
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
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const isVerified =
    result?.resolution === 'SUCCESS' ||
    result?.resolution_status === 'SUCCESS';

  useEffect(() => {
    const runFlow = async () => {
      let path = null
      try {
        const res = await startLiveness();
        console.log("res", res)
        const regex = /path=([^,)]+)/;
        const match = res?.rawResult.match(regex);
        console.log("match", match)
        if (match && match[1]) {
          path = match[1];
        }
        console.log(path)
        const uploadRes = await uploadMediaFolder_id({
          accessToken: token,
          folder_id: folderId,
          videoPath: imageurl,
          photoPath: imageurl,
        });
        const mediaId = uploadRes?.[0]?.media_id;
        if (!mediaId) throw new Error('media_id missing');
        const analysesRes = await runAnalyses({
          accessToken: token,
          folder_id: folderId,
        });
        const analyseId =
          analysesRes?.[0]?.analyse_id ||
          analysesRes?.[0]?.analysis_id;
        const finalResult = await GetAnalyses({
          accessToken: token,
          analyse_id: analyseId,
        });
          if (finalResult.resolution === 'SUCCESS') {
          navigation.navigate("ProcessingScreen");
        }
        setResult(finalResult);
      } catch (e) {
        Alert.alert('Liveness Error', e.message);
      } finally {
        setProcessing(false);
      }
    };
    runFlow();
  }, []);
  if (processing) {
    return <OZLoadingScreen />;
  }
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* ✅ SUCCESS */}
      {isVerified && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: OZ_GREEN, fontSize: 22, fontWeight: '700' }}>
            ✔ Verification Successful
          </Text>
          <Text style={{ marginTop: 6, color: '#1E8449', fontSize: 14 }}>
            Identity verified successfully
          </Text>
        </View>
      )}
      {/* ❌ FAILURE */}
      {!isVerified && result && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: OZ_RED, fontSize: 20, fontWeight: '700' }}>
            ✖ Verification Failed
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: '#922B21',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Please retry with clear face and proper lighting
          </Text>
        </View>
      )}
    </View>
  );
}
