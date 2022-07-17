const { getResources } = require('../agnosticFetch');
const nock = require('nock');
const path = require('node:path');

test('fetch NYT API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('nyt-response-data.json');

  return getResources(
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(
      'unit test',
    )}&api-key=${
      process.env.NYTAPI
    }`,
  ).then((data) => {
    // console.log(data);

    expect(data).toEqual(expect.any(Object));
    expect(data).toHaveProperty('response');
    expect(data.response).toHaveProperty('docs')
    expect(data.response.docs).toEqual(expect.any(Array));
    expect(data.response.docs[0]).toHaveProperty('abstract');

    nockDone();
    nock.back.setMode('wild');
  });
});
