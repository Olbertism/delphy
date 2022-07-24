import { AddCircle, FactCheck, Save } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Rating,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import DeleteEntryInterface from '../../../components/database/DeleteButtonAndAlert';
import { theme } from '../../../styles/theme';
import {
  checkAuthorClaimRating,
  checkIfAuthorExists,
  getAllVerdicts,
  getClaimWithAllRelationsById,
  getUserByValidSessionToken,
} from '../../../util/database/database';
import formatDate from '../../../util/formatDate';
import {
  Author,
  DatabaseClaim,
  RatingRequestbody,
  ReviewRequestbody,
  SourceRequestbody,
  Verdict,
} from '../../../util/types';

type Props = {
  refreshUserProfile: () => Promise<void>;
  user: { id: number; username: string; roles: string[] | null };
  claim: DatabaseClaim;
  author: Author | null;
  verdicts: Verdict[];
  rating: number | (() => number | null) | null;
};

export default function ClaimPage(props: Props) {
  const [authorId, setAuthorId] = useState<number | undefined>(
    props.author === null ? undefined : props.author.id,
  );

  const [displayedReviews, setDisplayedReviews] = useState(props.claim.reviews);

  const [addReviewPopup, setAddReviewPopup] = useState(false);
  const [newSourceInput, setNewSourceInput] = useState(false);

  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewDescription, setNewReviewDescription] = useState('');

  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [currentSourceList, setCurrentSourceList] = useState<
    { title: string; url: string }[]
  >([]);
  const [sourceUrlError, setSourceUrlError] = useState(false);

  const [selectedVerdict, setSelectedVerdict] = useState<number | string>('');

  const [displayAlert, setDisplayAlert] = useState(false);

  const [errors, setErrors] = useState<Error[]>([]);

  const [ratings, setRatings] = useState(props.claim.ratings);
  const [avgRating, setAvgRating] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(
    props.rating ? props.rating : null,
  );
  const [userRated, setUserRated] = useState(false);

  const refreshUserProfile = props.refreshUserProfile;

  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);

  const appendError = (error: Error) => {
    const errorList = [...errors, error];
    setErrors(errorList);
  };

  const clearInputs = () => {
    setNewReviewTitle('');
    setNewReviewDescription('');
    setSourceTitle('');
    setSourceUrl('');
    setCurrentSourceList([]);
    setSelectedVerdict('');
  };

  useEffect(() => {
    function calculateRating() {
      if (!ratings) {
        return 0;
      }
      const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      setAvgRating(averageRating);
    }
    calculateRating();
  }, [ratings]);

  const handleAuthorCreation = async () => {
    const response = await fetch('/api/createAuthor');
    const author = await response.json();
    return author;
  };

  const handleReviewCreation = async () => {
    const requestbody: ReviewRequestbody = {
      title: newReviewTitle,
      description: newReviewDescription,
      authorId: undefined, // value is inserted further below
      claimId: props.claim.claimId,
    };

    if (!props.author) {
      const { author } = await handleAuthorCreation();

      if (!author) {
        console.log('An error ocurred while trying to create a new author');
        return;
      }

      requestbody.authorId = author.id;
      setAuthorId(author.id);
    } else {
      requestbody.authorId = authorId;
    }

    if (selectedVerdict !== '') {
      requestbody.verdictId = Number(selectedVerdict);
    }

    const response = await fetch('/api/createReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    const review = await response.json();
    return review;
  };

  const handleSaveSource = () => {
    const updatedSourceList = [
      ...currentSourceList,
      { title: sourceTitle, url: sourceUrl },
    ];
    setCurrentSourceList(updatedSourceList);
    setSourceTitle('');
    setSourceUrl('');
    setNewSourceInput(false);
  };

  const handleSourcesCreation = async (reviewId: number) => {
    for (const source of currentSourceList) {
      const requestbody: SourceRequestbody = {
        sourceTitle: source.title,
        sourceUrl: source.url,
        reviewId: reviewId,
      };

      // const response =
      await fetch('/api/createSource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestbody),
      });
      // const source = await response.json();
    }
  };

  const handleRatingCreation = async (claimId: number, ratingValue: number) => {
    const requestbody: RatingRequestbody = {
      claimId: claimId,
      ratingValue: ratingValue,
      authorId: undefined, // value is inserted further below
    };

    if (!props.author) {
      const { author } = await handleAuthorCreation();

      if (!author) {
        console.log('An error ocurred while trying to create a new author');
        return;
      }

      requestbody.authorId = author.id;
      setAuthorId(author.id);
    } else {
      requestbody.authorId = authorId;
    }

    const response = await fetch('/api/createRating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    const rating = await response.json();
    return rating;
  };

  const handleValidation = () => {
    if (sourceUrl.slice(0, 4) !== 'http') {
      setSourceUrlError(true);
      return false;
    }
    return true;
  };

  const handleAddRatingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddRatingClose = () => {
    setAnchorEl(null);
  };

  const popOverOpen = Boolean(anchorEl);
  const popOverId = popOverOpen ? 'rating-popover' : undefined;

  return (
    <>
      <Head>
        <title>Claim entry</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <Typography variant="subtitle1">
          Claim #{props.claim.claimId}
        </Typography>
        <Typography variant="h1" data-test-id="claim-h1">
          {props.claim.claimTitle}
        </Typography>
        <Typography variant="h3">Description</Typography>
        <Typography>{props.claim.claimDescription}</Typography>
        <Box sx={{ mb: '30px' }}>
          <Typography variant="h3">Associated reviews</Typography>
          {displayedReviews ? (
            <List sx={{ width: '100%' }}>
              {displayedReviews.map((review) => {
                return (
                  <ListItem
                    alignItems="center"
                    key={review.title}
                    disablePadding
                  >
                    <ListItemIcon>
                      <FactCheck />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link href={`/database/reviews/${review.id}`}>
                          {review.title}
                        </Link>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography>No reviews found</Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mb: '30px' }}
          onClick={() => {
            setAddReviewPopup(true);
          }}
        >
          Add a review
        </Button>
        <Typography variant="h3">Added by</Typography>
        <Link href={`/users/${props.claim.username}`}>
          {props.claim.username}
        </Link>
        <Typography>{`Added on ${formatDate(
          props.claim.claimAdded,
        )}`}</Typography>
        <Typography variant="h3">Average rating value</Typography>
        <Typography variant="body2">
          0 - Low credibility / 5 - High credibility
        </Typography>
        <Rating
          name="avg-claim-rating"
          value={avgRating}
          precision={0.5}
          readOnly
        />
        <Typography>
          {ratings
            ? `Number of user ratings: ${ratings.length}`
            : 'No user ratings'}
        </Typography>
        {props.rating || userRated ? (
          <Typography>Your rating {selectedRating}/5</Typography>
        ) : (
          <>
            <Button
              aria-describedby={popOverId}
              variant="contained"
              color="secondary"
              onClick={handleAddRatingClick}
            >
              Add rating
            </Button>
            <Popover
              id={popOverId}
              open={popOverOpen}
              anchorEl={anchorEl}
              onClose={handleAddRatingClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box sx={{ margin: '10px' }}>
                <Rating
                  name="user-rating-for-claim"
                  value={selectedRating}
                  onChange={async (event, newValue) => {
                    setSelectedRating(newValue);
                    const { rating } = await handleRatingCreation(
                      props.claim.claimId,
                      newValue!,
                    );
                    if (ratings) {
                      const updatedRatings = [...ratings, rating.rating];
                      setRatings(updatedRatings);
                    } else {
                      setRatings([rating.rating]);
                    }

                    setUserRated(true);
                  }}
                />
              </Box>
            </Popover>
          </>
        )}
        <Box sx={{ mb: '30px' }}>
          <Typography variant="h3">Labels</Typography>
          {props.claim.labels ? (
            <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {props.claim.labels.map((label) => {
                return (
                  <Chip
                    label={label}
                    key={label}
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      color: 'white',
                    }}
                  />
                );
              })}
            </Box>
          ) : (
            <Typography>No labels associated</Typography>
          )}
        </Box>
        <Box sx={{ mb: '30px' }}>
          {props.claim.username === props.user.username ||
          (props.user.roles && props.user.roles.includes('admin')) ? (
            <DeleteEntryInterface id={props.claim.claimId} type="claim" />
          ) : null}
        </Box>
        <Dialog
          fullWidth
          maxWidth="md"
          open={addReviewPopup}
          onClose={() => {
            setAddReviewPopup(false);
          }}
        >
          <DialogTitle>Add a review</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="review-title"
              label="Review title"
              fullWidth
              required
              variant="outlined"
              value={newReviewTitle}
              onChange={(event) => {
                setNewReviewTitle(event.currentTarget.value);
              }}
            />
            <TextField
              margin="dense"
              id="review-description"
              label="Review Description"
              value={newReviewDescription}
              onChange={(event) => {
                setNewReviewDescription(event.currentTarget.value);
              }}
              fullWidth
              multiline
              required
              rows={6}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
              <Typography>Add source</Typography>
              <IconButton
                sx={{ mb: '5px' }}
                aria-label="Add source"
                onClick={() => setNewSourceInput(true)}
              >
                <AddCircle />
              </IconButton>
            </Box>
            {newSourceInput ? (
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <TextField
                  label="Source title"
                  size="small"
                  required
                  value={sourceTitle}
                  onChange={(event) => {
                    setSourceTitle(event.currentTarget.value);
                  }}
                />
                <TextField
                  error={sourceUrlError}
                  label="Source URL"
                  size="small"
                  required
                  value={sourceUrl}
                  helperText="Start with http or https"
                  onChange={(event) => {
                    setSourceUrl(event.currentTarget.value);
                  }}
                />
                <IconButton
                  disabled={sourceTitle === '' || sourceUrl === ''}
                  aria-label="Save source entry"
                  onClick={() => {
                    setSourceUrlError(false);
                    if (!handleValidation()) {
                      return;
                    }
                    handleSaveSource();
                  }}
                >
                  <Save />
                </IconButton>
              </Box>
            ) : null}
            <Box sx={{ mb: '15px' }}>
              {' '}
              {currentSourceList.length === 0 ? (
                <Typography>Currently no sources provided</Typography>
              ) : (
                <>
                  <Typography variant="h5">Sources:</Typography>

                  <List sx={{ width: '100%' }}>
                    {currentSourceList.map((source) => {
                      return (
                        <ListItem alignItems="flex-start" key={source.title}>
                          <ListItemText
                            primary={source.title}
                            secondary={
                              <Link
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {source.url}
                              </Link>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              )}
            </Box>
            <Box sx={{ maxWidth: '320px', mb: '30px' }}>
              <FormControl fullWidth>
                <InputLabel id="verdict-select-label">Verdict</InputLabel>
                <Select
                  labelId="verdict-select-label"
                  id="verdict-select"
                  value={selectedVerdict}
                  label="Verdict"
                  onChange={(event) => {
                    setSelectedVerdict(Number(event.target.value));
                  }}
                >
                  {props.verdicts.map(({ verdict, id }) => {
                    return (
                      <MenuItem key={verdict} value={id}>
                        {verdict}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAddReviewPopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setErrors([]);
                const wrappedReview = await handleReviewCreation().catch(
                  (error) => {
                    console.log('Error when trying to create new review');
                    appendError(error);
                  },
                );
                if (!wrappedReview) {
                  setDisplayAlert(true);
                  return;
                }
                const { review } = wrappedReview;

                if (currentSourceList.length > 0) {
                  handleSourcesCreation(review.id).catch((error) => {
                    console.log('Error when trying to create new sources');
                    appendError(error);
                    setDisplayAlert(true);
                  });
                }
                // TODO: This clause does not trigger if first try resulted in error and second one is successful
                if (errors.length === 0) {
                  clearInputs();
                  if (!displayedReviews) {
                    setDisplayedReviews([review]);
                  } else {
                    const updatedDisplayedReviews = [
                      ...displayedReviews,
                      review,
                    ];
                    setDisplayedReviews(updatedDisplayedReviews);
                  }
                  setDisplayAlert(true);
                  setAddReviewPopup(false);
                }
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={displayAlert}
          autoHideDuration={5000}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
              return;
            }
            setDisplayAlert(false);
          }}
        >
          {errors.length > 0 ? (
            <Alert
              onClose={(
                event?: React.SyntheticEvent | Event,
                reason?: string,
              ) => {
                if (reason === 'clickaway') {
                  return;
                }
                setDisplayAlert(false);
              }}
              severity="error"
              sx={{ width: '100%' }}
            >
              An error occured!
            </Alert>
          ) : (
            <Alert
              onClose={(
                event?: React.SyntheticEvent | Event,
                reason?: string,
              ) => {
                if (reason === 'clickaway') {
                  return;
                }
                setDisplayAlert(false);
              }}
              severity="success"
              sx={{ width: '100%' }}
            >
              Review successfully added!
            </Alert>
          )}
        </Snackbar>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!user) {
    return {
      redirect: { destination: '/', permanent: false },
    };
  }

  let claim = await getClaimWithAllRelationsById(Number(context.query.claimId));

  // to prevent serialization issue with date objects:
  claim = JSON.parse(JSON.stringify(claim));

  if (!claim) {
    return {
      notFound: true,
    };
  }

  const verdicts = await getAllVerdicts();

  const author = await checkIfAuthorExists(user.id);
  if (author) {
    const fetchedRating = await checkAuthorClaimRating(
      claim.claimId,
      author.id,
    );

    return {
      props: {
        user: user,
        author: author,
        claim: claim,
        verdicts: verdicts,
        rating: fetchedRating ? fetchedRating.rating : null,
      },
    };
  }

  return {
    props: {
      user: user,
      author: null,
      verdicts: verdicts,
      claim: claim,
      rating: null,
    },
  };
}
