// import nock from 'nock';
// import path from 'path';
// import getResources from '../agnosticFetch';

// import { wikiTestResponse } from '../testResponses';

const { getResources } = require('../agnosticFetch')
const wikiTestResponse = require('../testResponses')
const nock = require('nock');

/* const nockBack = require('nock').back;

nockBack.fixtures = path.join(__dirname, '__nock-fixtures__');
nockBack.setMode('record'); */

test('fetch Wiki API resources, check output shape', () => {
  const params = {
    query: 'unit test',
  };

  // nock will intercept the next request with the given params
  nock('http://en.wikipedia.org')
  .get(`/w/api.php?&origin=*&action=query&list=search&srsearch=${encodeURIComponent('unit test')}&format=json&prop=info&inprop=url`).reply(200, wikiTestResponse)

  /* const url =
    '/api/data-fetchers/wikipedia?' + new URLSearchParams(params).toString(); */

  return getResources(`http://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&srsearch=${encodeURIComponent('unit test')}&format=json&prop=info&inprop=url`).then((data) => {
    console.log(data)
    console.log(data.length)
    expect(data.wikiTestResponse.length).toBeGreaterThan(0);
    // add any other check here
  });

/*   const response = await getResources(url);
  const fetchedWikiData = await response.json();

  if ('error' in fetchedWikiData) {
    expect(fetchedWikiData).toHaveProperty('error.info');
  } else {
    expect(fetchedWikiData).toHaveProperty('query.search');
  } */
});
