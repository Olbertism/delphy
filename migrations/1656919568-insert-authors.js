const defaultTestUsers = [
  { user_id: 1 },
  { user_id: 2 },
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