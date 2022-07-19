const { getResources } = require('../agnosticFetch');
const nock = require('nock');
const path = require('node:path');

test('fetch Google FactCheck API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('google-factcheck-response-data.json');

  return getResources(
    `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(
      'donald trump',
    )}&key=${process.env.FACTCHECKTOOLAPI}`,
  ).then((data) => {
    // console.log(data);

    expect(data).toEqual(expect.any(Object));
    expect(data).toHaveProperty('claims');
    expect(data.claims).toEqual(expect.any(Array));
    expect(data.claims[0]).toHaveProperty('text');

    nockDone();
    nock.back.setMode('wild');
  });
});
