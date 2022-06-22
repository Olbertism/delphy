import { RoBERTaPrediction, RoBERTaPrompt } from './types';

// text sanitizer for prompt generation
function strip(html: string){
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}



function handleFactCheckTool(rawFactCheckToolResults: { claims: any[]; }, query: string) {
  const factCheckToolPrompts: { factCheckTool: RoBERTaPrompt[]} = { factCheckTool: []};
  try {
    rawFactCheckToolResults.claims.map((claim) => {
      factCheckToolPrompts.factCheckTool.push([
        query,
        strip(claim.claimReview[0].title), // for simplicity, only use the first one
      ]);
    });
  } catch(error: any) {
    console.log("Unable to process FactCheckTool results. this might indicate, that the API response shape has changed. Error: ", error)
    return;
  }

  return factCheckToolPrompts;
}

function handleDuckDuckGo(rawDuckDuckGoResults, query: string) {
  const duckDuckGoPrompts = { duckDuckGo: [] };
  rawDuckDuckGoResults.RelatedTopics.map((result) => {
    duckDuckGoPrompts.duckDuckGo.push([query, strip(result.Text)]);
  });
  return duckDuckGoPrompts;
}

function handleWikipedia(rawWikipediaResults, query: string) {
  const wikipediaPrompts = { wikipedia: [] };
  rawWikipediaResults.query.search.map((result) => {
    wikipediaPrompts.wikipedia.push([query, strip(result.snippet)]);
  });
  return wikipediaPrompts;
}

function handleGuardianSearch(rawGuardianSearchResults, query: string) {
  // layout for guardian: response.results[].webTitle/webUrl...
  const guardianSearchPrompts = { guardianSearch: [] };
  rawGuardianSearchResults.response.results.map((result) => {
    guardianSearchPrompts.guardianSearch.push([query, strip(result.webTitle)]);
  });
  return guardianSearchPrompts;
}

function handleNyt(rawNytResults, query: string) {
  const nytPrompts = { nyt: [] };
  rawNytResults.response.docs.map((doc) => {
    nytPrompts.nyt.push([query, strip(doc.abstract)]);
  });
  return nytPrompts;
}

function handleNewsapi(rawNewsapiResults, query: string) {
  const limit = 10
  const newsapiPrompts = { newsapi: [] };

  for (let i=0; i < limit; i++) {
    newsapiPrompts.newsapi.push([query, strip(rawNewsapiResults.articles[i].description)])
  }


  /* rawNewsapiResults.articles.map((article, index) => {
    if (index > limit) {
      return;
    }
    return newsapiPrompts.newsapi.push([query, strip(article.description)]);
  }); */
  return newsapiPrompts;
}

export default function generateRoBERTaPrompts(
  rawFetchedData: any,
  query: string,
) {
  // shape of rawFetchedDate: [ {...} ]
  // wiki: Go into first Wiki results, grab intro summary, put intro summary into prompt

  // newsapi, guardian, nyt: grab first couple of results

  // layout for newsapi: articles[].title/description/

  // output prompts should look like: [{ source.name: [[query, source.result[0]], [query, source.result[0]]}]

  // so, this approach works, but i am unsure if its a good one

  // TODO sanitize query
  const prompts: RoBERTaPrompt[] = [];

  rawFetchedData.map((dataEntry) => {
    // handle FactCheckTool:
    if ('factCheckTool' in dataEntry) {
      return prompts.push(
        handleFactCheckTool(dataEntry.factCheckTool, query),
      );
    }

    // handle duckDuckGo:
    if ('duckDuckGo' in dataEntry) {
      return prompts.push(handleDuckDuckGo(dataEntry.duckDuckGo, query));
    }

    // handle wikipedia:
    if ('wikipedia' in dataEntry) {
      return prompts.push(handleWikipedia(dataEntry.wikipedia, query));
    }

    // handle guardianSearch:
    if ('guardianSearch' in dataEntry) {
      return prompts.push(
        handleGuardianSearch(dataEntry.guardianSearch, query),
      );
    }

    // handle nyt:
    if ('nyt' in dataEntry) {
      return prompts.push(handleNyt(dataEntry.nyt, query));
    }

    // handle newsapi
    if ('newsapi' in dataEntry) {
      return prompts.push(handleNewsapi(dataEntry.newsapi, query));
    }
  });
  console.log('PROMPTS: ', prompts);
  return prompts
}


export function combinePredictionsAndResources(predictions: RoBERTaPrediction, resources) {
  const combinedResources = resources.slice()
  combinedResources.forEach(resource => {

  });

}