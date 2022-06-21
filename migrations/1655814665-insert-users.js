const defaultTestUsers = [
  { username: 'Primus', password_hash: 'xxx' },
  { username: 'Secunda', password_hash: 'yyy' },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO users ${sql(defaultTestUsers, 'username', 'password_hash')}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestUser of defaultTestUsers) {
    await sql`
      DELETE FROM
        users
      WHERE
        username = ${defaultTestUser.username}
    `;
  }
};
