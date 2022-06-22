// text sanitizer for prompt generation
function strip(html: string){
  // const string  = html.replace(/[ –]/, '')
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

// unified shape:
// [{title: 'xyz', url: 'https...', promptSource: 'blabla'}]

function formatGoogleFactCheckToolResults(rawResponse) {
  if ("error" in rawResponse) {
    console.log("Google FactCheckTool responded with error")
    try {
      console.log(rawResponse.error.message)
    } catch(error) {
      console.log(error)
    }
    return []
  }
  const unifiedOutput = []
  for (let claim of rawResponse.claims) {
    unifiedOutput.push({
      title: claim.claimReview[0].title,
      url: claim.claimReview[0].url,
      promptSource: strip(claim.claimReview[0].title),
    })
  }
  return unifiedOutput
}

function formatDuckDuckGoResults(rawResponse) {
  const unifiedOutput = []
  for (let topic of rawResponse.RelatedTopics) {
    unifiedOutput.push({
      title: topic.Text,
      url: topic.FirstURL,
      promptSource: strip(topic.Text),
    })
  }
  return unifiedOutput
}

function formatWikipediaResults(rawResponse) {
  const unifiedOutput = []
  for (let result of rawResponse.query.search) {
    unifiedOutput.push({
      title: result.title,
      url: `http://en.wikipedia.org/?curid=${result.pageid}`,
      promptSource: strip(result.snippet),
    })
  }
  return unifiedOutput
}

function formatGuardianSearchResults(rawResponse) {
  const unifiedOutput = []
  for (let result of rawResponse.response.results) {
    unifiedOutput.push({
      title: result.webTitle,
      url: result.webUrl,
      promptSource: strip(result.webTitle),
    })
  }
  return unifiedOutput
}

function formatNytResults(rawResponse) {
  const unifiedOutput = []
  for (let doc of rawResponse.response.docs) {
    unifiedOutput.push({
      title: doc.abstract,
      url: doc.web_url,
      promptSource: strip(doc.abstract),
    })
  }
  return unifiedOutput
}

function formatNewsapiResults(rawResponse) {
  if (rawResponse.status === "error") {
    console.log("News api responded with error")
    try {
      console.log(rawResponse.message)
    } catch(error) {
      console.log(error)
    }
    return []
  }
  const unifiedOutput = []
  let count = 0
  for (let article of rawResponse.articles) {
    if (count > 10) {
      return unifiedOutput
    }
    unifiedOutput.push({
      title: article.title,
      url: article.url,
      promptSource: strip(article.description),
    })
    count++;
  }
  return unifiedOutput
}

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
    url: '/api/data-fetchers/factCheckTool?' + new URLSearchParams(params).toString(),
  });

  // DuckDuckGoInstantAnswer
  sources.push({
    name: 'duckDuckGo',
    url: '/api/data-fetchers/duckDuckGo?' + new URLSearchParams(params).toString(),
  });

  // Wikipedia
  sources.push({
    name: 'wikipedia',
    url: '/api/data-fetchers/wikipedia?' + new URLSearchParams(params).toString(),
  });

  // GuardianAPI
  sources.push({
    name: 'guardianSearch',
    url: '/api/data-fetchers/guardianSearch?' + new URLSearchParams(params).toString(),
  });

  // NYT
  sources.push({
    name: 'nyt',
    url: '/api/data-fetchers/nyt?' + new URLSearchParams(params).toString(),
  });

  if (!excludeLimitedAPIs) {
    // NewsAPI - limit is 100 per day
    sources.push({
      name: 'newsapi',
      url: '/api/data-fetchers/newsapi?' + new URLSearchParams(params).toString(),
    });
  }

  const responses = await Promise.all(
    sources.map(async (source) => {
      const response = await fetch(source.url);
      return {  [source.name]: await response.json() };
    }),
  );

  console.log(responses)
  const shortedData = []
  shortedData.push(formatGoogleFactCheckToolResults(responses[0].factCheckTool))
  shortedData.push(formatDuckDuckGoResults(responses[1].duckDuckGo))
  shortedData.push(formatWikipediaResults(responses[2].wikipedia))
  shortedData.push(formatGuardianSearchResults(responses[3].guardianSearch))
  shortedData.push(formatNytResults(responses[4].nyt))
  shortedData.push(formatNewsapiResults(responses[5].newsapi))

  console.log(shortedData)
  return [responses, shortedData];
}
