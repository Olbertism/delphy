import axios from 'axios';
import { duckIt } from 'node-duckduckgo';

const apiBaseUrl = 'https://api.duckduckgo.com/?';
// const apiActionMode = 'action=query';

// I am afraid they turned it off for Javascript???

export async function makeDuckDuckGoInstantAnswerRequest(searchString) {
  // const apiParams = 'list=search';
  const query = `${apiBaseUrl}&${encodeURIComponent(searchString)}&format=json`;

/*
  const response = await axios.get(
    'https://api.duckduckgo.com/?q=covid&format=json&pretty=1',
  );
  const results = await response.json();

  return results; */

  try {
    const result = await duckIt('bart simpsons');
    console.log(result.data);
    // console.log(result.data.AbstractText);
    return result.data
  } catch (err) {
    console.error('oups', err);
  }
}
