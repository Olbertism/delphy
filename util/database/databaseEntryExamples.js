const claimsExample = {
  claim_title: 'Lorem Ipsum did this and that',
  claim_reviews: ['reviewId', 'reviewId'],
  claim_user_rating: 3.0,
  claim_labels: ['Covid', 'Conspiracies'],
  claim_added: new Date(),
};

const reviewsExample = {
  review_author: 'userId',
  review_sources: ['reviewLink', 'reviewLink'],
  review_credibility_rating: 2.0, // main quantifier for claim rating?
  review_text: 'Lorem Ipsum never did this',
  review_verdict: 'xyz', // a value from a set of given options
  review_added: new Date(),
};
