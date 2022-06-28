import Header from './Header';
import ResponsiveAppBar from './layout/AppBar';
import FooterBar from './layout/Footer';

export default function Layout(props) {
  return (
    <>
      {/* <Header user={props.user} refreshUserProfile={props.refreshUserProfile} /> */}
      <ResponsiveAppBar user={props.user} refreshUserProfile={props.refreshUserProfile} />
      {
        // Page content
        props.children
      }
      <FooterBar />
    </>
  );
}
