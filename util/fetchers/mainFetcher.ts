export async function fetchResources(
  query: string,
  excludeLimitedAPIs: boolean = false,
) {
  console.log('Starting fetch all...');

  const sources = [];
  const params = {
    query: query,
  };

  console.log('using query: ', params.query);

  // FactcheckTool
  sources.push({
    name: 'factCheckTool',
    url: '/api/factCheckTool?' + new URLSearchParams(params).toString(),
  });

  // DuckDuckGoInstantAnswer
  sources.push({
    name: 'duckDuckGo',
    url: '/api/duckDuckGo?' + new URLSearchParams(params).toString(),
  });

  // Wikipedia
  sources.push({
    name: 'wikipedia',
    url: '/api/wikipedia?' + new URLSearchParams(params).toString(),
  });

  // GuardianAPI
  sources.push({
    name: 'guardianSearch',
    url: '/api/guardianSearch?' + new URLSearchParams(params).toString(),
  });

  // NYT
  sources.push({
    name: 'nyt',
    url: '/api/nyt?' + new URLSearchParams(params).toString(),
  });

  if (!excludeLimitedAPIs) {
    // NewsAPI - limit is 100 per day
    sources.push({
      name: 'newsapi',
      url: '/api/newsapi?' + new URLSearchParams(params).toString(),
    });
  }

  const responses = await Promise.all(
    sources.map(async (source) => {
      const response = await fetch(source.url);
      return {  [source.name]: await response.json() };
    }),
  );

  return responses;
}
