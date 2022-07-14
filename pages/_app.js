// import '../styles/globals.css';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import InfoBanner from '../components/banner/InfoBanner';
import Layout from '../components/Layout';
import ResponsiveAppBar from '../components/layout/AppBar';
import FooterBar from '../components/layout/Footer';
import { theme } from '../styles/theme';
import { getLocalStorage, setLocalStorage } from '../util/localStorage';

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
  const [bannerAccepted, setBannerAccepted] = useState(false);

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

  // send this to the component...
  function infoBannerHandler() {
    setLocalStorage('bannerAccepted', true);
    setBannerAccepted(true);
  }

  useEffect(() => {

    if (getLocalStorage('bannerAccepted')) {
      setBannerAccepted(getLocalStorage('bannerAccepted'));
    }

    refreshUserProfile().catch(() => {});
  }, [refreshUserProfile]);

  if (router.pathname === '/') {
    const landingPage = true;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ResponsiveAppBar user={user} landingPage={landingPage} />
        { bannerAccepted ? null : <InfoBanner open={bannerAccepted} infoBannerHandler={infoBannerHandler}/>}
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
