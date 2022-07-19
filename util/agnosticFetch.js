const fetch = require('node-fetch');

async function getResources(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
module.exports = {
  getResources,
};
