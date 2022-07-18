const defaultTestUsers = [
  { user_id: 1 },
  { user_id: 2 },
  { user_id: 3 },
  { user_id: 4 },
  { user_id: 5 },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO authors ${sql(defaultTestUsers, 'user_id')}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestUser of defaultTestUsers) {
    await sql`
      DELETE FROM
        authors
      WHERE
        user_id = ${defaultTestUser.user_id}
    `;
  }
};