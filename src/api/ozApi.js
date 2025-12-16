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
export async function uploadMedia({
  accessToken,
  folderId,
  videoPath,
  photoPath, // ✅ NEW
}) {
  const formData = new FormData();

  // 🎥 VIDEO
  formData.append('media_key1', {
    uri: `file://${videoPath}`,
    type: 'video/mp4',
    name: 'video_selfie.mp4',
  });
  // 🖼 PHOTO
  if (photoPath) {
    formData.append('media_key2', {
      uri: `file://${photoPath}`,
      type: 'image/jpeg',
      name: 'photo_selfie.jpg',
    });
  }

  // 📄 PAYLOAD
  formData.append(
    'payload',
    JSON.stringify({
      'media:meta_data': {
        media_key1: { foo: 'bar2' },
        media_key2: { foo2: 'bar3' },
      },
      'media:tags': {
        media_key1: [
          'video_selfie',
          'video_selfie_blank',
          'orientation_portrait',
        ],
        media_key2: ['photo_selfie'],
      },
    })
  );

  const res = await fetch(
    `${HOST}/api/folders/${folderId}/media/`,
    {
      method: 'POST',
      headers: {
        'X-Forensic-Access-Token': accessToken,
      },
      body: formData,
    }
  );

  const text = await res.text();
  console.log('UPLOAD RAW RESPONSE:', text);

  if (!res.ok) {
    throw new Error(text || 'Upload failed');
  }

  return JSON.parse(text);
}
