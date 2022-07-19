const { getResources } = require('../agnosticFetch');
const nock = require('nock');
const path = require('node:path');

test('fetch Guardian API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('guardian-response-data.json');

  return getResources(
    `https://content.guardianapis.com/search?page-size=5&q=${encodeURIComponent(
      'unit test',
    )}&api-key=${process.env.GUARDIANAPI}`,
  ).then((data) => {
    // console.log(data);

    expect(data).toEqual(expect.any(Object));
    expect(data).toHaveProperty('response');
    expect(data.response).toHaveProperty('results');
    expect(data.response.results).toEqual(expect.any(Array));
    expect(data.response.results[0]).toHaveProperty('webTitle');

    nockDone();
    nock.back.setMode('wild');
  });
});
