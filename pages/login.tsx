import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginError, LoginResponseBody } from '../util/types';

export default function Login() {
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
      await router.push(returnTo);
    } else {
      // for user page
      // await router.push(`/users/${loginResponseBody.user.id}`);
      await router.push('/');
    }
  }
  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Head>

      <main>
        <h1>Login</h1>
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
          <button onClick={() => loginHandler()}>Login</button>
        </div>
      </main>
    </div>
  );
}
