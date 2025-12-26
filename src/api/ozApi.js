import RNFS from 'react-native-fs';

const HOST = 'https://sandbox.ohio.ozforensics.com';
/**
 * CLIENT AUTHORIZE
 */
export async function authorize() {
    const res = await fetch(`${HOST}/api/authorize/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            credentials: {
                email: 'service@bls.com',
                password: 'B67Io3bw5bkD7zS',
            },
        }),
    });
    const text = await res.text();
    console.log('AUTH RAW RESPONSE:', text);
    if (!res.ok) {
        throw new Error(text || 'Auth failed');
    }
    const json = JSON.parse(text);
    return json.access_token;
}
/**
 * FOLDER MEDIA [ADD]
 * video + photo
 */
export async function uploadMedia({ accessToken, videoPath, photoPath }) {
  console.log("photoPath",photoPath)
   const VIDEO_KEY = 'media_key1';
  const PHOTO_KEY = 'media_key2';
  const formData = new FormData();
  // VIDEO
  formData.append(VIDEO_KEY);
  // PHOTO (optional)
  if (photoPath && (await RNFS.exists(photoPath))) {
    formData.append(PHOTO_KEY, {
      uri:photoPath,
      type: 'image/jpeg',
      name: 'selfie_photo.jpg',
    });
  }
  // ✅ REQUIRED PAYLOAD (JSON STRING)
  const payload = {
    'media:meta_data': {
      [VIDEO_KEY]: { source: 'mobile' },
      [PHOTO_KEY]: { source: 'mobile' },
    },
    'media:tags': {
      [VIDEO_KEY]: [
        'video_selfie',
        'video_selfie_blank',
        'orientation_portrait',
      ],
      [PHOTO_KEY]: ['photo_selfie'],
    },
  };
  formData.append('payload', JSON.stringify(payload));
  const res = await fetch(
    `${HOST}/api/folders/`,
    {
      method: 'POST',
      headers: {
        'X-Forensic-Access-Token': accessToken,
        Accept: 'application/json',
        // ❌ DO NOT SET Content-Type
      },
      body: formData,
    }
  );
  const text = await res.text();
  console.log('UPLOAD RESPONSE:', text);
  if (!res.ok) {
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}
export async function uploadMediaFolder_id({
  accessToken,
  folder_id,
  photoPath,
}) {
  console.log("photoPath",photoPath)
  const PHOTO_KEY1 = 'media_key1';
  const PHOTO_KEY = 'media_key2';
  const formData = new FormData();
  // VIDEO
  formData.append(PHOTO_KEY1, {
    uri: `file://${photoPath}`,
    type: 'image/jpeg',
    name: 'selfie_photo.jpg',
  });
  // PHOTO (optional)
  if (photoPath && (await RNFS.exists(photoPath))) {
    formData.append(PHOTO_KEY, {
      uri: `file://${photoPath}`,
      type: 'image/jpeg',
      name: 'selfie_photo.jpg',
    });
  }
  // ✅ REQUIRED PAYLOAD (JSON STRING)
  const payload = {
    'media:meta_data': {
      [PHOTO_KEY]: { source: 'mobile' },
    },
    'media:tags': {
      [PHOTO_KEY]: ['photo_selfie'],
    },
  };
  formData.append('payload', JSON.stringify(payload));
  const res = await fetch(
    `${HOST}/api/folders/${folder_id}/media/`,
    {
      method: 'POST',
      headers: {
        'X-Forensic-Access-Token': accessToken,
        Accept: 'application/json',
        // ❌ DO NOT SET Content-Type
      },
      body: formData,
    }
  );
  const text = await res.text();
  console.log('UPLOAD RESPONSE:', text);

  if (!res.ok) {
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}

export async function runAnalyses({
  accessToken,
  folder_id,
  mediaId, // VIDEO media_id
}) {
    console.log(folder_id,"folderId")
    console.log(mediaId,"mediaId")
  const url = `${HOST}/api/folders/${folder_id}/analyses/`;
  const body = {
    analyses: [
      {
        type: "biometry",
        params: {
         threshold_min: 0.75,
          threshold_max: 0.85,
        },
      },
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Forensic-Access-Token": accessToken,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Analyses failed: ${text}`);
  }

  return JSON.parse(text);
}
export async function GetAnalyses({
  accessToken,
  analyse_id,
 }) {
    console.log(analyse_id,"analyse_id")
  const url = `${HOST}/api/analyses/${analyse_id}`;
  const res = await fetch(url, {
    headers: {
      "X-Forensic-Access-Token": accessToken,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Analyses failed: ${text}`);
  }

  return JSON.parse(text);
}