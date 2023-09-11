import { getAlgoResults } from "@/lib/prisma/algoRuns";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'GET') {
    try {
      const { runs, error } = await getAlgoResults()
      if (error) throw new Error(error.message)
      return res.status(200).json({ runs })
    } catch (error) {
      console.log('API Error: ', error)
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  res.setHeader('allow', ['GET'])
  res.status(425).end(`Method ${req.method} is not allowed`)
}
export default handler;
