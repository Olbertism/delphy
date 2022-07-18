const defaultTestClaims = [
  {
    title: 'Stanley Kubrick staged the Moon Landing',
    author_id: 1,
    description:
      'Stanley Kubrick was hired by the US Government to fake the Apollo 11 moon landing',
    added: new Date(),
  },
  {
    title: 'The Moon Landing never really happened, proven by Buzz Aldrin',
    author_id: 1,
    description:
      "Buzz Aldrin admitted in an interview with Conan O'Brien that the moon landing footage was animated",
    added: new Date(),
  },
  {
    title: '5G transmission towers spread the coronavirus',
    author_id: 2,
    description:
      '5G radiation helps to transmit the coronavirus through the air.',
    added: new Date(),
  },
  {
    title: 'Covid pandemic is just a cover for the mass introduction of 5G',
    author_id: 3,
    description:
      '5G is a harmful new technology that is implemented in secrecy',
    added: new Date(),
  },
  {
    title:
      'Bill Gates wants to implant microchips into humans through vaccines',
    author_id: 3,
    description:
      'In the shadow of the pandemic, Gates pushes his microchips into vaccines to gain control over a large proportion of the worlds population',
    added: new Date(),
  },
  {
    title: 'Vaccination is a cause of autism',
    author_id: 3,
    description:
      'Scientific studies that prove that autism can be caused by vaccines are withheld from the public',
    added: new Date(),
  },
  {
    title:
      'Alexei Navalny was poisoned by western secret service agents, not in Russia',
    author_id: 4,
    description:
      'Western governments poisoned him after his arrival in Germany and then blamed Russia',
    added: new Date(),
  },
  {
    title: 'MH17 was shot down by a Ukrainian fighter jet',
    author_id: 4,
    description: 'A Ukrainian fighter accidentally shot the plane',
    added: new Date(),
  },
  {
    title: 'Climate change is a natural phenomenon and not caused by humans',
    author_id: 5,
    description: "Humans don't contribute to climate change, it is all natural",
    added: new Date(),
  },
  {
    title: 'Scientists exaggerate climate change to receive more money',
    author_id: 5,
    description:
      'Scientists and media create a hype around climate change to get famous and earn more money',
    added: new Date(),
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO claims ${sql(
      defaultTestClaims,
      'title',
      'author_id',
      'description',
      'added',
    )}
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
