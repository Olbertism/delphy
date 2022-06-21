import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterError, RegisterResponseBody } from '../util/types';

export default function Register() {
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      return;
    }

    await router.push('/');
  }
  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="description" content="Dashboard for the application" />
      </Head>

      <main>
        <h1>Register</h1>
        <div>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
          {/* <label>
            Email
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
              }}
            />
          </label> */}
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
        </div>
      </main>
    </div>
  );
}
