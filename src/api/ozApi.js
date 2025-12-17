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
    console.log(videoPath)
    const url = `${HOST}/api/folders/`;
      try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'X-Forensic-Access-Token': accessToken,
                'Accept': 'application/json',
            },
             body: JSON.stringify({
                media_key1: ``,
                media_key2:"",
        }),
        });
        const text = await res.text();
        console.log('Server Response:', text);
        if (!res.ok) {
            throw new Error(`Server Error ${res.status}: ${text}`);
        }
        return JSON.parse(text);
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}

export async function uploadMediaFolder_id({
  accessToken,
  videoPath,
  photoPath,
  folder_id,
}) {
  console.log('videoPath:', videoPath);
  console.log('photoPath:', photoPath);
  console.log('folder_id:', folder_id);

  const url = `${HOST}/api/folders/${folder_id}/media/`;
      try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'X-Forensic-Access-Token': accessToken,
                'Accept': 'application/json',
            },
             body: JSON.stringify({
                media_key1: ``,
                media_key2: `file://${photoPath}`}),
        });
        const text = await res.text();
        console.log('Response:', text);
        if (!res.ok) {
            throw new Error(`Server Error ${res.status}: ${text}`);
        }
        return JSON.parse(text);
    } catch (error) {
        console.error('Upload folder_id Error:', error);
        throw error;
    }
}