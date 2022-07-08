import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginError, LoginResponseBody } from '../util/types';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginError>([]);

  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const loginResponseBody: LoginResponseBody = await loginResponse.json();

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return;
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      // for user page
      // await router.push(`/users/${loginResponseBody.user.id}`);
      await props.refreshUserProfile();
      await router.push('/');
    }
  }
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Head>

      <main>
        <Typography variant="h1">Login</Typography>
        <Box sx={{display: "flex", gap: "30px", mb: "30px"}}>
          <TextField
            size="small"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
            label="Username"
          />

          {/* <label>
            Email
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
              }}
            />
          </label> */}
          <TextField
          size="small"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
            label="Password"
            type="password"
            autoComplete="current-password"
          />
        </Box>
        <Box>
          <Button
            onClick={() => loginHandler()}
            variant="contained"
            color="secondary"
          >
            Login
          </Button>
        </Box>
        {/* <div>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
          <button onClick={() => loginHandler()}>Login</button>
        </div> */}
      </main>
    </>
  );
}
