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
  {
    label: '5G',
  },
  {
    label: 'Russia',
  },
  {
    label: 'Vaccines',
  },
  {
    label: 'Climate change',
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
