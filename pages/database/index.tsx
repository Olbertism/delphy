import { Box, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import BasicTabs from '../../components/database/DatabaseTabs';
import {
  getAllClaimsWithUsernamesAndReviewIds,
  getAllReviewsWithUsernamesAndClaims,
  getUserByValidSessionToken,
} from '../../util/database/database';
import { Claim, Review } from '../../util/types';

type Props = {
  refreshUserProfile: () => Promise<void>;
  claims: Claim[];
  reviews: Review[];
};
export default function Database(props: Props) {
  const refreshUserProfile = props.refreshUserProfile;
  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);
  return (
    <>
      <Head>
        <title>Database</title>
        <meta name="description" content="database" />
      </Head>

      <main>
        <Typography variant="h1" data-test-id="database-h1">
          Browse the database
        </Typography>
        <Typography>
          Select between Claims and Reviews that were submitted to our Database.
          Add your own claims or reviews.
        </Typography>
        <Box>
          <BasicTabs claims={props.claims} reviews={props.reviews} />
        </Box>
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
      redirect: { destination: '/', permanent: false }, // a next js thing, adapt returnTo as needed
    };
  }

  let claims = await getAllClaimsWithUsernamesAndReviewIds();

  let reviews = await getAllReviewsWithUsernamesAndClaims();

  // to prevent serialization issue with date objects:
  claims = JSON.parse(JSON.stringify(claims));
  reviews = JSON.parse(JSON.stringify(reviews));

  return { props: { claims: claims, reviews: reviews } };
}
