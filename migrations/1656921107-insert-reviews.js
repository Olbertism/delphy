const defaultTestReviews = [
  {
    title: "Stanley Kubrick didn't direct the moon landing. ",

    description:
      'While the original source of the claim is a bit unclear, many moon landing deniers have suggested that Stanley Kubrick directed the footage for the staged moon landing, after being approached by NASA based on his work in the 1968 movie 2001: A Space Odyssey. One source claims that Kubrick initially declined the offer, only relenting when NASA threatened to out his little brother as a member of the Communist Party (though this would have been in the late 1960s, nearly a full decade after the height of the Red Scare). The story goes that Kubrick spent 18 months on a soundstage shooting the footage for the Apollo 11 and 12 moon missions, and that his 1980 film The Shining serves as a sort of apology for having snookered the American public (the basis of this specific claim appears to be that the kid playing Jack Nicholson’s son wears an Apollo 11 sweater at one point, which, OK, fine). Because Kubrick has been dead for nearly 20 years, he was not available at press time to comment on this theory. His daughter Vivian, however, has publicly denied it, saying in a 2016 Facebook post that the idea that her father helped the U.S. government stage a moon landing is “manifestly a grotesque lie.”',
    added: new Date(),
    author_id: 1,
    claim_id: 1,
  },
  {
    title: '5G has no link to COVID-19 but false conspiracy theories persist',

    description:
      "As the coronavirus swept across the globe, so did rumors about what caused it and how it's spread. One that's persisted online is that 5G networks caused the disease. A new one involves vaccines somehow being linked to 5G tracking. Both are completely wrong. Radio waves can't create a virus, which is what causes COVID-19. And if someone wanted to track you, your phone is a more likely culprit than radio transmitters that are entirely too large to fit into a syringe. ",
    added: new Date(),
    author_id: 2,
    claim_id: 2,
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO reviews ${sql(
      defaultTestReviews,
      'title',
      'description',
      'added',
      'author_id',
      'claim_id',
    )}
  `;
};

exports.down = async (sql) => {
  for (const defaultTestReview of defaultTestReviews) {
    await sql`
      DELETE FROM
			reviews
      WHERE
        title = ${defaultTestReview.title}
    `;
  }
};
