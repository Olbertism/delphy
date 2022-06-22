import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserByValidSessionToken } from '../../util/database/database';
import { User } from '../../util/types';

type Props = {
  user: User;
};
export default function PrivateProfile(props: Props) {
  return (
    <div>
      <Head>
        <title>{props.user.username}</title>
        <meta name="description" content="About the app" />
      </Head>

      <main>
        <h1>
          User #{props.user.id} (username: {props.user.username})
        </h1>
        <div>id: {props.user.id}</div>
        <div>username: {props.user.username}</div>
      </main>
    </div>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return { props: { user: user } };
  }

  return {
    redirect: { destination: '/login?returnTo=/dashboard', permanent: false }, // a next js thing, adapt returnTo as needed
  };
}
