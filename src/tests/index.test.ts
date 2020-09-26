import { KeywordInTweet } from '../index';

describe('KeywordInTweet with a normal keyword', () => {
  test("should be able to tell when the exact text of a word is in a tweet's text", () => {
    const tweetOne = {
      text: '@John http:bark.com !bark! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: 'bark',
      result: false,
    };

    const tweetTwo = {
      text: '@John http:bark.com bark this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: 'bark',
      result: true,
    };

    expect(KeywordInTweet(tweetOne.text, tweetOne.keyword)).toBe(tweetOne.result);
    expect(KeywordInTweet(tweetTwo.text, tweetTwo.keyword)).toBe(tweetTwo.result);
  });
});

describe('KeywordInTweet with a keyword surrounded by characters', () => {
  test("should be able to tell when that word (with the characters) is in a tweet's text", () => {
    const tweetThree = {
      text: '@John http:bark.com !barkk! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: '!bark!',
      result: false,
    };

    const tweetFour = {
      text: '@John http:bark.com !bark! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: '!bark!',
      result: true,
    };

    expect(KeywordInTweet(tweetThree.text, tweetThree.keyword)).toBe(tweetThree.result);
    expect(KeywordInTweet(tweetFour.text, tweetFour.keyword)).toBe(tweetFour.result);
  });
});
