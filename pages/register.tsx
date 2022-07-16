import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterError, RegisterResponseBody } from '../util/types';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayAlert, setDisplayAlert] = useState(false);
  const [errors, setErrors] = useState<RegisterError>([]);

  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();

    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      setDisplayAlert(true);
      return;
    }
    await props.refreshUserProfile();
    await router.push('/');
  }
  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="description" content="Dashboard for the application" />
      </Head>

      <main>
        <Typography variant="h1">Register</Typography>
        <Box sx={{ display: 'flex', gap: '30px', mb: '30px' }}>
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
            onClick={() => registerHandler()}
            variant="contained"
            color="secondary"
          >
            Sign up
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
          <button onClick={() => registerHandler()}>Sign up</button>
        </div> */}
        <Snackbar
          open={displayAlert}
          autoHideDuration={5000}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
              return;
            }
            setDisplayAlert(false);
          }}
        >
          {errors.length > 0 ? (
            <Alert
              onClose={(
                event?: React.SyntheticEvent | Event,
                reason?: string,
              ) => {
                if (reason === 'clickaway') {
                  return;
                }
                setDisplayAlert(false);
              }}
              severity="error"
              sx={{ width: '100%' }}
            >
              {errors[0].message}
            </Alert>
          ) : (
            <div />
          )}
        </Snackbar>
      </main>
    </>
  );
}
