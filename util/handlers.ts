import { DeleteRequestBody } from './types';

export const handleAuthorCreation = async () => {
  const response = await fetch('/api/createAuthor');
  const author = await response.json();
  return author;
};
export const handleDeleteClaim = async (claimId: number) => {
  const requestbody: DeleteRequestBody = {
    id: claimId,
  };
  const response = await fetch('/api/deleteClaim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestbody),
  });
  const deletedClaim = await response.json();
  return deletedClaim;
};

export const handleDeleteReview = async (reviewId: number) => {
  const requestbody: DeleteRequestBody = {
    id: reviewId,
  };
  const response = await fetch('/api/deleteReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestbody),
  });
  const deletedReview = await response.json();
  return deletedReview;
};
