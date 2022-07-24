/**
 * @jest-environment node
 */

import path from 'node:path';
import axios from 'axios';
import nock from 'nock';

test('fetch NYT API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('nyt-response-data.json');

  return axios(
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(
      'unit test',
    )}&api-key=${process.env.NYTAPI}`,
  ).then((response) => {
    // console.log(data);

    expect(response.data).toEqual(expect.any(Object));
    expect(response.data).toHaveProperty('response');
    expect(response.data.response).toHaveProperty('docs');
    expect(response.data.response.docs).toEqual(expect.any(Array));
    expect(response.data.response.docs[0]).toHaveProperty('abstract');

    nockDone();
    nock.back.setMode('wild');
  });
});
