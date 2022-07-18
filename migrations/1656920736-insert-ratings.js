const defaultTestRatings = [
  {
    rating: 1,
    claim_id: 1,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 1,
    author_id: 2,
  },
  {
    rating: 1,
    claim_id: 1,
    author_id: 3,
  },
  {
    rating: 2,
    claim_id: 2,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 2,
    author_id: 5,
  },
  {
    rating: 2,
    claim_id: 2,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 3,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 3,
    author_id: 3,
  },
  {
    rating: 1,
    claim_id: 3,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 4,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 4,
    author_id: 2,
  },
  {
    rating: 1,
    claim_id: 4,
    author_id: 3,
  },
  {
    rating: 1,
    claim_id: 4,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 5,
    author_id: 5,
  },
  {
    rating: 1,
    claim_id: 5,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 5,
    author_id: 3,
  },
  {
    rating: 1,
    claim_id: 6,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 6,
    author_id: 2,
  },
  {
    rating: 1,
    claim_id: 6,
    author_id: 3,
  },
  {
    rating: 1,
    claim_id: 6,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 7,
    author_id: 2,
  },
  {
    rating: 1,
    claim_id: 7,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 7,
    author_id: 5,
  },
  {
    rating: 1,
    claim_id: 7,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 8,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 8,
    author_id: 2,
  },
  {
    rating: 1,
    claim_id: 8,
    author_id: 3,
  },
  {
    rating: 1,
    claim_id: 9,
    author_id: 5,
  },
  {
    rating: 1,
    claim_id: 9,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 9,
    author_id: 3,
  },
  {
    rating: 2,
    claim_id: 10,
    author_id: 3,
  },
  {
    rating: 1,
    claim_id: 10,
    author_id: 1,
  },
  {
    rating: 1,
    claim_id: 10,
    author_id: 4,
  },
  {
    rating: 1,
    claim_id: 10,
    author_id: 5,
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO ratings ${sql(
      defaultTestRatings,
      'rating',
      'claim_id',
      'author_id',
    )}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestRating of defaultTestRatings) {
    await sql`
      DELETE FROM
			ratings
      WHERE
			claim_id = ${defaultTestRating.claim_id} AND author_id = ${defaultTestRating.author_id}
    `;
  }
};
