import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = Record<string, string | undefined>

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  res.status(200).json({
    apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FCM_STRORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER,
    appId: process.env.NEXT_PUBLIC_FCM_APP_ID
  })
}
