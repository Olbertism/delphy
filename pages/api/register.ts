// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserByUsername } from '../../util/database/database';

type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | {
      user: { id: number, username: string };
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
      res
        .status(400)
        .json({
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

    const passwordHash = await bcrypt.hash(req.body.password, 12)
    console.log("hash created, call createUser...")
    const newUser = await createUser(req.body.username, passwordHash)


    res.status(200).json({ user: { id: newUser.id, username: newUser.username } });
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
