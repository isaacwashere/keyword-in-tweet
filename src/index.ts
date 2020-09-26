export interface ConditionalConfig {
  includeQuotes?: boolean;
}

/**
 * @desc Determine if the provided keyword is (exactly) in a tweet; this means hashtags, mentions and links with http are excluded
 * @param {string} tweetText - The exact text of the tweet
 * @param {string} keyword - The keyword we will be searching for
 * @returns {boolean}
 */
export const KeywordInTweet = (
  tweetText: string,
  keyword: string,
  conditionalConfig?: ConditionalConfig,
): boolean => {
  const config = generateKeywordConfig(keyword);
  const normalSpacingKeywordCheck = tweetContainsKeyword(tweetText, config, conditionalConfig);
  const spaceBetweenKeywordCheck = spacedOutKeyword(tweetText, config);

  if (normalSpacingKeywordCheck || spaceBetweenKeywordCheck) return true;

  return false;
};

/**
 * @desc Extracts from the keyword, the necessary info needed to test the tweet's text
 * @param {string} keyword - The keyword we will be searching for
 * @returns {KeywordConfig} - The keyword config info extracted from the keyword
 */
const generateKeywordConfig = (keyword: string): KeywordConfig => {
  return {
    keyword,
    startOfKeyword: keyword[0],
    endOfKeyword: keyword[keyword.length - 1],
    arrayLengthOfKeyword: keyword.length - 1,
    lengthOfKeyword: keyword.length,
    earliestStartingIndexOfKeyword: 0,
    earliestEndingIndexOfKeyword: keyword.length - 1,
    earliestSuffixCharIndexLocation: keyword.length + 1,
  };
};

/**
 * @desc Determine if the current term in the tweet contains a character that should be ignored
 * @param {string} term - the current single term in the tweet
 * @param {ConditionalConfig} conditionalConfig - Unused at the moment, but we intend to conditionally exclude quotations
 * @returns {boolean}
 */
const includesIrrelevantChar = (term: string, conditionalConfig?: ConditionalConfig): boolean => {
  let result =
    !term.toLowerCase().includes('http') &&
    !term.toLowerCase().includes('@') &&
    !term.toLowerCase().includes("'") &&
    !term.toLowerCase().includes('"') &&
    !term.toLowerCase().includes('#');

  return result;
};

/**
 * @desc Determine if the tweet contains the keyword spaced out (ie. b a r k) by splitting the tweet into an array and when we see the start of the keyword, saving that index and when we see the end of the keyword, saving that index, and subtracting to see if they were consecutive and the tweet contains the keyword
 * @param {string} tweetText - the actual text of the tweet
 * @param {KeywordConfig} config - The object containing the info used to test the keyword
 * @returns {boolean}
 */
const spacedOutKeyword = (tweetText: string, config: KeywordConfig): boolean => {
  const { startOfKeyword, endOfKeyword, arrayLengthOfKeyword } = config;

  let indexStartOfKeyword = 0;
  let indexEndOfKeyword = 0;
  tweetText.split(' ').forEach((term, currentIndex) => {
    if (term.toLowerCase() === startOfKeyword && indexStartOfKeyword === 0)
      indexStartOfKeyword = currentIndex;
    if (
      term.toLowerCase() === endOfKeyword &&
      indexStartOfKeyword !== 0 &&
      currentIndex === indexStartOfKeyword + arrayLengthOfKeyword
    )
      indexEndOfKeyword = currentIndex;
    return;
  });

  return indexEndOfKeyword - indexStartOfKeyword === arrayLengthOfKeyword;
};

/**
 * @desc Determine if the tweet contains the keyword byt splitting the text of the tweet into an array, filtering out irrelevant chars, checking to see if the remainder include the keyword, then checking if those remaining terms contain the keyword without any weird letters at the end. Return if the length of the 'validTerms' array is greater than 1.
 * @param {string} tweetText - the text of the tweet
 * @param {KeywordConfig} config - The object containing the info used to test the keyword
 * @param {ConditionalConfig} conditionalConfig - Unused at the moment, but we intend to conditionally exclude quotations
 * @return {boolean}
 */
const tweetContainsKeyword = (
  tweetText: string,
  config: KeywordConfig,
  conditionalConfig?: ConditionalConfig,
): boolean => {
  const keyword = config.keyword;

  const validTerms = tweetText
    .split(' ')
    .filter((term: string) => includesIrrelevantChar(term, conditionalConfig))
    .filter((term: string) => term.toLowerCase().includes(keyword))
    .filter((term: string) => termContainsKeywordAndNoLettersAfter(term, config));

  return validTerms?.length >= 1;
};

/**
 * @desc Determine if the term is the keyword without letters after it. Do this by checking to see if the first letter is the 1st letter in the keyword, if the upcoming last letter is the last letter in the keyword and if the letter after the last letter in the keyword is also a letter
 * @param {string} term - a single term/word in the tweet to examine
 * @param {KeywordConfig} config - The object containing the info used to test the keyword
 * @return {boolean}
 */
const termContainsKeywordAndNoLettersAfter = (term: string, config: KeywordConfig): boolean => {
  const {
    earliestEndingIndexOfKeyword,
    earliestStartingIndexOfKeyword,
    startOfKeyword,
    endOfKeyword,
  } = config;

  return (
    term.split('')[earliestStartingIndexOfKeyword] === startOfKeyword &&
    term.split('')[earliestEndingIndexOfKeyword] === endOfKeyword &&
    aSuffixCharExistsAndItsNotALetter(term, config)
  );
};

/**
 * @desc Determine if the term has a suffix char, if it doesn't then that means the keyword is present, if the suffix char is there and it is not a letter, that means we're also okay.
 * @param {string} term - A single term to examine
 * @param {KeywordConfig} config - The object containing the info used to test the keyword
 * @return {boolean} whether the term in the tweet is the keyword
 */
const aSuffixCharExistsAndItsNotALetter = (term: string, config: KeywordConfig): boolean => {
  const { earliestSuffixCharIndexLocation } = config;

  if (!term.split('')[earliestSuffixCharIndexLocation]) return true;
  if (
    term.split('')[earliestSuffixCharIndexLocation] &&
    !term.split('')[earliestSuffixCharIndexLocation].match(/[a-zA-Z]/i)
  )
    return true;

  return false;
};
