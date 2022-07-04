import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getReviewWithAllRelationsById } from '../../../util/database/database';
import { Review } from '../../../util/types';

type ReviewPageProps = {
  review: Review;
};
export default function ReviewPage(props: ReviewPageProps) {
  return (
    <>
      <Head>
        <title>Claim entry</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <h1>
          Review #{props.review.reviewId} (Title: {props.review.reviewTitle})
        </h1>

        <div>description: {props.review.reviewDescription}</div>
        <div>added by: {props.review.username}</div>
        <div>
          sources:{' '}
          <div>
            {props.review.sources.map((source) => {
              return (
                <div key={source.source_title}>
                  <ul>
                    <li>{source.source_title}</li>
                    <li>{source.source_url}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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

  return { props: { review: review } };
}
