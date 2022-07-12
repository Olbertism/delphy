import { DashboardWidgetPropsContents } from '../types';

// text sanitizer for prompt generation
function strip(html: string) {
  // const string  = html.replace(/[ –]/, '')
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

// unified shape:
// [{title: 'xyz', url: 'https...', promptSource: 'blabla'}]

function formatGoogleFactCheckToolResults(rawResponse: {
  error: { message: any };
  claims: any;
}) {
  if ('error' in rawResponse) {
    console.log('Google FactCheckTool responded with error');
    try {
      console.log(rawResponse.error.message);
    } catch (error) {
      console.log(error);
    }
    return [];
  }
  const unifiedOutput = [];
  try {
    for (let claim of rawResponse.claims) {
      let entry = {
        title: claim.claimReview[0].title,
        url: claim.claimReview[0].url,
        promptSource: strip(claim.claimReview[0].title),
      };
      if (!['', undefined].some((i) => Object.values(entry).includes(i))) {
        unifiedOutput.push(entry);
      }
      /* if (!Object.values(entry).includes(undefined)) {
        unifiedOutput.push(entry);
      } */
    }
  } catch (error) {
    console.log('Error with processing of GoogleFactCheckToolResults');
    console.log(error);
  }
  return unifiedOutput;
}

function formatDuckDuckGoResults(rawResponse: { RelatedTopics: any }) {
  const unifiedOutput = [] as DashboardWidgetPropsContents[];
  try {
    for (let topic of rawResponse.RelatedTopics) {
      unifiedOutput.push({
        title: topic.Text as string,
        url: topic.FirstURL as string,
        promptSource: strip(topic.Text),
      });
    }
  } catch (error) {
    console.log('Something went wrong when processing duckDuckGo response');
    console.log(error);
  }
  return unifiedOutput;
}

function formatWikipediaResults(rawResponse: {
  error: { info: any };
  query: any;
}) {
  if ('error' in rawResponse) {
    console.log('Wikipedia API responded with error');
    try {
      console.log(rawResponse.error.info);
    } catch (error) {
      console.log(error);
    }
    return [];
  }
  const unifiedOutput = [];
  for (let result of rawResponse.query.search) {
    unifiedOutput.push({
      title: result.title,
      url: `http://en.wikipedia.org/?curid=${result.pageid}`,
      promptSource: strip(result.snippet),
    });
  }
  return unifiedOutput;
}

function formatGuardianSearchResults(rawResponse: {
  response: { results: any };
}) {
  const unifiedOutput = [];
  try {
    for (let result of rawResponse.response.results) {
      unifiedOutput.push({
        title: result.webTitle,
        url: result.webUrl,
        promptSource: strip(result.webTitle),
      });
    }
  } catch (error) {
    console.log('Guardian API response could not be processed');
    console.log(error);
  }
  return unifiedOutput;
}

function formatNytResults(rawResponse: {
  fault: { faultstring: any };
  response: { docs: any };
}) {
  if ('fault' in rawResponse) {
    console.log('NYT api responded with error');
    try {
      console.log(rawResponse.fault.faultstring);
    } catch (error) {
      console.log(error);
    }
    return [];
  }
  const unifiedOutput = [];
  for (let doc of rawResponse.response.docs) {
    unifiedOutput.push({
      title: doc.abstract,
      url: doc.web_url,
      promptSource: strip(doc.abstract),
    });
  }
  return unifiedOutput;
}

function formatNewsapiResults(rawResponse: {
  status: string;
  message: any;
  articles: any;
}) {
  if (rawResponse.status === 'error') {
    console.log('News api responded with error');
    try {
      console.log(rawResponse.message);
    } catch (error) {
      console.log(error);
    }
    return [];
  }
  const unifiedOutput = [];
  let count = 0;
  for (let article of rawResponse.articles) {
    if (count > 10) {
      return unifiedOutput;
    }
    unifiedOutput.push({
      title: article.title,
      url: article.url,
      promptSource: strip(article.description),
    });
    count++;
  }
  return unifiedOutput;
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
    url:
      '/api/data-fetchers/factCheckTool?' +
      new URLSearchParams(params).toString(),
  });

  // DuckDuckGoInstantAnswer
  sources.push({
    name: 'duckDuckGo',
    url:
      '/api/data-fetchers/duckDuckGo?' + new URLSearchParams(params).toString(),
  });

  // Wikipedia
  sources.push({
    name: 'wikipedia',
    url:
      '/api/data-fetchers/wikipedia?' + new URLSearchParams(params).toString(),
  });

  // GuardianAPI
  sources.push({
    name: 'guardianSearch',
    url:
      '/api/data-fetchers/guardianSearch?' +
      new URLSearchParams(params).toString(),
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
      url:
        '/api/data-fetchers/newsapi?' + new URLSearchParams(params).toString(),
    });
  }

  const responses = await Promise.all(
    sources.map(async (source) => {
      const response = await fetch(source.url);
      return { [source.name]: await response.json() };
    }),
  );

  console.log(responses);
  const shortedData = [] as DashboardWidgetPropsContents[][];
  shortedData.push(
    formatGoogleFactCheckToolResults(responses[0].factCheckTool),
  );
  shortedData.push(formatDuckDuckGoResults(responses[1].duckDuckGo));
  shortedData.push(formatWikipediaResults(responses[2].wikipedia));
  shortedData.push(formatGuardianSearchResults(responses[3].guardianSearch));
  shortedData.push(formatNytResults(responses[4].nyt));
  shortedData.push(formatNewsapiResults(responses[5].newsapi));

  console.log(shortedData);
  return [responses, shortedData];
}
