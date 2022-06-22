import { request } from 'http';
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

  /*
  console.log('predictions: ', predictions); */
  console.log('fetchedResources: ', fetchedResources);
  console.log('formattedResources: ', formattedResources);
  // console.log('prompts: ', robertaPrompts);
  const searchQueryInput = useRef(null);

  async function handleFetchResources() {
    const [resources, shortedData] = await fetchResources(searchQuery);
    //.catch(() => {
    //  console.log('One or more errors occured when trying to fetch data');
    //});
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

    // const prompts = generateRoBERTaPrompts(fetchedResources, searchQuery);

    console.log('prompts handed over: ', prompts);
    // setRobertaPrompts(prompts);

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
  }

  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        <input
          value={searchQuery}
          ref={searchQueryInput}
          onChange={(event) => {
            setSearchQuery(event.currentTarget.value);
          }}
        />
        <button
          onClick={() => {
            handleFetchResources(); //.catch(() => {
            //console.log(
            //</div>  'One or more errors occured when trying to fetch data',
            //);
            //});
          }}
        >
          Submit
        </button>
        <div>Make RoBERTa mnli call:</div>
        <button
          onClick={() => {
            handleGenerateRoBERTaPrompts();
          }}
        >
          Click me
        </button>
        <div>
          {displayedResources.map((resource) => {
            return resource.map((source) => {
              if (source.prediction === 0) {
                return (
                  <div>
                    <div>{source.title}</div>
                    <div>{source.url}</div>
                    <div>Tagline contradicts claim</div>
                  </div>
                );
              } else if (source.prediction === 2) {
                return (
                  <div>
                    <div>{source.title}</div>
                    <div>{source.url}</div>
                    <div>Tagline entails claim</div>
                  </div>
                );
              }
            });
          })}
        </div>
        {/* {predictions.predictions !== [] ? (
          <div>
            {predictions.predictions.map((prediction) => {
              return <div key={prediction}>{prediction}</div>;
            })}
          </div>
        ) : (
          <div />
        )} */}
        <SearchEngineWidget query={searchQuery} contents={fetchedResources} />
        <WikipediaWidget query={searchQuery} />
        <FactCheckToolWidget query={searchQuery} />
        <NewsWidget query={searchQuery} />
      </div>
    </main>
  );
}
