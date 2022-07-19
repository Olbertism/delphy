import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteReviewById,
  getReviewByIdWithUsername,
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

    const review = await getReviewByIdWithUsername(req.body.id);

    if (!review) {
      res.status(400).json({ errors: [{ message: 'An error occured' }] });
      return;
    }

    if (!user.roles || !user.roles.includes('admin')) {
      if (review.username !== user.username) {
        res.status(400).json({ errors: [{ message: 'Access denied' }] });
        return;
      }
    }

    const deletedReview = await deleteReviewById(req.body.id);
    res.status(200).json({ deletedReview: deletedReview });
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
