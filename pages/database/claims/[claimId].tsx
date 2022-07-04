import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import {
  getClaimById,
  getClaimWithAllRelationsById,
  getUserThroughAuthorId,
} from '../../../util/database/database';
import { Claim } from '../../../util/types';

type ClaimPageProps = {
  claim: Claim;
};
export default function ClaimPage(props: ClaimPageProps) {
  return (
    <>
      <Head>
        <title>Claim entry</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <h1>
          Claim #{props.claim.id} (Title: {props.claim.title})
        </h1>

        <div>description: {props.claim.description}</div>
        <div>added by: {props.claim.username}</div>
        <div>average rating value: TODO! </div>
        <div>labels: TODO! </div>
        <div>associated reviews: TODO! </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const superclaim = await getClaimWithAllRelationsById(Number(context.query.claimId));
  console.log(superclaim)

  let claim = await getClaimById(Number(context.query.claimId));

  // to prevent serialization issue with date objects:
  claim = JSON.parse(JSON.stringify(claim));

  if (!claim) {
    return {
      notFound: true,
    };
  }

  // get user who wrote claim
  const author = await getUserThroughAuthorId(claim.authorId)
  console.log(author)
  if (author){
    claim.username = author.username
  }

  return { props: { claim: claim } };
}
