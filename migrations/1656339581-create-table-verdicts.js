exports.up = async (sql) => {
  await sql`
    CREATE TABLE verdicts (
      id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
			verdict varchar(40) NOT NULL
    )
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE verdicts
  `;
};
