const { getResources } = require('../agnosticFetch');
const nock = require('nock');
const path = require('node:path');

test('fetch Wiki API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('wiki-response-data.json');

  return getResources(
    `http://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&srsearch=${encodeURIComponent(
      'unit test',
    )}&format=json&prop=info&inprop=url`,
  ).then((data) => {
    // console.log(data)

    expect(data).toEqual(expect.any(Object));
    expect(data).toHaveProperty('query');
    expect(data.query).toHaveProperty('search');
    expect(data.query.search).toEqual(expect.any(Array));

    nockDone();
    nock.back.setMode('wild');
  });
});
