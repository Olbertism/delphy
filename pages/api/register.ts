// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  createUser,
  getUserByUsername,
} from '../../util/database/database';

type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      user: { id: number; username: string };
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (req.method === 'POST') {
    // do all your stuff...
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

    if (await getUserByUsername(req.body.username)) {
      res
        .status(400)
        .json({ errors: [{ message: 'Selected username is not available' }] });
      return;
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    console.log('hash created, call createUser...');
    const newUser = await createUser(req.body.username, passwordHash);

    // Session creation to be appended
    const token = crypto.randomBytes(80).toString('base64');
    console.log('token created, call createSession...');
    const session = await createSession(token, newUser.id);
    console.log('session created, make serialized cookie...');
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    res
      .status(200)
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: newUser.id, username: newUser.username } });
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
