import Head from 'next/head';
import { useEffect, useState } from 'react';
import BasicTable from '../../components/database/DatabaseClaimsTable';
import BasicTabs from '../../components/database/DatabaseTabs';
import {
  getAllClaims,
  getAllClaimsWithReviewIds,
  getAllClaimsWithUsernamesAndReviewIds,
  getAllReviews,
  getAllReviewsWithUsernamesAndClaims,
} from '../../util/database/database';

type Props = {
  refreshUserProfile: () => Promise<void>;
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
        <h1>Database</h1>
        <div>
          <BasicTabs claims={props.claims} reviews={props.reviews} />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  // let claims = await getAllClaims();
  let claims = await getAllClaimsWithUsernamesAndReviewIds();

  let reviews = await getAllReviewsWithUsernamesAndClaims();
  console.log('#####################');
  console.log(reviews);
  console.log('#####################');

  // to prevent serialization issue with date objects:
  claims = JSON.parse(JSON.stringify(claims));
  reviews = JSON.parse(JSON.stringify(reviews));

  return { props: { claims: claims, reviews: reviews } };
}
