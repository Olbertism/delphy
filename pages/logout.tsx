import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deleteSessionByToken } from '../util/database/database';

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Logout(props: Props) {
  const refreshUserProfile = props.refreshUserProfile
  useEffect(() => {
    refreshUserProfile()
      .catch(() => console.log('refresh user profile failed'));
  }, [refreshUserProfile]);
  return (
    <div>
      <Head>
        <title>Logout</title>
        <meta name="description" content="Logout page" />
      </Head>

      <main>
        <h1>Logout</h1>
        <div />
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  // if token, delete the session, set cookie for destruction

  if (token) {
    await deleteSessionByToken(token);

    // do the reverse of the login, cookie is deleted by maxAge
    context.res.setHeader(
      'set-Cookie',
      cookie.serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    );
  }

  return {
    redirect: { destination: '/', permanent: false }, // a next js thing, adapt returnTo as needed
  };
}
