const defaultTestUsers = [
  { username: 'Primus', password_hash: '$2a$12$qnIelmmdDN95bTrTi9335eqWNNCdE5Y10AjE/tuDASaXUlo1g.yVG' },
  { username: 'Secunda', password_hash: '$2a$12$fM9zsDoSb8N0a4eQJik67ewRMIOiTQyAmthUuozM.zGu7x2VHz976' },
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
