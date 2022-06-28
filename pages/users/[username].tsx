import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import {
  getUserByUsername,
  getUserByValidSessionToken,
} from '../../util/database/database';
import { User } from '../../util/types';

type ProfilePageProps = {
  user: User;
  isPageOwner: boolean;
}
export default function PublicUserProfile(props: ProfilePageProps) {
  return (
    <>
      <Head>
        <title>Public Profile</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        {props.isPageOwner ? <p>PRIVATE</p> : <p>PUBLIC</p>}
        <h1>
          User #{props.user.id} (username: {props.user.username})
        </h1>
        <div>id: {props.user.id}</div>
        <div>username: {props.user.username}</div>
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
  console.log("targetuser", targetUser)

  const currentUser = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );
  console.log("currentUser", currentUser)

  if (!currentUser) {
    return {
      redirect: { destination: '/', permanent: false }, // a next js thing, adapt returnTo as needed
    };
  } else if (targetUser.id === currentUser.id) {
    return { props: { user: targetUser, isPageOwner: true } };
  } else {
    return { props: { user: targetUser, isPageOwner: false } };
  }
}
