const defaultTestSources = [
  {
    title: 'RollingStone article from July 19, 2019',
    url: 'https://www.rollingstone.com/culture/culture-features/moon-landing-conspiracy-theories-explained-861205/',
    review_id: 1,
  },
  {
    title: 'CNET article from Oct. 30, 2021',
    url: 'https://www.cnet.com/tech/mobile/5g-has-no-link-to-covid-19-as-false-conspiracy-theories-persist/',
    review_id: 2,
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO sources ${sql(defaultTestSources, 'title', 'url', 'review_id')}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestSource of defaultTestSources) {
    await sql`
      DELETE FROM
			sources
      WHERE
        title = ${defaultTestSource.title}
    `;
  }
};
