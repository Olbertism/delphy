import { AddCircle, Save } from '@mui/icons-material';
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  checkIfAuthorExists,
  getAllClaims,
  getAllVerdicts,
  getUserByValidSessionToken,
} from '../../util/database/database';
import { Claim, SourceEntry, Verdict } from '../../util/types';

type Props = {
  refreshUserProfile: () => Promise<void>;
  claims: Claim[];
  verdicts: Verdict[];
  author?: any;
};

type ReviewRequestbody = {
  title: string;
  description: string;
  authorId: number | undefined;
  claimId: number;
  verdictId?: number;
};

type SourceRequestbody = {
  sourceTitle: string;
  sourceUrl: string;
  reviewId: number;
};

export default function ContributeReview(props: Props) {
  const [authorId, setAuthorId] = useState<number | undefined>(
    props.author === null ? undefined : props.author.id,
  );

  const [newReviewTitle, setNewReviewTitle] = useState<string>('');
  const [newReviewDescription, setNewReviewDescription] = useState<string>('');

  const [selectedClaim, setSelectedClaim] = useState<number | string>('');
  const [selectedVerdict, setSelectedVerdict] = useState<number | string>('');

  const [newSourceInput, setNewSourceInput] = useState(false);

  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [currentSourceList, setCurrentSourceList] = useState<SourceEntry[]>([]);

  const [errors, setErrors] = useState<Error[]>([]);

  console.log('author: ', authorId);

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
    setSelectedClaim('');
    setNewReviewTitle('');
    setNewReviewDescription('');
    setSourceTitle('');
    setSourceUrl('');
    setCurrentSourceList([]);
    setSelectedVerdict('');
  };

  const handleAuthorCreation = async () => {
    const response = await fetch('/api/createAuthor');
    const author = await response.json();
    return author;
  };

  const handleReviewCreation = async (claimId: number) => {
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

    if (selectedVerdict !== '') {
      requestbody.verdictId = selectedVerdict as number;
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

      await fetch('/api/createSource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestbody),
      });
    }
  };

  return (
    <>
      <Head>
        <title>Add Database entry</title>
        <meta name="description" content="Add entry" />
      </Head>

      <main>
        <Typography variant="h1">Add a review to the database</Typography>

        <Box sx={{ maxWidth: '320px', mb: '30px' }}>
          <FormControl fullWidth>
            <InputLabel id="claim-select-label">Claim</InputLabel>
            <Select
              labelId="claim-select-label"
              id="claim-select"
              value={selectedClaim}
              label="Select a claim"
              onChange={(event) => {
                setSelectedClaim(Number(event.target.value));
              }}
            >
              {props.claims.map((claim) => {
                return (
                  <MenuItem key={claim.title} value={claim.id}>
                    {claim.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        <section>
          <Typography variant="h2">Review for claim</Typography>

          <Box sx={{ marginBottom: '30px' }}>
            <TextField
              label="Review title"
              size="small"
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
            <Typography>Add source</Typography>
            <IconButton
              sx={{ mb: '5px' }}
              aria-label="Add source"
              onClick={() => setNewSourceInput(true)}
            >
              <AddCircle />
            </IconButton>

            <Box>
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
                  <IconButton
                    disabled={sourceTitle === '' || sourceUrl === ''}
                    aria-label="Save source entry"
                    onClick={() => handleSaveSource()}
                  >
                    <Save />
                  </IconButton>
                </>
              ) : (
                <div />
              )}{' '}
              {currentSourceList.length === 0 ? (
                <Typography>Currently no sources provided</Typography>
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
            </Box>
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

          <Button
            sx={{ mb: '30px' }}
            disabled={newReviewTitle === '' || newReviewDescription === ''}
            variant="contained"
            color="secondary"
            onClick={async () => {
              const { review } = await handleReviewCreation(
                selectedClaim as number,
              ).catch((error) => {
                console.log('Error when trying to create new review');
                appendError(error);
              });
              if (currentSourceList.length > 0) {
                handleSourcesCreation(review.id).catch((error) => {
                  console.log('Error when trying to create new sources');
                  appendError(error);
                });
              }
              if (errors.length === 0) {
                clearInputs();
              }

              console.log('done');
            }}
          >
            Submit
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

  const verdicts = await getAllVerdicts();
  let claims = await getAllClaims();
  // to prevent serialization issue with date objects:
  claims = JSON.parse(JSON.stringify(claims));

  if (user) {
    const author = await checkIfAuthorExists(user.id);
    if (author) {
      console.log('user logged in, is author');
      return {
        props: {
          user: user,
          author: author,
          verdicts: verdicts,
          claims: claims,
        },
      };
    }
    console.log('user logged in, but not an author');
    return {
      props: { user: user, author: null, verdicts: verdicts, claims: claims },
    };
  }

  console.log('no user logged in');
  return { props: { author: null, verdicts: verdicts } };
}
