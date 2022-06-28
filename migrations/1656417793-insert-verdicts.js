const verdicts = [
  { verdict: 'Completly made up' },
  { verdict: 'Unreliable / dubious' },
  { verdict: 'Debatable' },
  { verdict: 'Needs further investigation' },
  { verdict: 'Reliable / based on credible sources' },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO verdicts ${sql(verdicts)}
  `;
};

exports.down = async (sql) => {
  for (const verdict of verdicts) {
    await sql`
      DELETE FROM
        verdicts
      WHERE
        verdict = ${verdict.verdict}
    `;
  }
};
