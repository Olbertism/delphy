/**
 * @jest-environment node
 */

import path from 'node:path';
import axios from 'axios';
import nock from 'nock';

test('fetch News API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('newsapi-response-data.json');

  return axios(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      'unit test',
    )}&sortBy=relevancy&apiKey=${process.env.NEWSAPI}`,
  ).then((response) => {
    // console.log(data);

    expect(response.data).toEqual(expect.any(Object));
    expect(response.data).toHaveProperty('articles');
    expect(response.data.articles).toEqual(expect.any(Array));
    expect(response.data.articles[0]).toHaveProperty('title');

    nockDone();
    nock.back.setMode('wild');
  });
});
