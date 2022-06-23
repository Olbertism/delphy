export default async function handler(req, res) {
  const apiBaseUrl = 'https://content.guardianapis.com/search?page-size=5&';

  console.log( `${apiBaseUrl}q=${encodeURIComponent(req.query.query)}&api-key=${
    process.env.GUARDIANAPI
  }`)

  const data = await fetch(
    `${apiBaseUrl}q=${encodeURIComponent(req.query.query)}&api-key=${
      process.env.GUARDIANAPI
    }`,
  ).then((response) => response.json());

  res.json(data); // Send the response
}
