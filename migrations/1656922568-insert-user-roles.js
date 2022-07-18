const defaultUserRoles = [{ user_id: 4, role_id: 1 }];

exports.up = async (sql) => {
  await sql`
    INSERT INTO user_roles ${sql(defaultUserRoles, 'user_id', 'role_id')}
  `;
};

exports.down = async (sql) => {
  for (const defaultUserRole of defaultUserRoles) {
    await sql`
      DELETE FROM
			user_roles
      WHERE
			user_id = ${defaultUserRole.user_id} AND
			role_id = ${defaultUserRole.role_id}
    `;
  }
};
