/**
 * @jest-environment node
 */

import path from 'node:path';
import axios from 'axios';
import nock from 'nock';

test('fetch Wiki API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('wiki-response-data.json');

  return axios(
    `http://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&srsearch=${encodeURIComponent(
      'unit test',
    )}&format=json&prop=info&inprop=url`,
  ).then((response) => {
    // console.log(data)

    expect(response.data).toEqual(expect.any(Object));
    expect(response.data).toHaveProperty('query');
    expect(response.data.query).toHaveProperty('search');
    expect(response.data.query.search).toEqual(expect.any(Array));

    nockDone();
    nock.back.setMode('wild');
  });
});
