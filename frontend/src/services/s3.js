const BUCKET = 'my-bucket'
const PUBLIC_URL = 'https://br-little-silence-ay1dufr1.storage.c-5.us-east-2.aws.neon.tech'
const ACCESS_KEY = 'nak_live_99f87e5f2c414dffba68dc09761318a4'
const SECRET_KEY = 'nsk_live_93d3d7b9aad59d1ffddd3b9919a503b486158b6f4c6460a57da3ed1812c26097'

function getExtension(filename) {
  if (!filename || !filename.includes('.')) return ''
  return filename.substring(filename.lastIndexOf('.'))
}

export async function uploadToS3(file, folder) {
  const key = `${folder}/${crypto.randomUUID()}${getExtension(file.name)}`

  const response = await fetch(`${PUBLIC_URL}/${BUCKET}/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Authorization': 'Basic ' + btoa(`${ACCESS_KEY}:${SECRET_KEY}`),
    },
    body: file,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`S3 upload failed: ${response.status} ${text}`)
  }

  return {
    imageUrl: `${PUBLIC_URL}/${BUCKET}/${key}`,
  }
}
