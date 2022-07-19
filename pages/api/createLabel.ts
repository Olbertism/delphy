import { NextApiRequest, NextApiResponse } from 'next';
import {
  createLabel,
  getUserByValidSessionToken,
} from '../../util/database/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // get cookie from request
    const token = req.cookies.sessionToken;

    // check the token to prevent API access from users that are not logged in
    if (!token) {
      res
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
      return;
    }
    // get user from the token
    console.log('Calling getUserBy... from createLabel api');
    const user = await getUserByValidSessionToken(token);

    if (!user) {
      res.status(400).json({ errors: [{ message: 'Invalid session token' }] });
      return;
    }

    const label = await createLabel(req.body.newLabel);
    res.status(200).json({ label: label });
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
