import { RoBERTaPrompt } from './types';

function handleFactCheckToolResults(rawFactCheckToolResults, query: string) {
  const factCheckToolPrompts = { factCheckTool: [] };
  rawFactCheckToolResults.claims.map((claim) => {
    factCheckToolPrompts.factCheckTool.push([query, claim.claimReview[0].title]);
  });
  return factCheckToolPrompts;
}

function handleGuardianSearch(rawGuardianSearchResults, query: string) {
  // layout for guardian: response.results[].webTitle/webUrl...
  const guardianSearchPrompts = { guardianSearch: [] };
  rawGuardianSearchResults.response.results.map((result) => {
    guardianSearchPrompts.guardianSearch.push([query, result.webTitle]);
  });
  return guardianSearchPrompts;
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
  const prompts: RoBERTaPrompt[] = [];
  rawFetchedData.map((dataEntry) => {
    // handle FactCheckTool:
    if ('factCheckTool' in dataEntry) {
      return prompts.push(handleFactCheckToolResults(dataEntry.factCheckTool, query));
    }

    // handle duckDuckGo:
    if ('duckDuckGo' in dataEntry) {
    }

    // handle wikipedia:
    if ('wikipedia' in dataEntry) {
    }

    // handle guardianSearch:
    if ('guardianSearch' in dataEntry) {
      return prompts.push(handleGuardianSearch(dataEntry.guardianSearch, query));
    }

    // handle nyt:

    // handle newsapi
  });
  console.log("PROMPTS: ", prompts)
}
