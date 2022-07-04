import {
  AddCircle,
  InputOutlined,
  InputRounded,
  PlusOne,
  Save,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  IconButton,
  InputBase,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  checkIfAuthorExists,
  getUserByValidSessionToken,
} from '../../util/database/database';

type Props = {
  refreshUserProfile: () => Promise<void>;
  author?: any;
};

type ClaimRequestbody = {
  title: string;
  description: string;
  authorId: number | undefined;
};

type ReviewRequestbody = {
  title: string;
  description: string;
  authorId: number | undefined;
  claimId: number;
  verdictId?: number;
};

type RatingRequestbody = {
  claimId: number;
  ratingValue: number;
  authorId: number | undefined;
};

type SourceRequestbody = {
  sourceTitle: string;
  sourceUrl: string;
  reviewId: number;
};

export default function Database(props: Props) {
  const [authorId, setAuthorId] = useState<number | undefined>(
    props.author === null ? undefined : props.author.id,
  );
  const [newClaimTitle, setNewClaimTitle] = useState('');
  const [newClaimDescription, setNewClaimDescription] = useState('');

  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewDescription, setNewReviewDescription] = useState('');

  const [selectedClaim, setSelectedClaim] = useState(0);
  const [selectedVerdict, setSelectedVerdict] = useState(0);
  const [selectedReview, setSelectedReview] = useState(0);

  const [addReviewFields, setAddReviewFields] = useState(true);

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(-1);

  const [newSourceInput, setNewSourceInput] = useState(false);

  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [currentSourceList, setCurrentSourceList] = useState([]);

  const ratingLabels: { [index: string]: string } = {
    1: 'Completly untrue',
    2: 'Low credibility',
    3: 'Debatable',
    4: 'Mostly factual',
    5: 'Factual',
  };

  function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabels[value]}`;
  }

  console.log('author: ', authorId);

  const refreshUserProfile = props.refreshUserProfile;

  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);

  const handleAuthorCreation = async () => {
    const response = await fetch('/api/createAuthor');
    const author = await response.json();
    return author;
  };

  const handleClaimCreation = async () => {
    const requestbody: ClaimRequestbody = {
      title: newClaimTitle,
      description: newClaimDescription,
      authorId: undefined, // value is inserted further below
    };

    if (!props.author) {
      console.log('user not yet an author, let me handle that...');
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

    const response = await fetch('/api/createClaim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    const claim = await response.json();
    return claim;
  };

  const handleReviewCreation = async (claimId: number, verdictId: number) => {
    const requestbody: ReviewRequestbody = {
      title: newReviewTitle,
      description: newReviewDescription,
      authorId: undefined, // value is inserted further below
      claimId: claimId,
    };

    if (!props.author) {
      console.log('user not yet an author, let me handle that...');
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

    if (verdictId !== 0) {
      requestbody.verdictId = verdictId;
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

  const handleRatingCreation = async () => {
    const requestbody: RatingRequestbody = {
      claimId: selectedClaim,
      ratingValue: ratingValue,
      authorId: undefined, // value is inserted further below
    };

    if (!props.author) {
      console.log('user not yet an author, let me handle that...');
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

  const handleSourceCreation = async () => {
    const requestbody: SourceRequestbody = {
      sourceTitle: sourceTitle,
      sourceUrl: sourceUrl,
      reviewId: selectedReview,
    };

    const response = await fetch('/api/createSource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    const review = await response.json();
    return review;
  };

  return (
    <>
      <Head>
        <title>Add Database entry</title>
        <meta name="description" content="Add entry" />
      </Head>

      <main>
        <h1>Add a claim to the database</h1>

        <section>
          <h2>New claim</h2>
          <Box sx={{ marginBottom: '30px' }}>
            <TextField
              label="Claim title"
              size="small"
              required
              value={newClaimTitle}
              onChange={(event) => {
                setNewClaimTitle(event.currentTarget.value);
              }}
            />
          </Box>
          <Box sx={{ marginBottom: '30px' }}>
            <TextField
              label="Description"
              required
              multiline
              rows={9}
              fullWidth
              value={newClaimDescription}
              onChange={(event) => {
                setNewClaimDescription(event.currentTarget.value);
              }}
            />
          </Box>
          <Box sx={{ marginBottom: '30px' }}>
            <TextField
              label="Labels"
              size="small"
              //value={newClaimTitle}
              onChange={() => {}}
            />
          </Box>
          <Box sx={{ marginBottom: '30px' }}>
            <Typography>Credibility rating for claim</Typography>
            <Rating
              name="Claim Rating"
              value={ratingValue}
              precision={1}
              getLabelText={getLabelText}
              onChange={(event, newRatingValue) => {
                setRatingValue(newRatingValue);
              }}
              onChangeActive={(event, newRatingHover) =>
                setRatingHover(newRatingHover)
              }
              // emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {ratingValue !== null && (
              <Box sx={{ ml: 2 }}>
                {ratingLabels[ratingHover !== -1 ? ratingHover : ratingValue]}
              </Box>
            )}
          </Box>

          <h2>Review to claim</h2>
          <Box sx={{ display: 'flex' }}>
            <p>Attach a review?</p>
            <Checkbox
              onChange={() => {
                setAddReviewFields(!addReviewFields);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>

          <Box sx={{ marginBottom: '30px' }}>
            <TextField
              label="Review title"
              size="small"
              disabled={addReviewFields}
              required
              value={newReviewTitle}
              onChange={(event) => {
                setNewReviewTitle(event.currentTarget.value);
              }}
            />
          </Box>
          <Box sx={{ marginBottom: '30px' }}>
            <TextField
              label="Review description"
              disabled={addReviewFields}
              required
              multiline
              rows={9}
              fullWidth
              value={newReviewDescription}
              onChange={(event) => {
                setNewReviewDescription(event.currentTarget.value);
              }}
            />
          </Box>
          <Box sx={{display: "flex"}}>
          <p>Add source</p>
          <IconButton aria-label="Add source" disabled={addReviewFields} onClick={() => setNewSourceInput(true)}>
            <AddCircle  />
          </IconButton></Box>
          {newSourceInput ? (
            <>
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
                label="Source URL"
                size="small"
                required
                value={sourceUrl}
                onChange={(event) => {
                  setSourceUrl(event.currentTarget.value);
                }}
              />
              <IconButton aria-label="Save source entry" onClick={() => handleSaveSource()}>
                <Save  />
              </IconButton>
            </>
          ) : (
            <div />
          )}
          {currentSourceList.length === 0 ? (
            <div>Currently no sources for review</div>
          ) : (
            <div>
              Sources:
              <div>
                {currentSourceList.map((source) => {
                  return (
                    <div key={source.title}>
                      <div>{source.title}</div>
                      <div>{source.url}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleClaimCreation();
            }}
          >
            Submit
          </Button>
        </section>
        <section>
          <h2>review</h2>
          <TextField
            size="small"
            value={selectedClaim}
            onChange={(event) => {
              setSelectedClaim(Number(event.currentTarget.value));
            }}
          />
          <TextField
            value={newReviewTitle}
            onChange={(event) => {
              setNewReviewTitle(event.currentTarget.value);
            }}
          />
          <TextField
            value={newReviewDescription}
            onChange={(event) => {
              setNewReviewDescription(event.currentTarget.value);
            }}
          />
          <Button
            onClick={() => {
              handleReviewCreation(selectedClaim, selectedVerdict);
            }}
          >
            Create Review
          </Button>
        </section>
        <section>
          <h2>Rating</h2>
          <TextField
            value={selectedClaim}
            onChange={(event) => {
              setSelectedClaim(Number(event.currentTarget.value));
            }}
          />
          <TextField
            value={ratingValue}
            onChange={(event) => {
              setRatingValue(Number(event.currentTarget.value));
            }}
          />
          <Button
            onClick={() => {
              handleRatingCreation();
            }}
          >
            Add Rating
          </Button>
        </section>
        <section>
          <h2>Source</h2>
          <TextField
            value={selectedReview}
            onChange={(event) => {
              setSelectedReview(Number(event.currentTarget.value));
            }}
          />
          <TextField
            value={sourceTitle}
            onChange={(event) => {
              setSourceTitle(event.currentTarget.value);
            }}
          />
          <TextField
            value={sourceUrl}
            onChange={(event) => {
              setSourceUrl(event.currentTarget.value);
            }}
          />
          <Button
            onClick={() => {
              handleSourceCreation();
            }}
          >
            Add Source
          </Button>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const author = await checkIfAuthorExists(user.id);
    if (author) {
      console.log('user logged in, is author');
      return { props: { user: user, author: author } };
    }
    console.log('user logged in, but not an author');
    return { props: { user: user, author: null } };
  }

  console.log('no user logged in');
  return { props: { author: null } };
}
