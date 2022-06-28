import Head from 'next/head';
import { useEffect, useState } from 'react';

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Imprint(props: Props) {
  const refreshUserProfile = props.refreshUserProfile;
  useEffect(() => {
    refreshUserProfile().catch(() =>
      console.log('refresh user profile failed'),
    );
  }, [refreshUserProfile]);
  return (
    <>
      <Head>
        <title>Imprint</title>
        <meta name="description" content="Imprint" />
      </Head>

      <main>
        <h1>Imprint</h1>
        <div />
      </main>
    </>
  );
}