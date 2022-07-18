const defaultTestClaimLabels = [
  { claim_id: 1, label_id: 1 },
  { claim_id: 1, label_id: 2 },

  { claim_id: 2, label_id: 1 },

  { claim_id: 3, label_id: 3 },
  { claim_id: 3, label_id: 4 },

  { claim_id: 4, label_id: 3 },
  { claim_id: 4, label_id: 4 },

  { claim_id: 5, label_id: 3 },

  { claim_id: 6, label_id: 6 },

  { claim_id: 7, label_id: 5 },

  { claim_id: 8, label_id: 5 },

  { claim_id: 9, label_id: 7 },
  { claim_id: 10, label_id: 7 },
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
