const defaultTestUsers = [
  {
    username: 'Primus',
    password_hash:
      '$2a$12$qnIelmmdDN95bTrTi9335eqWNNCdE5Y10AjE/tuDASaXUlo1g.yVG',
  },
  {
    username: 'Secunda',
    password_hash:
      '$2a$12$fM9zsDoSb8N0a4eQJik67ewRMIOiTQyAmthUuozM.zGu7x2VHz976',
  },
  {
    username: 'RyanReynolds',
    password_hash:
      '$2a$12$qRtUZLO9AVnBfWuRcFKkx.GzBQV1ixslb1cuUuvDlddlFRhYkR84q',
  },
  {
    username: 'Systemizer',
    password_hash:
      '$2a$12$UgdsPaufTlLF0IZGj/j6EOKJMQrv2tzo5cZQuJCQMaSzuAa1kRSSK',
  },
  {
    username: 'Persephone',
    password_hash:
      '$2a$12$kM2XzELP3j/8oO37W.sfV.sBvK9uzX1/cHpYR4qJ.qAHirs/Wro.e',
  },
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
