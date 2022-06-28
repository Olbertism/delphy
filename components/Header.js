import { css } from '@emotion/react';
import { AppBar, ThemeProvider } from '@mui/material';
import Link from 'next/link';
import ResponsiveAppBar from './layout/AppBar';

export default function Header(props) {

  return (
        <ResponsiveAppBar>
          <div>
            {props.user && props.user.username}
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div>
            {props.user ? (
              <Link href="/logout">Logout</Link>
            ) : (
              <>
                <Link href="/register">Register</Link>
                <Link href="/login">Login</Link>
              </>
            )}
          </div>
        </ResponsiveAppBar>
  );
}
