/**
 * @jest-environment node
 */

import path from 'node:path';
import axios from 'axios';
import nock from 'nock';

test('fetch Google FactCheck API resources, check output shape', async () => {
  nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
  nock.back.setMode('record');
  const { nockDone } = await nock.back('google-factcheck-response-data.json');

  return axios(
    `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(
      'donald trump',
    )}&key=${process.env.FACTCHECKTOOLAPI}`,
  ).then((response) => {
    // console.log(response);

    expect(response.data).toEqual(expect.any(Object));
    expect(response.data).toHaveProperty('claims');
    expect(response.data.claims).toEqual(expect.any(Array));
    expect(response.data.claims[0]).toHaveProperty('text');

    nockDone();
    nock.back.setMode('wild');
  });
});
