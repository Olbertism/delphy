import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import {
  getClaimsByUsername,
  getReviewsByUsername,
  getUserByUsername,
  getUserByValidSessionToken,
} from '../../util/database/database';
import { DatabaseClaim, DatabaseReview, User } from '../../util/types';

type ProfilePageProps = {
  user: User;
  reviews: DatabaseReview[];
  claims: DatabaseClaim[];
};
export default function PublicUserProfile(props: ProfilePageProps) {
  return (
    <>
      <Head>
        <title>Public Profile</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <Typography variant="h1" data-test-id="profile-h1">
          Profile page
        </Typography>
        <Typography variant="h2">{props.user.username}</Typography>
        <div>id: {props.user.id}</div>

        <Box sx={{ mb: '30px' }}>
          <Typography variant="h3">Claims submitted:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {props.claims.map((claim) => {
              return (
                <Card sx={{ minWidth: 275 }} key={claim.claimTitle}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Claim #{claim.claimId}
                    </Typography>
                    <Typography sx={{ mb: 1.1 }} color="text.secondary">
                      {claim.claimTitle}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      data-test-id={`link-to-${claim.claimTitle}`}
                      href={`/database/claims/${claim.claimId}`}
                    >
                      Go to claim
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        </Box>
        <Box sx={{ mb: '30px' }}>
          <Typography variant="h3">Reviews submitted:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {props.reviews.map((review) => {
              return (
                <Card sx={{ minWidth: 275 }} key={review.reviewTitle}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Review #{review.reviewId}
                    </Typography>
                    <Typography sx={{ mb: 1.1 }} color="text.secondary">
                      {review.reviewTitle}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      href={`/database/reviews/${review.reviewId}`}
                    >
                      Go to review
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        </Box>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const targetUser = await getUserByUsername(context.query.username as string);

  if (!targetUser) {
    return {
      notFound: true,
    };
  }

  let targetUserClaims = await getClaimsByUsername(
    context.query.username as string,
  );
  // to prevent serialization issue with date objects:
  targetUserClaims = JSON.parse(JSON.stringify(targetUserClaims));
  let targetUserReviews = await getReviewsByUsername(
    context.query.username as string,
  );
  // to prevent serialization issue with date objects:
  targetUserReviews = JSON.parse(JSON.stringify(targetUserReviews));

  const currentUser = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (!currentUser) {
    return {
      redirect: { destination: '/', permanent: false }, // a next js thing, adapt returnTo as needed
    };
  } else if (targetUser.id === currentUser.id) {
    return {
      props: {
        user: targetUser,
        claims: targetUserClaims,
        reviews: targetUserReviews,
        isPageOwner: true,
      },
    };
  } else {
    return {
      props: {
        user: targetUser,
        claims: targetUserClaims,
        reviews: targetUserReviews,
        isPageOwner: false,
      },
    };
  }
}
