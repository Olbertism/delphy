// import '../styles/globals.css';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ResponsiveAppBar from '../components/layout/AppBar';
import FooterBar from '../components/layout/Footer';
import { theme } from '../styles/theme';

const inputGlobalStyles = (
  <GlobalStyles
    styles={{
      main: {
        position: 'relative',
        minHeight: 'calc(100vh - 166px)',
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }}
  />
);



function MyApp({ Component, pageProps, router }) {
  console.log(router.pathname);
  const [user, setUser] = useState();

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

  if (router.pathname === '/') {
    const landingPage = true;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ResponsiveAppBar user={user} landingPage={landingPage} />
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
        <FooterBar landingPage={landingPage} />
      </ThemeProvider>
    );
  }

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
