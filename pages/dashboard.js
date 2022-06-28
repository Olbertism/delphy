import { useEffect, useRef, useState } from 'react';
import FactCheckToolWidget from '../components/dashboard/FactCheckTool';
import NewsWidget from '../components/dashboard/News';
import SearchEngineWidget from '../components/dashboard/SearchEngine';
import WikipediaWidget from '../components/dashboard/Wikipedia';
import { fetchResources } from '../util/fetchers/mainFetcher';
import generateRoBERTaPrompts from '../util/robertaPromptsProcessor';

// useContext

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [robertaPrompts, setRobertaPrompts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [fetchedResources, setFetchedResources] = useState([]);
  const [formattedResources, setFormattedResources] = useState([]);
  const [displayedResources, setDisplayedResources] = useState([]);
  const [loadingRoBERTa, setLoadingRoBERTa] = useState(false);

  console.log('fetchedResources: ', fetchedResources);
  console.log('formattedResources: ', formattedResources);

  const searchQueryInput = useRef(null);

  async function handleFetchResources() {
    const [resources, shortedData] = await fetchResources(searchQuery);
    setFetchedResources(resources);
    setFormattedResources(shortedData);
  }

  async function handleGenerateRoBERTaPrompts() {
    if (fetchedResources.length === 0 || !searchQuery) {
      console.log('Tried to generate prompts without query or resources');
      return;
    }

    const prompts = [];
    for (let resource of formattedResources) {
      for (let entry of resource) {
        prompts.push([searchQuery, entry.promptSource]);
      }
    }

    console.log('prompts handed over: ', prompts);

    // for tests
    const roBERTaRequestBody = {
      prompts: prompts,
      /*  [
      [
          "Mars is a planet",
          "Mars is a planet"
      ],
      [
          "Mars is a planet",
          "Mars is not a planet"
      ]] */
    };
    const fetchedPredictions = await fetch('/api/robertaPredictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roBERTaRequestBody),
    }).then((response) => response.json());
    console.log(fetchedPredictions);

    // call function to combine fetched Resources with fetched Predictions

    const combinedResources = formattedResources.slice();
    for (let sources of combinedResources) {
      for (let source of sources) {
        source.prediction = fetchedPredictions.predictions.shift();
      }
    }

    console.log(combinedResources);
    setDisplayedResources(combinedResources);
    setLoadingRoBERTa(false);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div>
        <section>
        <input
          value={searchQuery}
          ref={searchQueryInput}
          onChange={(event) => {
            setSearchQuery(event.currentTarget.value);
          }}
        />
        <button
          onClick={() => {
            handleFetchResources().catch((error) => {
              console.log(
                'An error occured with one or more fetched resources',
                error,
              );
            });
          }}
        >
          Submit
        </button>
        <div>Make RoBERTa mnli call:</div>
        <button
          onClick={() => {
            setLoadingRoBERTa(true);
            handleGenerateRoBERTaPrompts().catch(() => {
              console.log(
                'An error occured when trying to generate RoBERTa results',
              );
            });
          }}
        >
          Click me
        </button>
        <div>
          {loadingRoBERTa ? (
            <div>loading...</div>
          ) : (
            <div>
              <div hidden={displayedResources.length === 0 ? true : false}>
                Taglines that contradict claim:
              </div>
              <br />
              {displayedResources.map((resource) => {
                return resource.map((source) => {
                  if (source.prediction === 0) {
                    return (
                      <div>
                        <div>{source.title}</div>
                        <div>{source.url}</div>
                      </div>
                    );
                  }
                });
              })}
              <br />
              <br />
              <div hidden={displayedResources.length === 0 ? true : false}>
                Taglines that entail claim:
              </div>
              <br />
              {displayedResources.map((resource) => {
                return resource.map((source) => {
                  if (source.prediction === 2) {
                    return (
                      <div>
                        <div>{source.title}</div>
                        <div>{source.url}</div>
                      </div>
                    );
                  }
                });
              })}
            </div>
          )}
        </div></section>
        <SearchEngineWidget
          query={searchQuery}
          contents={formattedResources.slice(1,2)}
        />
        <WikipediaWidget query={searchQuery} contents={formattedResources.slice(2,3)} />
        <FactCheckToolWidget
          query={searchQuery}
          contents={formattedResources.slice(0,1)}
        />
        <NewsWidget
          query={searchQuery}
          contents={formattedResources.slice(3)}
        />
      </div>
    </main>
  );
}
