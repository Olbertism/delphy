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

  {
    title: "Coronavirus: Scientists brand 5G claims 'complete rubbish'",
    url: 'https://www.bbc.com/news/52168096',
    review_id: 3,
  },

  {
    title: 'Is 5G dangerous? Debunking the myths',
    url: 'https://www.techtarget.com/whatis/feature/Is-5G-dangerous-Debunking-the-myths',
    review_id: 4,
  },

  {
    title: 'Coronavirus: 5G and microchip conspiracies around the world',
    url: 'https://www.bbc.com/news/53191523',
    review_id: 5,
  },
  {
    title: 'How Bill Gates became the voodoo doll of Covid conspiracies',
    url: 'https://www.bbc.com/news/technology-52833706',
    review_id: 5,
  },

  {
    title: 'CDC statement on autism and vaccines',
    url: 'https://www.cdc.gov/vaccinesafety/concerns/autism.html',
    review_id: 6,
  },
  {
    title: "Children's Hospital of Philadelphia",
    url: 'https://www.chop.edu/centers-programs/vaccine-education-center/vaccines-and-other-conditions/vaccines-autism',
    review_id: 7,
  },

  {
    title: 'OPCW Issues Report',
    url: 'https://www.opcw.org/media-centre/news/2020/10/opcw-issues-report-technical-assistance-requested-germany',
    review_id: 8,
  },

  {
    title: 'Youtube – official channel of A. Navalny',
    url: 'https://youtu.be/ibqiet6Bg38',
    review_id: 9,
  },
  {
    title: 'FSB Officer Inadvertently Confesses Murder Plot to Navalny',
    url: 'https://www.bellingcat.com/news/uk-and-europe/2020/12/21/if-it-hadnt-been-for-the-prompt-work-of-the-medics-fsb-officer-inadvertently-confesses-murder-plot-to-navalny/',
    review_id: 9,
  },

  {
    title: 'The criminal investigation by the Joint Investigation Team (JIT)',
    url: 'https://www.prosecutionservice.nl/topics/mh17-plane-crash/criminal-investigation-jit-mh17',
    review_id: 10,
  },

  {
    title:
      'Analysis: Why scientists think 100% of global warming is due to humans',
    url: 'https://www.carbonbrief.org/analysis-why-scientists-think-100-of-global-warming-is-due-to-humans/',
    review_id: 11,
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
