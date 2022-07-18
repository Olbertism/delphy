import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  getReviewWithAllRelationsById,
  getUserByValidSessionToken,
} from '../../../util/database/database';
import formatDate from '../../../util/formatDate';
import { DatabaseReview, DeleteReviewRequestBody } from '../../../util/types';

type ReviewPageProps = {
  review: DatabaseReview;
  user: { id: number; username: string; roles: string[] | null };
};

const handleDeleteReview = async (reviewId: number) => {
  const requestbody: DeleteReviewRequestBody = {
    id: reviewId,
  };
  const response = await fetch('/api/deleteReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestbody),
  });
  const deletedReview = await response.json();
  return deletedReview;
};

export default function ReviewPage(props: ReviewPageProps) {
  const router = useRouter();
  console.log(props);
  return (
    <>
      <Head>
        <title>{props.review.reviewTitle}</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <Typography variant="subtitle1">
          Review #{props.review.reviewId}
        </Typography>
        <Typography variant="h1">{props.review.reviewTitle}</Typography>
        <Typography variant="h3">Claim</Typography>
        <Link href={`/database/claims/${props.review.claimId}`}>
          {props.review.claimTitle}
        </Link>
        <Box>
          <Typography variant="h4" sx={{ mb: '10px' }}>
            Verdict to claim
          </Typography>
          {props.review.verdict ? (
            <Typography sx={{ fontStyle: 'italic', fontSize: '18px' }}>
              "{props.review.verdict}"
            </Typography>
          ) : null}
        </Box>
        <Typography variant="h3">Description</Typography>
        <Typography>{props.review.reviewDescription}</Typography>
        <Typography variant="h3">Added by</Typography>
        <Link href={`/users/${props.review.username}`}>
          {props.review.username}
        </Link>
        <Typography>{`Added on ${formatDate(
          props.review.reviewAdded,
        )}`}</Typography>

        <Typography variant="h3">Sources</Typography>

        {props.review.sources ? (
          <List sx={{ width: '100%' }}>
            {props.review.sources.map((source) => {
              return (
                <ListItem
                  alignItems="flex-start"
                  key={source.source_title}
                  disablePadding
                >
                  <ListItemText
                    primary={source.source_title}
                    secondary={
                      <Link
                        href={source.source_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.source_url}
                      </Link>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography>No sources given</Typography>
        )}
        {props.review.username === props.user.username ? (
          <Button
            onClick={async () => {
              const deletedReview = await handleDeleteReview(
                props.review.reviewId,
              );
              if (deletedReview) {
                router.push('/database');
              }
            }}
            color="error"
            variant="outlined"
            sx={{ mb: '30px' }}
          >
            Delete review
          </Button>
        ) : null}
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

  let review = await getReviewWithAllRelationsById(
    Number(context.query.reviewId),
  );
  if (!review) {
    return {
      notFound: true,
    };
  }

  // to prevent serialization issue with date objects:
  review = JSON.parse(JSON.stringify(review));

  return { props: { review: review, user: user } };
}
