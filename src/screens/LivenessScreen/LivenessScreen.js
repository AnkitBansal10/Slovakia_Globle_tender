import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { startLiveness } from './ozLiveness';
import { authorize, uploadMedia ,uploadMediaFolder_id } from '../../api/ozApi';


export default function LivenessAutoScreen() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [imagepaths,SetImagepath] =useState(null)

  useEffect(() => {
    const run = async () => {
      try {
        // 1️⃣ Open SDK → VIDEO
        const res = await startLiveness();
        console.log("res", res)
        const extractPath = (raw) => {
          if (!raw) return null;
          const match = raw.match(/path=([^,)]+)/);
          return match ? match[1] : null;
        };
        const videoPath = extractPath(res.rawResult);
        console.log('Video path:', videoPath);
        // image
        const extractLosslessImagePath = (rawResult) => {
          if (!rawResult) return null;
          const match = rawResult.match(
            /losslessMedia=MediaSource\(path=([^,]+),/i
          );
          return match ? match[1] : null;
        };
        const imagePath = extractLosslessImagePath(res.rawResult);
        console.log('Lossless image path:', imagePath);
        SetImagepath(imagePath)
        // 2️⃣ Auth
        const token = await authorize();
        console.log('Access token:', token);
        // 3️⃣ Upload VIDEO + PHOTO
        const response = await uploadMedia({
          accessToken:token ,
          videoPath:"",
          photoPath:"", // ✅ media_key2
        });
        console.log('Upload response:', response);
        console.log('folder_id response:', response?.folder_id);
        setResult(response);
         const Folder_id = await uploadMediaFolder_id({
          accessToken:token ,
          videoPath:videoPath,
          photoPath:imagePath, 
          folder_id:response?.folder_id
        });
        console.log('Upload Folder_idresponse:', Folder_id);
      }
      catch (e) {
  console.log('❌ ERROR (raw):', e?.message);
  Alert.alert(
    'Upload Error',
    e?.message || 'Unknown network error'
  );
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


