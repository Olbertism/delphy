const defaultTestLabels = [
  {
    label: 'Moon landing',
  },
  {
    label: 'Pop culture',
  },
  {
    label: 'Covid-19',
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO labels ${sql(defaultTestLabels, 'label')}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestLabel of defaultTestLabels) {
    await sql`
      DELETE FROM
			labels
      WHERE
        label = ${defaultTestLabel.label}
    `;
  }
};
