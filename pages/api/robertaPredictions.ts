import { NextApiRequest, NextApiResponse } from 'next';
import { RoBERTaPrompt } from '../../util/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body)
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  // dev URL
  const apiBaseUrl = 'http://127.0.0.1:5000/predict';

  // at some point I might introduce an API key here?

  const data = await fetch(
    apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)}
  )
  .then((response) => response.json());

  console.log(data)
  // const parsedData = await data.json()
  console.log("sending response...")
  res.json(data); // Send the response
}
