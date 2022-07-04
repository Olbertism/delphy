const defaultTestRatings = [
  {
    rating: 2,
    claim_id: 1,
    author_id: 2,
  },
  {
    rating: 1,
    claim_id: 2,
    author_id: 2,
  },
  {
    rating: 1,
    claim_id: 1,
    author_id: 1,
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
