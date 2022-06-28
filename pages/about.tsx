import Head from 'next/head';
import { useEffect, useState } from 'react';

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function About(props: Props) {
  const refreshUserProfile = props.refreshUserProfile;
  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);
  return (
    <>
      <Head>
        <title>About</title>
        <meta name="description" content="About" />
      </Head>

      <main>
        <h1>About</h1>
        <div />
      </main>
    </>
  );
}
