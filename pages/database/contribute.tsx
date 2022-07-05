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
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { theme } from '../../styles/theme';
import {
  checkIfAuthorExists,
  getAllLabels,
  getAllVerdicts,
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

type ClaimLabelRequestbody = {
  claimId: number;
  labelId: number;
};

type LabelRequestbody = {
  newLabel: string;
};

export default function Contribute(props: Props) {
  const [authorId, setAuthorId] = useState<number | undefined>(
    props.author === null ? undefined : props.author.id,
  );
  const [newClaimTitle, setNewClaimTitle] = useState('');
  const [newClaimDescription, setNewClaimDescription] = useState('');

  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewDescription, setNewReviewDescription] = useState('');

  const [selectedClaim, setSelectedClaim] = useState(0);
  const [selectedVerdict, setSelectedVerdict] = useState<number | string>('');
  const [selectedReview, setSelectedReview] = useState(0);

  const [selectedLabel, setSelectedLabel] = useState('');
  const [savedLabels, setSavedLabels] = useState([]);

  const [addReviewCheckbox, setAddReviewCheckbox] = useState(false);

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(-1);

  const [newSourceInput, setNewSourceInput] = useState(false);

  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [currentSourceList, setCurrentSourceList] = useState([]);

  console.log('Rating value', ratingValue);
  console.log('selected verdict', selectedVerdict);

  const ratingLabels: { [index: string]: string } = {
    1: 'Completly untrue',
    2: 'Low credibility',
    3: 'Debatable',
    4: 'Mostly factual',
    5: 'Factual',
  };

  function getRatingLabelText(value: number) {
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
      requestbody.verdictId = selectedVerdict;
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

  /*   const handleRatingCreation = async () => {
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
  }; */

  const handleRatingCreation = async (claimId) => {
    const requestbody: RatingRequestbody = {
      claimId: claimId,
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

  const handleSaveLabel = () => {
    const updatedSavedLabels = [...savedLabels, selectedLabel];
    setSavedLabels(updatedSavedLabels);
    setSelectedLabel('');
  };

  const handleCreateLabel = async (claimId: number) => {
    console.log('handleCreateLabel for claimid', claimId);

    const currentLabels = props.labels;
    const existingLabels = new Set();
    for (let label of savedLabels) {
      for (let currentLabel of currentLabels) {
        if (label === currentLabel.label) {
          // create only claim_labels entry
          const requestbody: ClaimLabelRequestbody = {
            claimId: claimId,
            labelId: currentLabel.id,
          };
          const response = await fetch('/api/createClaimLabel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestbody),
          });
          existingLabels.add(label);
          break;
        }
      }
      if (!existingLabels.has(label)) {
        // create new label and claim_labels entry
        const requestbodyNewLabel: LabelRequestbody = {
          newLabel: label,
        };
        console.log(requestbodyNewLabel);
        const responseNewLabel = await fetch('/api/createLabel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestbodyNewLabel),
        });
        const newLabel = await responseNewLabel.json();
        console.log(newLabel);
        const requestbodyClaimLabel: ClaimLabelRequestbody = {
          claimId: claimId,
          labelId: newLabel.label.id,
        };
        const responseClaimLabel = await fetch('/api/createClaimLabel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestbodyClaimLabel),
        });
      }
    }
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

  const handleSourceCreation = async (reviewId: number) => {
    const requestbody: SourceRequestbody = {
      sourceTitle: sourceTitle,
      sourceUrl: sourceUrl,
      reviewId: reviewId,
    };

    const response = await fetch('/api/createSource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    const source = await response.json();
    return source;
  };

  const handleSourcesCreation = async (reviewId: number) => {
    for (const source of currentSourceList) {
      const requestbody: SourceRequestbody = {
        sourceTitle: source.title,
        sourceUrl: source.url,
        reviewId: reviewId,
      };

      const response = await fetch('/api/createSource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestbody),
      });
      // const source = await response.json();
    }
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
          <Box
            sx={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}
          >
            <TextField
              label="Labels"
              size="small"
              value={selectedLabel}
              onChange={(event) => {
                setSelectedLabel(event.currentTarget.value);
              }}
            />
            {selectedLabel === '' ? (
              <div />
            ) : (
              <IconButton
                aria-label="Save label entry"
                onClick={() => handleSaveLabel()}
              >
                <Save />
              </IconButton>
            )}
            {savedLabels.length === 0 ? (
              <Typography sx={{ marginLeft: '10px', marginRight: '10px' }}>
                No labels set
              </Typography>
            ) : (
              savedLabels.map((savedLabel) => {
                return (
                  <Typography
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      justifyItems: 'center',
                      paddingLeft: "10px",
                      paddingRight: '10px',
                      borderRadius: '4px',
                      marginLeft: '10px',
                      marginRight: '10px',
                    }}
                    key={savedLabel}
                  >
                    {savedLabel}
                  </Typography>
                );
              })
            )}
          </Box>
          <Box sx={{ marginBottom: '50px' }}>
            <Typography>Credibility rating for claim</Typography>
            <Rating
              name="Claim Rating"
              value={ratingValue}
              precision={1}
              getLabelText={getRatingLabelText}
              onChange={(event) => {
                setRatingValue(Number(event.currentTarget.value));
              }}
              onChangeActive={(event, newRatingHover) =>
                setRatingHover(newRatingHover)
              }
              // emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />

              <Box sx={{ position: "absolute"}}>
                {ratingLabels[ratingHover !== -1 ? ratingHover : ratingValue]}
              </Box>

          </Box>

          <h2>Review to claim</h2>
          <Box sx={{ display: 'flex' }}>
            <p>Attach a review?</p>
            <Checkbox
              onChange={() => {
                setAddReviewCheckbox(!addReviewCheckbox);
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Box>

          <Box sx={{ marginBottom: '30px' }}>
            <TextField
              label="Review title"
              size="small"
              disabled={!addReviewCheckbox}
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
              disabled={!addReviewCheckbox}
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
          <Box sx={{ display: 'flex', alignItems: "center", mb: "20px" }}>
            <p>Add source</p>
            <IconButton
              aria-label="Add source"
              disabled={!addReviewCheckbox}
              onClick={() => setNewSourceInput(true)}
            >
              <AddCircle />
            </IconButton>

          <Box >
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
          )}</Box>
          </Box>
            <Box sx={{ maxWidth: '320px', mb: "30px" }}>
              <FormControl fullWidth>
                <InputLabel id="verdict-select-label">Verdict</InputLabel>
                <Select
                  disabled={!addReviewCheckbox}
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
            disabled={
              newClaimTitle === '' ||
              newClaimDescription === '' ||
              (addReviewCheckbox &&
                (newReviewTitle === '' || newReviewDescription === ''))
            }
            variant="contained"
            color="secondary"
            onClick={async () => {
              const { claim } = await handleClaimCreation().catch(() => {
                console.log('Error when trying to create new claim');
              });
              console.log(claim);
              if (savedLabels.length > 0) {
                handleCreateLabel(claim.id).catch(() => {
                  console.log('Error when trying to create new label');
                });
              }
              if (ratingValue > 0) {
                handleRatingCreation(claim.id).catch(() => {
                  console.log('Error when trying to create new rating');
                });
              }
              if (addReviewCheckbox) {
                const { review } = await handleReviewCreation(claim.id).catch(
                  () => {
                    console.log('Error when trying to create new review');
                  },
                );
                if (currentSourceList.length > 0) {
                  handleSourcesCreation(review.id).catch(() => {
                    console.log('Error when trying to create new sources');
                  });
                }
              }

              console.log('done');
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

  const verdicts = await getAllVerdicts();
  const labels = await getAllLabels();

  if (user) {
    const author = await checkIfAuthorExists(user.id);
    if (author) {
      console.log('user logged in, is author');
      return {
        props: {
          user: user,
          author: author,
          verdicts: verdicts,
          labels: labels,
        },
      };
    }
    console.log('user logged in, but not an author');
    return {
      props: { user: user, author: null, verdicts: verdicts, labels: labels },
    };
  }

  console.log('no user logged in');
  return { props: { author: null, verdicts: verdicts } };
}
