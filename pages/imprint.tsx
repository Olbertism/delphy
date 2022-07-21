import { Typography } from '@mui/material';
import Head from 'next/head';
import { useEffect } from 'react';

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
        <Typography variant="h1" data-test-id="profile-h1">
          Imprint
        </Typography>
        <div>
          <Typography>
            Web application created and maintained by Albert Pichler
          </Typography>
          <a
            href="https://github.com/Olbertism"
            target="_blank"
            rel="noreferrer"
          >
            Visit me on GitHub
          </a>
        </div>
      </main>
    </>
  );
}
