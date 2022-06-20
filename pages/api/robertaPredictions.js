

export default async function handler(req, res) {
  // console.log(req)

  // dev URL only!
  const apiBaseUrl = 'http://127.0.0.1:5000';

  // at some point I might introduce an API key here?

  const data = await fetch(
    apiBaseUrl, {
      method: 'POST', body: JSON.stringify(req.data)}
  ).then((response) => response.json());

  res.json(data); // Send the response
}
