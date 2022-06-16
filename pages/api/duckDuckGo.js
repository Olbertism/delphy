export default async function handler(req, res) {
  // console.log(req)

  const apiBaseUrl = 'https://api.duckduckgo.com/?';

  console.log(
    `${apiBaseUrl}q=${encodeURIComponent(req.query.query)}&format=json`,
  );

  const data = await fetch(
    `${apiBaseUrl}q=${encodeURIComponent(
      req.query.query,
    )}&format=json&pretty=1`,
  ).then((response) => response.json());

  res.json(data); // Send the response
}
