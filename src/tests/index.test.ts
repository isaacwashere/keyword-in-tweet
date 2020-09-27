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

    const tweetThree = {
      text: '@John http:bark.com burk this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: 'bark',
      result: false,
    };

    expect(KeywordInTweet(tweetOne.text, tweetOne.keyword)).toBe(tweetOne.result);
    expect(KeywordInTweet(tweetTwo.text, tweetTwo.keyword)).toBe(tweetTwo.result);
    expect(KeywordInTweet(tweetThree.text, tweetThree.keyword)).toBe(tweetThree.result);
  });
});

describe('KeywordInTweet with a keyword surrounded by characters', () => {
  test("should be able to tell when that word (with the characters) is in a tweet's text", () => {
    const tweetFour = {
      text: '@John http:bark.com !barkk! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: '!bark!',
      result: false,
    };

    const tweetFive = {
      text: '@John http:bark.com !bark! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: '!bark!',
      result: true,
    };

    expect(KeywordInTweet(tweetFour.text, tweetFour.keyword)).toBe(tweetFour.result);
    expect(KeywordInTweet(tweetFive.text, tweetFive.keyword)).toBe(tweetFive.result);
  });
});

describe('KeywordInTweet with a keyword that is spaced out', () => {
  test("should be able to tell when that word (with the characters) is in a tweet's text", () => {
    const tweetSix = {
      text:
        '@John http:bark.com ! b a r k ! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: '!bark!',
      result: true,
    };

    const tweetSeven = {
      text:
        '@John http:bark.com ! b          a r k ! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: '!bark!',
      result: true,
    };

    const tweetEight = {
      text:
        '@John http:bark.com ! b a r k k! this was ...barkk barksalot abark! #bark fun game @bark',
      keyword: '!bark!',
      result: false,
    };

    expect(KeywordInTweet(tweetSix.text, tweetSix.keyword)).toBe(tweetSix.result);
    expect(KeywordInTweet(tweetSeven.text, tweetSeven.keyword)).toBe(tweetSeven.result);
    expect(KeywordInTweet(tweetEight.text, tweetEight.keyword)).toBe(tweetEight.result);
  });
});

describe('KeywordInTweet with invalid params', () => {
  test('should throw an error', () => {
    const tweetNine = {
      text: '',
      keyword: '',
      result: 'KeywordInTweet received invalid arguments',
    };

    expect(() => KeywordInTweet(tweetNine.text, tweetNine.keyword)).toThrowError(tweetNine.result);
  });
});
