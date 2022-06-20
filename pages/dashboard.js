import { useEffect, useRef, useState } from 'react';
import FactCheckToolWidget from '../components/dashboard/FactCheckTool';
import NewsWidget from '../components/dashboard/News';
import SearchEngineWidget from '../components/dashboard/SearchEngine';
import WikipediaWidget from '../components/dashboard/Wikipedia';

// heres the plan: I am going to fetch data centralized here, makes it easier to process it. Only then I send down the results to the child components

// useContext

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [robertaTest, setRobertaTest] = useState([]);
  const [predictions, setPredictions] = useState([]);

  console.log('prompts: ', robertaTest);
  console.log('predictions: ', predictions);

  const searchQueryInput = useRef(null);

  async function fetchDataFromContentAPIs(query) {
    const params = {
      query: query,
    };

    /*  const data = await fetch(
      '/api/guardianSearch?' + new URLSearchParams(params).toString(),
    );

    const results = await data.json();
    console.log('Guardian data in dashboard: ', results); */

    const dataFCT = await fetch(
      '/api/factCheckTool?' + new URLSearchParams(params).toString(),
      /* new URLSearchParams({
        query: props.query,
      }), */
    );
    const resultsFCT = await dataFCT.json();
    console.log(resultsFCT);

    

    const titles = [];
    for (let result of resultsFCT.claims) {
      console.log(result.claimReview[0].title);
      const stringifiedTitle = String(result.claimReview[0].title);
      titles.push([query, stringifiedTitle]);
    }

    setRobertaTest(titles);
  }

  useEffect(() => {
    async function makeTestRequest() {
      const requestBody = { prompts: robertaTest };
      // dev URL only!
      const apiBaseUrl = 'http://127.0.0.1:5000/predict';
      const data = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }).then((response) => response.json());
      console.log(data);
      setPredictions(data);
      // return data;
    }
    if (robertaTest !== []) {
      makeTestRequest();
    }
  }, [robertaTest]);

  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        <input
          defaultValue={searchQuery}
          ref={searchQueryInput}
          onChange={() => {}}
        />
        <button
          onClick={() => {
            setSearchQuery(searchQueryInput.current.value);
            fetchDataFromContentAPIs(searchQueryInput.current.value);
          }}
        >
          Submit
        </button>
        <div>Make RoBERTa mnli call:</div>
        <button>Click me</button>
        {/* {predictions.predictions !== [] ? (
          <div>
            {predictions.predictions.map((prediction) => {
              return <div key={prediction}>{prediction}</div>;
            })}
          </div>
        ) : (
          <div />
        )} */}
        <SearchEngineWidget query={searchQuery} />
        <WikipediaWidget query={searchQuery} />
        <FactCheckToolWidget query={searchQuery} />
        <NewsWidget query={searchQuery} />
      </div>
    </main>
  );
}
