const apiBaseUrl = 'http://en.wikipedia.org/w/api.php?';
const apiActionMode = 'action=query';
const limit = 'limit=5';

export async function makeWikiSearchRequest(searchString) {
  const apiParams = 'list=search';
  const query = `${apiBaseUrl}&origin=*&${apiActionMode}&${apiParams}&srsearch=${encodeURIComponent(
    searchString,
  )}&${limit}&format=json`;

  const response = await fetch(query);
  const results = await response.json();

  return results;
}
