const defaultTestReviews = [
  {
    title: "Stanley Kubrick didn't direct the moon landing. ",

    description:
      'While the original source of the claim is a bit unclear, many moon landing deniers have suggested that Stanley Kubrick directed the footage for the staged moon landing, after being approached by NASA based on his work in the 1968 movie 2001: A Space Odyssey. One source claims that Kubrick initially declined the offer, only relenting when NASA threatened to out his little brother as a member of the Communist Party (though this would have been in the late 1960s, nearly a full decade after the height of the Red Scare). The story goes that Kubrick spent 18 months on a soundstage shooting the footage for the Apollo 11 and 12 moon missions, and that his 1980 film The Shining serves as a sort of apology for having snookered the American public (the basis of this specific claim appears to be that the kid playing Jack Nicholson’s son wears an Apollo 11 sweater at one point, which, OK, fine). Because Kubrick has been dead for nearly 20 years, he was not available at press time to comment on this theory. His daughter Vivian, however, has publicly denied it, saying in a 2016 Facebook post that the idea that her father helped the U.S. government stage a moon landing is “manifestly a grotesque lie.”',
    added: new Date(),
    author_id: 1,
    claim_id: 1,
    verdict_id: 1,
  },
  {
    title: '5G has no link to COVID-19 but false conspiracy theories persist',

    description:
      "As the coronavirus swept across the globe, so did rumors about what caused it and how it's spread. One that's persisted online is that 5G networks caused the disease. A new one involves vaccines somehow being linked to 5G tracking. Both are completely wrong. Radio waves can't create a virus, which is what causes COVID-19. And if someone wanted to track you, your phone is a more likely culprit than radio transmitters that are entirely too large to fit into a syringe. ",
    added: new Date(),
    author_id: 2,
    claim_id: 3,
    verdict_id: 1,
  },
  {
    title:
      'Scientists explain why there can be no connection between 5G and Covid-19 spread',

    description:
      'The idea of a connection between Covid-19 and 5G is "complete rubbish" and biologically impossible. It would be impossible for 5G to transmit the virus, Adam Finn, professor of paediatrics at the University of Bristol, explains. "The present epidemic is caused by a virus that is passed from one infected person to another. We know this is true. We even have the virus growing in our lab, obtained from a person with the illness. Viruses and electromagnetic waves that make mobile phones and internet connections work are different things. As different as chalk and cheese," he says. It\'s also important to note another major flaw with the conspiracy theories - coronavirus is spreading in UK cities where 5G has yet to be deployed, and in countries like Iran that have yet to roll out the technology.',
    added: new Date(),
    author_id: 3,
    claim_id: 3,
    verdict_id: 1,
  },
  {
    title: 'Common myths around 5G technology',

    description:
      'Six more common myths surrounding 5G wireless technology that have been debunked. See the attached source',
    added: new Date(),
    author_id: 4,
    claim_id: 4,
    verdict_id: 1,
  },
  {
    title: 'Theories are falsely linking Bill Gates to the coronavirus',

    description:
      "Widespread false claims and accusations include: \n\n Bill and Melinda Gates Foundation has tested vaccines on children in Africa and India, leading to thousands of deaths and irreversible injuries. \n\nRolling out a tetanus vaccine in Kenya that includes abortion drugs. \n\nA video on the website of The New American Magazine's Facebook page continues with the theme of mass depopulation via vaccines and abortion, and also links Mr Gates to China's Communist Party. It was shared 6,500 times and viewed 200,000 times.",
    added: new Date(),
    author_id: 3,
    claim_id: 5,
    verdict_id: 1,
  },
  {
    title:
      'Plenty of accessible studies debunk the myth that vaccines can cause autism',

    description:
      'Some people have had concerns that ASD might be linked to the vaccines children receive, but studies have shown that there is no link between receiving vaccines and developing ASD. The National Academy of Medicine, formerly known as Institute of Medicine, reviewed the safety of 8 vaccines to children and adults. The review found that with rare exceptions, these vaccines are very safe.',
    added: new Date(),
    author_id: 1,
    claim_id: 6,
    verdict_id: 1,
  },
  {
    title:
      'Two critically flawed studies suggest a correlation between vaccines and autism',

    description:
      'Two problematic studies are suggesting a link between vaccination and autism. Both of these studies have serious scientific flaws. See the attached source for a detailed analysis',
    added: new Date(),
    author_id: 2,
    claim_id: 6,
    verdict_id: 1,
  },
  {
    title: "The OPCW confirmed traces of Novichok in Navalny's body",

    description:
      'Five laboratories of the Organisation for the Prohibition of Chemical Weapons (in which Russia is a member) confirmed the usage of the Russian poison Novichok',
    added: new Date(),
    author_id: 4,
    claim_id: 7,
    verdict_id: 1,
  },
  {
    title:
      'Alexei Navalny and Christo Grozev uncover the Russian agents that were responsible for the poisoning',

    description: 'See the investigative video in the source link below',
    added: new Date(),
    author_id: 5,
    claim_id: 7,
    verdict_id: 1,
  },
  {
    title:
      'The international investigation group (JIT) has hard evidence that a Russian BUK shot down MH17',

    description:
      'According to the JIT, flight MH17 was shot down by a Buk missile from the 9M38 series. The missile was launched by a Buk TELAR installation that was transported from the Russian Federation to an farm field near Pervomaiskyi in Eastern Ukraine. At that time, that area was controlled by the separatists. After firing, the installation was transported back to the Russian Federation with a missing missile.',
    added: new Date(),
    author_id: 4,
    claim_id: 8,
    verdict_id: 1,
  },
  {
    title:
      'Humans emissions and activities have caused around 100% of the warming observed since 1950',

    description:
      'However, the science on the human contribution to modern warming is quite clear. Humans emissions and activities have caused around 100% of the warming observed since 1950, according to the Intergovernmental Panel on Climate Change’s (IPCC) fifth assessment report.\n In its 2013 fifth assessment report, the IPCC stated in its summary for policymakers that it is “extremely likely that more than half of the observed increase in global average surface temperature” from 1951 to 2010 was caused by human activity. By “extremely likely”, it meant that there was between a 95% and 100% probability that more than half of modern warming was due to humans.',
    added: new Date(),
    author_id: 5,
    claim_id: 9,
    verdict_id: 1,
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
      'verdict_id',
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
