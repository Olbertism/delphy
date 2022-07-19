import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteClaimById,
  getClaimById,
  getClaimByIdWithUsername,
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

    const user = await getUserByValidSessionToken(token);

    if (!user) {
      res.status(400).json({ errors: [{ message: 'Invalid session token' }] });
      return;
    }

    const claim = await getClaimByIdWithUsername(req.body.id);

    if (!claim) {
      res.status(400).json({ errors: [{ message: 'An error occured' }] });
      return;
    }

    if (claim.username !== user.username) {
      res.status(400).json({ errors: [{ message: 'Access denied' }] });
      return;
    }

    const deletedClaim = await deleteClaimById(req.body.id);

    res.status(200).json({ deletedClaim: deletedClaim });
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
