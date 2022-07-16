import { contractionMap } from './contractionMap';

export default function processText(aString) {
  let text = aString;
  // cut down to max length 0f 250 chars
  text = text.slice(0, 250);
  // all to lower
  text = text.toLowerCase();

  // lay out all keys of map in array
  const contractions = contractionMap.keys();
  // for each key, check if the key itself finds a match in the string
  for (const contraction of contractions) {
    text = text.replace(contraction, contractionMap.get(contraction));
  }

  return text;
}
