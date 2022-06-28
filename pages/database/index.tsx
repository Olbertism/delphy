import Head from 'next/head';
import { useEffect, useState } from 'react';

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
        <div />
      </main>
    </>
  );
}
