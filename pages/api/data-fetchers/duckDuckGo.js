export default async function handler(req, res) {
  const apiBaseUrl = 'https://api.duckduckgo.com/?';

  const data = await fetch(
    `${apiBaseUrl}q=${encodeURIComponent(
      req.query.query,
    )}&format=json&pretty=1&t=givemecontext`,
  ).then((response) => response.json());

  res.json(data); // Send the response
}
