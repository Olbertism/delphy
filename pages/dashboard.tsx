/** @jsxImportSource @emotion/react */
import FeedIcon from '@mui/icons-material/Feed';
import HelpIcon from '@mui/icons-material/Help';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StorageIcon from '@mui/icons-material/Storage';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import arrayShuffle from 'array-shuffle';
import Fuse from 'fuse.js';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import DatabaseWidget from '../components/dashboard/DbSearchResults';
import FactCheckToolWidget from '../components/dashboard/FactCheckTool';
import NewsWidget from '../components/dashboard/News';
import WikipediaWidget from '../components/dashboard/Wikipedia';
import CircularIndeterminate from '../components/layout/ProgressCircle';
import {
  cardListItem,
  greenTextHighlight,
  redTextHighlight,
} from '../styles/customStyles';
import {
  getAllClaimsForSearchWithReviews,
  getUserByValidSessionToken,
} from '../util/database/database';
import { fetchResources } from '../util/fetchers/mainFetcher';
import processText from '../util/textProcessor';
import {
  DashboardProps,
  DashboardWidgetDbSearchResults,
  DashboardWidgetPropsContents,
  DbClaim,
  FormattedResource,
} from '../util/types';

export default function Dashboard(props: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const [loadingResources, setLoadingResources] = useState(false);

  const [formattedResources, setFormattedResources] = useState<
    DashboardWidgetPropsContents[][]
  >([]);
  const [evaluation, setEvaluation] = useState('');

  const [modelContradictions, setModelContradictions] = useState<
    FormattedResource[] | Fuse.FuseResult<FormattedResource>[]
  >([]);
  const [modelAgreements, setModelAgreements] = useState<
    FormattedResource[] | Fuse.FuseResult<FormattedResource>[]
  >([]);
  const [displayPredictions, setDisplayPredictions] = useState(false);

  const [loadingRoBERTa, setLoadingRoBERTa] = useState(false);
  const [roBERTaError, setRoBERTaError] = useState('');

  const [dbClaimsSearchResults, setDbClaimsSearchResults] = useState<
    DashboardWidgetDbSearchResults | Fuse.FuseResult<DbClaim>[]
  >([]);

  const [taglineContextAnchorEl, setTaglineContextAnchorEl] =
    useState<null | HTMLElement>(null);
  const taglineContextIsOpen = Boolean(taglineContextAnchorEl);

  const searchQueryInput = useRef(null);

  const dbClaimsSearchIndex = new Fuse<DbClaim>(props.claims, {
    includeScore: true,
    threshold: 0.5,
    keys: ['claimTitle', 'claimDescription'],
  });

  function handleDBSearch() {
    const results = dbClaimsSearchIndex.search(searchQuery);

    if (results.length > 1) {
      const sorteddbClaimsSearchResults = results.sort((resultA, resultB) => {
        if (resultA.score && resultB.score) {
          return resultA.score - resultB.score;
        }
        return 0;
      }) as any;

      setDbClaimsSearchResults(sorteddbClaimsSearchResults);
      return sorteddbClaimsSearchResults;
    }

    setDbClaimsSearchResults(results);
    return results;
  }

  async function handleFetchResources() {
    const dbResults = handleDBSearch();
    const webAPIResults = await fetchResources(searchQuery);
    webAPIResults.push(dbResults);
    setFormattedResources(webAPIResults as DashboardWidgetPropsContents[][]);
    setLoadingResources(false);
  }

  async function handleGenerateRoBERTaPrompts() {
    if (formattedResources.length === 0 || !searchQuery) {
      console.log('Tried to generate prompts without query or resources');
      return;
    }

    const instances = [];
    const processedQuery = processText(searchQuery);
    for (const resource of formattedResources) {
      for (const entry of resource) {
        if (typeof entry.promptSource === 'string') {
          instances.push({
            source: processedQuery,
            comparer: processText(entry.promptSource),
          });
        }
      }
    }

    for (const searchResult of dbClaimsSearchResults) {
      if (searchResult.item.reviews) {
        searchResult.item.reviews.forEach(
          (review: { reviewId: number; reviewTitle: string }) => {
            instances.push({
              source: processedQuery,
              comparer: processText(review.reviewTitle),
            });
          },
        );
      }
    }

    const roBERTaRequestBody = {
      instances: instances,
    };

    const fetchedPredictions = await fetch('/api/robertaPredictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roBERTaRequestBody),
    }).then((response) => response.json());

    if (fetchedPredictions.status === 'error') {
      setRoBERTaError(fetchedPredictions.message);
      setLoadingRoBERTa(false);
      return;
    }

    const webResources = formattedResources.slice(0, -1);
    const dbResources = formattedResources.slice(-1);
    const conclusio = { contradict: 0, agree: 0 };

    const contradictions = [];
    const agreements = [];

    for (const sources of webResources) {
      for (const source of sources) {
        source.prediction = fetchedPredictions.predictions.shift();

        if (source.prediction === 0) {
          contradictions.push(source);
          conclusio.contradict += 1;
        } else if (source.prediction === 2) {
          agreements.push(source);
          conclusio.agree += 1;
        }
      }
    }

    for (const resources of dbResources) {
      for (const resource of resources) {
        if (resource.item.reviews) {
          resource.item.reviews.forEach((review) => {
            review.prediction = fetchedPredictions.predictions.shift();
            const entry = {
              title: review.reviewTitle,
              url: `/database/reviews/${review.reviewId}`,
              fromDB: true,
            };

            if (review.prediction === 0) {
              contradictions.push(entry);
              conclusio.contradict += 1;
            } else if (review.prediction === 2) {
              agreements.push(entry);
              conclusio.agree += 1;
            }
          });
        }
      }
    }

    const contradictionsSearchIndex = new Fuse<FormattedResource>(
      contradictions,
      {
        includeScore: true,
        threshold: 0.9,
        keys: ['title', 'promptSource'],
      },
    );

    const contradictionsSearchResults =
      contradictionsSearchIndex.search(searchQuery);

    const shuffledContradictions = arrayShuffle(contradictionsSearchResults);

    const agreementsSearchIndex = new Fuse(agreements, {
      includeScore: true,
      threshold: 0.9,
      keys: ['title', 'promptSource'],
    });

    const agreementsSearchResults = agreementsSearchIndex.search(searchQuery);

    const shuffledAgreements = arrayShuffle(agreementsSearchResults);

    const modelEvaluation = `The claim seems to ${
      conclusio.contradict > conclusio.agree ? 'contradict' : 'agree'
    } with the found sources (extent: ${
      conclusio.contradict > conclusio.agree
        ? Math.round(
            (conclusio.contradict / (conclusio.contradict + conclusio.agree)) *
              100,
          )
        : Math.round(
            (conclusio.agree / (conclusio.contradict + conclusio.agree)) * 100,
          )
    }%)`;

    setEvaluation(modelEvaluation);
    setModelAgreements(shuffledAgreements);
    setModelContradictions(shuffledContradictions);
    setDisplayPredictions(true);
    setLoadingRoBERTa(false);
  }

  const handleTaglineMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setTaglineContextAnchorEl(event.currentTarget);
  };

  const handleTaglineMenuClose = () => {
    setTaglineContextAnchorEl(null);
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="About the app" />
      </Head>
      <main>
        <Typography variant="h1">Check Claim</Typography>

        <div>
          <section>
            <Grid container spacing={2} sx={{ marginBottom: '40px' }}>
              <Grid item md={6}>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item md={8}>
                      <TextField
                        fullWidth
                        label="Enter a claim"
                        size="small"
                        value={searchQuery}
                        ref={searchQueryInput}
                        onChange={(event) => {
                          setSearchQuery(event.currentTarget.value);
                        }}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          disabled={loadingResources}
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            setDisplayPredictions(false);
                            setLoadingResources(true);
                            // handleDBSearch();
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
                        <Tooltip
                          disableFocusListener
                          title="The entered query will be used to fetch results from news outlets, fact check sites and knowledge bases."
                        >
                          <HelpIcon color="secondary" />
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item md={6} />
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    mb: '40px',
                  }}
                >
                  <Typography>Check claim against search results</Typography>
                  <Button
                    disabled={
                      (formattedResources.length === 0 ? true : false) ||
                      loadingRoBERTa
                    }
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setRoBERTaError('');
                      setDisplayPredictions(false);
                      setLoadingRoBERTa(true);
                      handleGenerateRoBERTaPrompts().catch(() => {
                        console.log(
                          'An error occured trying to generate RoBERTa results',
                        );
                        setRoBERTaError('No valid response received');
                        setLoadingRoBERTa(false);
                      });
                    }}
                  >
                    Run
                  </Button>
                </Box>
              </Grid>
              <Grid item md={6} />
            </Grid>

            {displayPredictions ? (
              <>
                <Typography>{evaluation}</Typography>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <Typography
                      variant="h3"
                      component="h3"
                      hidden={
                        modelAgreements.length === 0 &&
                        modelContradictions.length === 0
                          ? true
                          : false
                      }
                    >
                      Taglines that{' '}
                      <Box component="span" css={redTextHighlight}>
                        contradict
                      </Box>{' '}
                      claim:
                    </Typography>
                    <List sx={{ width: '100%', maxWidth: 600 }}>
                      {modelContradictions.map((source) => {
                        return (
                          <ListItem
                            alignItems="flex-start"
                            key={source.item.title}
                            css={cardListItem}
                          >
                            <ListItemIcon>
                              {source.item.fromDB ? (
                                <StorageIcon />
                              ) : (
                                <FeedIcon />
                              )}
                            </ListItemIcon>

                            <ListItemText
                              primary={source.item.title}
                              secondary={
                                <Link
                                  href={source.item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {source.item.url}
                                </Link>
                              }
                            />
                            <IconButton
                              aria-label="tagline-context-menu"
                              onClick={handleTaglineMenuClick}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="basic-menu"
                              anchorEl={taglineContextAnchorEl}
                              open={taglineContextIsOpen}
                              onClose={handleTaglineMenuClose}
                              MenuListProps={{
                                'aria-labelledby': 'tagline-context-button',
                              }}
                            >
                              <MenuItem
                                disabled
                                onClick={handleTaglineMenuClose}
                              >
                                Add to Database
                              </MenuItem>
                              <MenuItem
                                disabled
                                onClick={handleTaglineMenuClose}
                              >
                                Feedback on evaluation
                              </MenuItem>
                            </Menu>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                  <Grid item md={6}>
                    <Typography
                      variant="h3"
                      component="h3"
                      hidden={
                        modelAgreements.length === 0 &&
                        modelContradictions.length === 0
                          ? true
                          : false
                      }
                    >
                      Taglines that{' '}
                      <Box component="span" css={greenTextHighlight}>
                        agree
                      </Box>{' '}
                      with claim:
                    </Typography>
                    <List sx={{ width: '100%', maxWidth: 600 }}>
                      {modelAgreements.map((source) => {
                        return (
                          <ListItem
                            alignItems="flex-start"
                            key={source.item.title}
                            css={cardListItem}
                          >
                            <ListItemIcon>
                              <FeedIcon />
                            </ListItemIcon>

                            <ListItemText
                              primary={source.item.title}
                              secondary={
                                <Link
                                  href={source.item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {source.item.url}
                                </Link>
                              }
                            />
                            <IconButton aria-label="tagline-context-menu">
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="basic-menu"
                              anchorEl={taglineContextAnchorEl}
                              open={taglineContextIsOpen}
                              onClose={handleTaglineMenuClose}
                              MenuListProps={{
                                'aria-labelledby': 'tagline-context-button',
                              }}
                            >
                              <MenuItem
                                disabled
                                onClick={handleTaglineMenuClose}
                              >
                                Add to Database
                              </MenuItem>
                              <MenuItem
                                disabled
                                onClick={handleTaglineMenuClose}
                              >
                                Feedback on evaluation
                              </MenuItem>
                            </Menu>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
              </>
            ) : null}

            <div>
              {loadingRoBERTa ? (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      mb: '30px',
                    }}
                  >
                    <CircularIndeterminate />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      mb: '30px',
                    }}
                  >
                    <Typography variant="body2" sx={{ mt: '10px' }}>
                      This can take up to 15 seconds
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: '40px' }}>
                    <Grid item md={6}>
                      <Skeleton variant="text" />
                    </Grid>
                    <Grid item md={6}>
                      <Skeleton variant="text" />
                    </Grid>
                  </Grid>
                </>
              ) : null}
            </div>
            {roBERTaError !== '' ? <p>{roBERTaError}</p> : null}
          </section>
          {loadingResources ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                mb: '20px',
              }}
            >
              <CircularIndeterminate />
            </Box>
          ) : null}
          {formattedResources.length === 0 ? null : (
            <Box sx={{ flexGrow: 1, mb: '30px' }}>
              <Grid container spacing={2}>
                <Grid item sm={12} md={4}>
                  <DatabaseWidget contents={dbClaimsSearchResults} />
                </Grid>
                <Grid item sm={12} md={8}>
                  <FactCheckToolWidget contents={formattedResources[0]} />
                </Grid>
                <Grid item sm={12} md={8}>
                  <NewsWidget contents={formattedResources[3]} />
                </Grid>
                <Grid item sm={12} md={4}>
                  <WikipediaWidget contents={formattedResources[2]} />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* <SearchEngineWidget
          query={searchQuery}
          contents={formattedResources.slice(1, 2)}
        /> */}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const currentUser = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!currentUser) {
    return {
      redirect: { destination: '/', permanent: false }, // a next js thing, adapt returnTo as needed
    };
  }

  const claims = await getAllClaimsForSearchWithReviews();

  return { props: { claims: claims } };
}
