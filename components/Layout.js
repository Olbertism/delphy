import ResponsiveAppBar from './layout/AppBar';
import FooterBar from './layout/Footer';

export default function Layout(props) {
  return (
    <>
      <ResponsiveAppBar
        user={props.user}
        refreshUserProfile={props.refreshUserProfile}
      />
      {
        // Page content
        props.children
      }
      <FooterBar />
    </>
  );
}
