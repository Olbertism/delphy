// import '../styles/globals.css';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { theme } from '../styles/theme';

const inputGlobalStyles = (
  <GlobalStyles
    styles={{
      main: { position: 'relative', minHeight: 'calc(100vh - 157px)' },
    }}
  />
);

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  console.log("user in _app is", user)

  // create this function only one time, and not everytime page rerenders
  // otherwise this can be a memory leak
  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');
    const profileResponseBody = await profileResponse.json();
    console.log('profileresponsebody:', profileResponseBody);

    if (!('errors' in profileResponseBody)) {
      setUser(profileResponseBody.user);
    } else {
      profileResponseBody.errors.forEach((error) => console.log(error));
      setUser(undefined);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => {});
  }, [refreshUserProfile]);

  return (
    <>
      {inputGlobalStyles}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout user={user}>
          <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
