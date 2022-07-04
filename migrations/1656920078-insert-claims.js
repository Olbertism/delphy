const defaultTestClaims = [
  {
    title: 'Stanley Kubrick staged the Moon Landing',
    author_id: 1,
    description: 'Stanley Kubrick was hired by the US Government to fake the Apollo 11 moon landing',
    added: new Date(),
  },
  {
    title: '5G towers spread the coronavirus',
    author_id: 2,
    description: '5G radiation helps to transmit the coronavirus through the air.',
    added: new Date(),
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO claims ${sql(defaultTestClaims, 'title', 'author_id', 'description', 'added')}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestClaim of defaultTestClaims) {
    await sql`
      DELETE FROM
        claims
      WHERE
        title = ${defaultTestClaim.title}
    `;
  }
};
