import { Box, Button, Grid, TextField } from '@mui/material';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';
import DatabaseWidget from '../components/dashboard/DbSearchResults';
import FactCheckToolWidget from '../components/dashboard/FactCheckTool';
import NewsWidget from '../components/dashboard/News';
import SearchEngineWidget from '../components/dashboard/SearchEngine';
import WikipediaWidget from '../components/dashboard/Wikipedia';
import CircularIndeterminate from '../components/layout/ProgressCircle';
import { getAllClaimsForSearch } from '../util/database/database';
import { fetchResources } from '../util/fetchers/mainFetcher';
import generateRoBERTaPrompts from '../util/robertaPromptsProcessor';

// useContext

type DbClaim = {
  id: number;
  title: string;
  description: string;
};

type DashboardProps = {
  claims: DbClaim[];
};

export default function Dashboard(props: DashboardProps) {
  console.log('dashboard props', props);

  const [searchQuery, setSearchQuery] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [robertaPrompts, setRobertaPrompts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [fetchedResources, setFetchedResources] = useState([]);
  const [formattedResources, setFormattedResources] = useState([]);
  const [displayedResources, setDisplayedResources] = useState([]);
  const [loadingRoBERTa, setLoadingRoBERTa] = useState(false);
  const [dbClaimsSearchResults, setDbClaimsSearchResults] =
    useState<FuseResult>([]);

  console.log('fetchedResources: ', fetchedResources);
  console.log('formattedResources: ', formattedResources);

  const searchQueryInput = useRef(null);

  const dbClaimsSearchIndex = new Fuse<DbClaim>(props.claims, {
    includeScore: true,
    threshold: 0.4,
    keys: ['title', 'description'],
  });

  function handleDBSearch() {
    const results = dbClaimsSearchIndex.search(searchQuery);
    console.log('fuse results', results);
    const sorteddbClaimsSearchResults = results.sort((resultA, resultB) => {
      return resultA.score - resultB.score;
    });
    console.log('sorted Fuse results', sorteddbClaimsSearchResults);
    setDbClaimsSearchResults(sorteddbClaimsSearchResults);
  }

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
      <h1>Check Claim</h1>
      <div>
        <section>
          <Grid container spacing={2} sx={{ marginBottom: '40px' }}>
            <Grid item md={6}>
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <TextField
                  label="Enter a claim"
                  size="small"
                  value={searchQuery}
                  ref={searchQueryInput}
                  onChange={(event) => {
                    setSearchQuery(event.currentTarget.value);
                  }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    handleDBSearch();
                    handleFetchResources().catch((error) => {
                      console.log(
                        'An error occured with one or more fetched resources',
                        error,
                      );
                    });
                  }}
                >
                  Search
                </Button>
              </Box>
            </Grid>

            <Grid item md={6} />
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Box sx={{ display: 'flex', gap: '20px',  alignItems: "center" }}>
                <div>Check claim against search results</div>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setLoadingRoBERTa(true);
                    handleGenerateRoBERTaPrompts().catch(() => {
                      console.log(
                        'An error occured trying to generate RoBERTa results',
                      );
                    });
                  }}
                >
                  Run
                </Button>
              </Box>
            </Grid>
            <Grid item md={6} />
          </Grid>

          <div>
            {loadingRoBERTa ? (
              <CircularIndeterminate />
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
          </div>
        </section>
        {formattedResources.length === 0 ? (
          <div />
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={4}>
                <DatabaseWidget contents={dbClaimsSearchResults} />
              </Grid>
              <Grid item sm={12} md={8}>
                <FactCheckToolWidget
                  query={searchQuery}
                  contents={formattedResources.slice(0, 1)}
                />
              </Grid>
              <Grid item sm={12} md={8}>
                <NewsWidget
                  query={searchQuery}
                  contents={formattedResources.slice(3)}
                />
              </Grid>
              <Grid item sm={12} md={4}>
                <WikipediaWidget
                  query={searchQuery}
                  contents={formattedResources.slice(2, 3)}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <SearchEngineWidget
          query={searchQuery}
          contents={formattedResources.slice(1, 2)}
        />
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const claims = await getAllClaimsForSearch();

  return { props: { claims: claims } };
}
