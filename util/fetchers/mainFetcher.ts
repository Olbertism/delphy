import arrayShuffle from 'array-shuffle';
import { DashboardWidgetPropsContents, MainFetcherOutput } from '../types';

// text sanitizer for prompt generation
export function strip(html: string) {
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
    for (const claim of rawResponse.claims) {
      const entry = {
        title: claim.claimReview[0].title,
        url: claim.claimReview[0].url,
        promptSource: strip(claim.claimReview[0].title),
      };
      if (!['', undefined].some((i) => Object.values(entry).includes(i))) {
        unifiedOutput.push(entry);
      }
    }
  } catch (error) {
    console.log('Error with processing of GoogleFactCheckToolResults');
    console.log(error);
  }

  const uniqueOutput = [
    ...unifiedOutput
      .reduce((map, obj) => map.set(obj.title, obj), new Map())
      .values(),
  ];
  return uniqueOutput;
}

function formatDuckDuckGoResults(rawResponse: { RelatedTopics: any }) {
  const unifiedOutput = [];
  try {
    for (const topic of rawResponse.RelatedTopics) {
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

export function formatWikipediaResults(rawResponse: {
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
  let count = 0;
  for (const result of rawResponse.query.search) {
    if (count > 7) {
      return unifiedOutput;
    }
    if (typeof result.snippet === 'string') {
      unifiedOutput.push({
        title: result.title,
        url: `http://en.wikipedia.org/?curid=${result.pageid}`,
        promptSource: strip(result.snippet),
      });
      count++;
    }
  }
  return unifiedOutput;
}

function formatGuardianSearchResults(rawResponse: {
  response: { results: any };
}) {
  const unifiedOutput = [];
  let count = 0;
  try {
    for (const result of rawResponse.response.results) {
      if (count > 4) {
        break;
      }
      if (typeof result.webTitle === 'string') {
        unifiedOutput.push({
          title: result.webTitle,
          url: result.webUrl,
          promptSource: strip(result.webTitle),
        });
        count++;
      }
    }
  } catch (error) {
    console.log('Guardian API response could not be processed');
    console.log(error);
  }
  const uniqueOutput = [
    ...unifiedOutput
      .reduce((map, obj) => map.set(obj.title, obj), new Map())
      .values(),
  ];
  return uniqueOutput;
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
  let count = 0;
  for (const doc of rawResponse.response.docs) {
    if (count > 4) {
      break;
    }
    if (typeof doc.abstract === 'string') {
      unifiedOutput.push({
        title: doc.abstract,
        url: doc.web_url,
        promptSource: strip(doc.abstract),
      });
      count++;
    }
  }

  const uniqueOutput = [
    ...unifiedOutput
      .reduce((map, obj) => map.set(obj.title, obj), new Map())
      .values(),
  ];
  return uniqueOutput;
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
  for (const article of rawResponse.articles) {
    if (count > 9) {
      break;
    }
    if (typeof article.description === 'string') {
      unifiedOutput.push({
        title: article.title,
        url: article.url,
        promptSource: strip(article.description),
      });
      count++;
    }
  }

  const uniqueOutput = [
    ...unifiedOutput
      .reduce((map, obj) => map.set(obj.title, obj), new Map())
      .values(),
  ];
  return uniqueOutput;
}

const collectAndShuffleResults = (
  nestedArray: DashboardWidgetPropsContents[][],
) => {
  const outputArray = [] as DashboardWidgetPropsContents[];
  nestedArray.map((subarray) => {
    return subarray.map((entry) => {
      return outputArray.push(entry);
    });
  });
  const shuffledArray = arrayShuffle(outputArray);
  return shuffledArray;
};

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
  const shortedData = [] as MainFetcherOutput[];
  shortedData.push(
    formatGoogleFactCheckToolResults(responses[0].factCheckTool),
  );
  shortedData.push(formatDuckDuckGoResults(responses[1].duckDuckGo));
  shortedData.push(formatWikipediaResults(responses[2].wikipedia));
  shortedData.push(
    collectAndShuffleResults([
      formatGuardianSearchResults(responses[3].guardianSearch),
      formatNytResults(responses[4].nyt),
      formatNewsapiResults(responses[5].newsapi),
    ]),
  );

  console.log(shortedData);
  return shortedData;
}
