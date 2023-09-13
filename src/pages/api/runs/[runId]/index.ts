import { getAlgoResultById } from "@/lib/prisma/algoRuns";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {

      const { run, error } = await getAlgoResultById(req.query.runId as string)
      if (error) throw new Error(error.message)
      return res.status(200).json({ run })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  res.setHeader('allow', ['GET'])
  res.status(425).end(`Method ${req.method} is not allowed`)
}

export default handler;