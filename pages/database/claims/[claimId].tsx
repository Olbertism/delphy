import { AddCircle, FactCheck, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
  Rating,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
// import Link from 'next/link';
import { useEffect, useState } from 'react';
import { labelStyles, redTextHighlight } from '../../../styles/customStyles';
import {
  checkIfAuthorExists,
  getAllVerdicts,
  getClaimWithAllRelationsById,
  getUserByValidSessionToken,
  getUserThroughAuthorId,
} from '../../../util/database/database';
import {
  Claim,
  ReviewRequestbody,
  SourceRequestbody,
} from '../../../util/types';

type ClaimPageProps = {
  refreshUserProfile: () => Promise<void>;
  claim: Claim;
  author?: number;
};
export default function ClaimPage(props: ClaimPageProps) {
  console.log(props);

  const [authorId, setAuthorId] = useState<number | undefined>(
    props.author === null ? undefined : props.author.id,
  );

  const [addReviewPopup, setAddReviewPopup] = useState(false);
  const [newSourceInput, setNewSourceInput] = useState(false);

  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewDescription, setNewReviewDescription] = useState('');

  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [currentSourceList, setCurrentSourceList] = useState([]);

  const [selectedVerdict, setSelectedVerdict] = useState<number | string>('');

  const refreshUserProfile = props.refreshUserProfile;

  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);

  function calculateRating() {
    if (!props.claim.ratings) {
      return 0;
    }
    const averageRating =
      props.claim.ratings.reduce((a, b) => a + b, 0) /
      props.claim.ratings.length;
    return averageRating;
  }

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
        <title>Claim entry</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <Typography variant="subtitle1">
          Claim #{props.claim.claimId}
        </Typography>
        <Typography variant="h1">{props.claim.claimTitle}</Typography>
        <Typography variant="h3">Description</Typography>
        <Typography>{props.claim.claimDescription}</Typography>
        <Typography variant="h3">Added by</Typography>
        <Link href={`/users/${props.claim.username}`}>
          {props.claim.username}
        </Link>
        <Typography variant="h3">Average rating value</Typography>
        <Typography variant="body2">
          0 - Low credibility / 5 - High credibility
        </Typography>
        <Rating name="avg-claim-rating" value={calculateRating()} readOnly />

        <Typography variant="h3">Labels</Typography>
        {props.claim.labels ? (
          <div>
            {props.claim.labels.map((label) => {
              return (
                <Typography sx={labelStyles} key={label}>
                  {label}
                </Typography>
              );
            })}
          </div>
        ) : (
          <Typography>No labels associated</Typography>
        )}

        <Typography variant="h3">Associated reviews</Typography>
        {props.claim.reviews ? (
          <List sx={{ width: '100%' }}>
            {props.claim.reviews.map((review) => {
              console.log(review);
              return (
                <ListItem
                  alignItems="center"
                  key={review.review_title}
                  disablePadding
                >
                  <ListItemIcon>
                    <FactCheck />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={`/database/reviews/${review.review_id}`}>
                        {review.review_title}
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
        <Button
          onClick={() => {
            setAddReviewPopup(true);
          }}
        >
          Add a review
        </Button>
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
              <Box sx={{display: "flex", gap: "10px", }}>
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
              </Box>
            ) : (
              null
            )}
            <Box>
            {currentSourceList.length === 0 ? (
            <Typography>Currently no sources provided</Typography>
          ) : (

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
            )}</Box>
            <Box sx={{ maxWidth: '320px', mb: "30px" }}>
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
                const {review} = await handleReviewCreation().catch(
                  () => {
                    console.log('Error when trying to create new review');
                  })
                  console.log(review)
                  if (currentSourceList.length > 0) {
                    handleSourcesCreation(review.id).catch(() => {
                      console.log('Error when trying to create new sources');
                    });
                  }
                setAddReviewPopup(false);
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  let claim = await getClaimWithAllRelationsById(Number(context.query.claimId));

  // to prevent serialization issue with date objects:
  claim = JSON.parse(JSON.stringify(claim));

  if (!claim) {
    return {
      notFound: true,
    };
  }

  const verdicts = await getAllVerdicts();

  if (user) {
    const author = await checkIfAuthorExists(user.id);
    if (author) {
      console.log('user logged in, is author');
      return {
        props: {
          user: user,
          author: author,
          claim: claim,
          verdicts: verdicts,
        },
      };
    }
    console.log('user logged in, but not an author');
    return {
      props: { user: user, author: null, verdicts: verdicts, claim: claim },
    };
  }

  // get user who wrote claim
  /*  const author = await getUserThroughAuthorId(claim.authorId);
  console.log(author);
  if (author) {
    claim.username = author.username;
  } */

  return { props: { claim: claim, author: null, verdicts: verdicts } };
}
