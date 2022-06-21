import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (typeof req.query.query !== 'string') {
    res.status(400).json({
      errors: [{ message: 'Invalid query type for API request' }],
    });
    return;
  }

  // https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=yourkey
  const apiBaseUrl =
    'https://api.nytimes.com/svc/search/v2/articlesearch.json?';

  console.log(process.env.NYTAPI)

  console.log(
    `${apiBaseUrl}q=${encodeURIComponent(req.query.query)}&api-key=${
      process.env.NYTAPI
    }`,
  );

  const data = await fetch(
    `${apiBaseUrl}q=${encodeURIComponent(req.query.query)}&api-key=${
      process.env.NYTAPI
    }`,
  ).then((response) => response.json());

  res.json(data); // Send the response
}
