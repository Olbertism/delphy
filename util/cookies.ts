import cookie from 'cookie';

export function createSerializedRegisterSessionTokenCookie(token: string) {
  const isProduction = process.env.NODE_ENV === 'production'; // this comes from next.js
  const maxAge = 60 * 60 * 24; // 24h in seconds

  return cookie.serialize('sessionToken', token, {
    maxAge: maxAge, // for new browsers
    expires: new Date(Date.now() + maxAge * 1000), // for old browsers (milliseconds)
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });
}
