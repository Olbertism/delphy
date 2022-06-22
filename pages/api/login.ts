import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  getUserWithHashByUsername,
} from '../../util/database/database';
import { LoginResponseBody } from '../../util/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseBody>,
) {
  if (req.method === 'POST') {
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      !req.body.username ||
      !req.body.password
    ) {
      res.status(400).json({
        errors: [{ message: 'Username and/or Password not provided' }],
      });
      return;
    }

    const userWithHash = await getUserWithHashByUsername(req.body.username);

    if (!userWithHash) {
      res
        .status(401)
        .json({ errors: [{ message: 'Username or password incorrect' }] });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userWithHash.passwordHash,
    );

    if (!passwordMatches) {
      res
        .status(401)
        .json({ errors: [{ message: 'Username or password incorrect' }] });
      return;
    }

    const userId = userWithHash.id;
    const username = userWithHash.username;

    // Session creation to be appended
    const token = crypto.randomBytes(80).toString('base64')
    const session = await createSession(token, userId)

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(session.token)

    res.status(200).setHeader("set-Cookie", serializedCookie).json({ user: { id: userId, username: username } });
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
