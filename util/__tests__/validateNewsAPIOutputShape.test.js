const { getResources } = require('../agnosticFetch');
const nock = require('nock');
const path = require('node:path');

test('fetch News API resources, check output shape', async () => {

  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('newsapi-response-data.json');


  return getResources(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      'unit test',
    )}&sortBy=relevancy&apiKey=${process.env.NEWSAPI}`,
  ).then((data) => {
    // console.log(data);

    expect(data).toEqual(expect.any(Object));
    expect(data).toHaveProperty('articles')
    expect(data.articles).toEqual(expect.any(Array));
    expect(data.articles[0]).toHaveProperty('title')

    nockDone();
    nock.back.setMode('wild');
  });
});
