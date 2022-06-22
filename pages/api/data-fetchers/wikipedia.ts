import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.query !== "string") {
    res.status(400).json({
      errors: [{ message: 'Invalid query type for API request' }],
    })
    return;
  }
  const apiBaseUrl = 'http://en.wikipedia.org/w/api.php?';
  const apiParams = 'list=search';
  const apiActionMode = 'action=query';

  const data = await fetch(
    `${apiBaseUrl}&origin=*&${apiActionMode}&${apiParams}&srsearch=${encodeURIComponent(
      req.query.query,
  )}&format=json&prop=info&inprop=url`,
  ).then((response) => response.json());

  res.json(data); // Send the response
}
