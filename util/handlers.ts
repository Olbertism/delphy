import {
  DeleteRequestBody,
  ReviewRequestbody,
  SourceRequestbody,
} from './types';

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

export const handleReviewCreation = async (
  newReviewTitle: string,
  newReviewDescription: string,
  authorId: number,
  claimId: number,
  selectedVerdict: number | string,
) => {
  const requestbody: ReviewRequestbody = {
    title: newReviewTitle,
    description: newReviewDescription,
    authorId: authorId,
    claimId: claimId,
  };

  if (selectedVerdict !== '') {
    requestbody.verdictId = Number(selectedVerdict);
  }

  const response = await fetch('/api/createReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestbody),
  });
  const review = await response.json();
  return review;
};

export const handleSourcesCreation = async (
  reviewId: number,
  currentSourceList: { title: string; url: string }[],
) => {
  for (const source of currentSourceList) {
    const requestbody: SourceRequestbody = {
      sourceTitle: source.title,
      sourceUrl: source.url,
      reviewId: reviewId,
    };

    // const response =
    await fetch('/api/createSource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestbody),
    });
    // const source = await response.json();
  }
};
