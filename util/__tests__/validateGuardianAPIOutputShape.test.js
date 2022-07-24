/**
 * @jest-environment node
 */

import path from 'node:path';
import axios from 'axios';
import nock from 'nock';

test('fetch Guardian API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('guardian-response-data.json');

  return axios(
    `https://content.guardianapis.com/search?page-size=5&q=${encodeURIComponent(
      'unit test',
    )}&api-key=${process.env.GUARDIANAPI}`,
  ).then((response) => {
    // console.log(data);

    expect(response.data).toEqual(expect.any(Object));
    expect(response.data).toHaveProperty('response');
    expect(response.data.response).toHaveProperty('results');
    expect(response.data.response.results).toEqual(expect.any(Array));
    expect(response.data.response.results[0]).toHaveProperty('webTitle');

    nockDone();
    nock.back.setMode('wild');
  });
});
