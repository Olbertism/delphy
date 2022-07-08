import { NextApiRequest, NextApiResponse } from 'next';
import { RoBERTaPrompt } from '../../util/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.body);
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  // dev URL
  const apiBaseUrl = `http://127.0.0.1:5000/predict?api-key=${process.env.ROBERTAKEY}`;
  //prod URL NOT WORKING!
  // const apiBaseUrl = `https://roberta-mnli.herokuapp.com/predict?api-key=${process.env.ROBERTAKEY}`;

  const data = await fetch(apiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  }).then((response) => response.json());

  console.log(data);
  console.log("after data log")

  try {
    res.json(data); // Send the response
  } catch(error) {
    console.log("IN CUSTOM ERROR HANDLING")
    console.log(error)
    res.json({status: "error", message: "No valid response received"})
  }
}
