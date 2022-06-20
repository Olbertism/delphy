// here I want some kind of generalized page scraper
import JSDOM from 'jsdom';

export function receiveTest(data) {
  console.log(data)
}

export function dummy() {
  const test = new JSDOM()
  console.log(test)
}