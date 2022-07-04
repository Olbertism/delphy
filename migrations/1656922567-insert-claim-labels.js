const defaultTestClaimLabels = [
  { claim_id: 1, label_id: 1 },
  { claim_id: 1, label_id: 2 },
  { claim_id: 2, label_id: 3 },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO claim_labels ${sql(
      defaultTestClaimLabels,
      'claim_id',
      'label_id',
    )}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestClaimLabel of defaultTestClaimLabels) {
    await sql`
      DELETE FROM
			claim_labels
      WHERE
			claim_id = ${defaultTestClaimLabel.claim_id} AND
			label_id = ${defaultTestClaimLabel.label_id}
    `;
  }
};
