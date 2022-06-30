import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import {
  getReviewById,
  getUserThroughAuthorId,
} from '../../../util/database/database';
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
          Review #{props.review.id} (Title: {props.review.title})
        </h1>

        <div>description: {props.review.description}</div>
        <div>added by: {props.review.username}</div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let review = await getReviewById(Number(context.query.reviewId));

  // to prevent serialization issue with date objects:
  review = JSON.parse(JSON.stringify(review));

  if (!review) {
    return {
      notFound: true,
    };
  }

  // get user who wrote claim
  const author = await getUserThroughAuthorId(review.authorId)
  console.log(author)
  if (author){
    review.username = author.username
  }

  return { props: { review: review } };
}