import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  getClaimWithAllRelationsById,
  getUserThroughAuthorId,
} from '../../../util/database/database';
import { Claim } from '../../../util/types';

type ClaimPageProps = {
  claim: Claim;
};
export default function ClaimPage(props: ClaimPageProps) {
  // const [avgRating, setAvgRating] = useState(0);

  function calculateRating() {
    const averageRating = props.claim.ratings.reduce((a,b) => a + b, 0 ) / props.claim.ratings.length
    return averageRating
  }
  console.log('claim page props', props);
  return (
    <>
      <Head>
        <title>Claim entry</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <h1>
          Claim #{props.claim.claimId} (Title: {props.claim.claimTitle})
        </h1>

        <div>description: {props.claim.claimDescription}</div>
        <div>added by: {props.claim.username}</div>
        <div>average rating value: {calculateRating()} </div>
        <div>
          labels:
          <div>
            {props.claim.labels.map((label) => {
              return <div key={label}>{label}</div>;
            })}
          </div>
        </div>
        <div>
          associated reviews:
          <div>
            {props.claim.reviews.map((review) => {
              console.log(review);
              return (
                <Link
                  key={review.review_title}
                  href={`/database/reviews/${review.review_id}`}
                >
                  {review.review_title}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let claim = await getClaimWithAllRelationsById(Number(context.query.claimId));
  //console.log(superclaim)

  //let claim = await getClaimById(Number(context.query.claimId));

  // to prevent serialization issue with date objects:
  claim = JSON.parse(JSON.stringify(claim));

  if (!claim) {
    return {
      notFound: true,
    };
  }

  // get user who wrote claim
  const author = await getUserThroughAuthorId(claim.authorId);
  console.log(author);
  if (author) {
    claim.username = author.username;
  }

  return { props: { claim: claim } };
}
