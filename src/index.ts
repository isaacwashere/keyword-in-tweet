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
  const spaceBetweenKeywordCheck = spacedOutKeyword(tweetText, config, conditionalConfig);

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
    completeKeywordArr: keyword.split(''),
    startOfKeyword: keyword[0],
    endOfKeyword: keyword[keyword.length - 1],
    arrayLengthOfKeyword: keyword.length - 1,
    lengthOfKeyword: keyword.length,
    earliestStartingIndexOfKeyword: 0,
    earliestEndingIndexOfKeyword: keyword.length - 1,
    earliestSuffixCharIndexLocation: keyword.length,
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
 * @desc Determine if the tweet contains the keyword spaced out (ie. b a r k)
 * @param {string} tweetText - the actual text of the tweet
 * @param {KeywordConfig} config - The object containing the info used to test the keyword
 * @returns {boolean}
 */
const spacedOutKeyword = (
  tweetText: string,
  config: KeywordConfig,
  conditionalConfig?: ConditionalConfig,
): boolean => {
  const { lengthOfKeyword } = config;

  let indexStartOfKeyword: any = null;
  let indexEndOfKeyword: number = 0;
  const relevantTerms: string[] = [];

  tweetText
    .split(' ')
    .filter((term: string) => includesIrrelevantChar(term, conditionalConfig))
    .join('')
    .split('')
    .forEach((term, currentIndex) => {
      const isAltMidTerm = termIsCorrectMidAlt(term, indexEndOfKeyword, config, currentIndex);
      const isStartTerm = termIsCorrectStart(term, indexStartOfKeyword, config, currentIndex);

      const isMiddleTerm = termIsCorrectMid(
        term,
        indexStartOfKeyword,
        indexEndOfKeyword,
        config,
        currentIndex,
      );
      const isEndTerm = termIsCorrectEnd(
        term,
        indexEndOfKeyword,
        indexStartOfKeyword,
        config,
        currentIndex,
      );

      if (isStartTerm) {
        relevantTerms.push(term);
        indexStartOfKeyword = currentIndex;
      }

      if (isMiddleTerm || isAltMidTerm) relevantTerms.push(term);

      if (isEndTerm) {
        relevantTerms.push(term);
        indexEndOfKeyword = currentIndex;
      }

      return;
    });

  return (
    indexEndOfKeyword - indexStartOfKeyword === lengthOfKeyword ||
    relevantTerms.length === lengthOfKeyword
  );
};

/**
 * @desc Determine if the tweet contains the keyword. Return if the length of the 'validTerms' array is greater than 1.
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
 * @desc Determine if the term is the exact keyword (i.e. the term cannot have letters after it)
 * @param {string} term - a single term/word in the tweet to examine
 * @param {KeywordConfig} config - The object containing the info used to test the keyword
 * @return {boolean}
 */
const termContainsKeywordAndNoLettersAfter = (term: string, config: KeywordConfig): boolean => {
  const {
    earliestStartingIndexOfKeyword,
    startOfKeyword,
    endOfKeyword,
    arrayLengthOfKeyword,
  } = config;
  const hasSuffixChar = aSuffixCharExistsAndItsNotALetter(term, config);

  return (
    term.split('')[earliestStartingIndexOfKeyword] === startOfKeyword &&
    term.split('')[arrayLengthOfKeyword] === endOfKeyword &&
    hasSuffixChar
  );
};

/**
 * @desc Determine if the term has a suffix char. If no suffix char is present, or the suffix char is not a letter, return true, else return false
 * @param {string} term - A single term to examine
 * @param {KeywordConfig} config - The object containing the info used to test the keyword
 * @return {boolean} whether the term in the tweet is the keyword
 */
const aSuffixCharExistsAndItsNotALetter = (term: string, config: KeywordConfig): boolean => {
  const { earliestSuffixCharIndexLocation, lengthOfKeyword } = config;

  if (!term.split('')[earliestSuffixCharIndexLocation]) return true;
  if (term.split('')[lengthOfKeyword] && !term.split('')[lengthOfKeyword].match(/[a-zA-Z]/i))
    return true;

  return false;
};

const termIsCorrectStart = (
  term: string,
  indexStartOfKeyword: number,
  config: KeywordConfig,
  currentIndex: number,
): boolean => {
  const { startOfKeyword, lengthOfKeyword, completeKeywordArr } = config;

  return (
    term.toLowerCase() === startOfKeyword &&
    completeKeywordArr.includes(term) &&
    currentIndex !== lengthOfKeyword &&
    !indexStartOfKeyword
  );
};

const termIsCorrectMid = (
  term: string,
  indexStartOfKeyword: number,
  indexEndOfKeyword: number,
  config: KeywordConfig,
  currentIndex: number,
): boolean => {
  const { endOfKeyword, completeKeywordArr } = config;

  return (
    currentIndex > indexStartOfKeyword &&
    completeKeywordArr.includes(term) &&
    indexEndOfKeyword === 0 &&
    term !== endOfKeyword &&
    !indexStartOfKeyword &&
    !!term
  );
};

const termIsCorrectMidAlt = (
  term: string,
  indexEndOfKeyword: number,
  config: KeywordConfig,
  currentIndex: number,
): boolean => {
  const { completeKeywordArr } = config;

  return (
    completeKeywordArr.includes(term) &&
    currentIndex < indexEndOfKeyword &&
    indexEndOfKeyword !== 0 &&
    !!term
  );
};

const termIsCorrectEnd = (
  term: string,
  indexEndOfKeyword: number,
  indexStartOfKeyword: number,
  config: KeywordConfig,
  currentIndex: number,
): boolean => {
  const { completeKeywordArr, endOfKeyword, arrayLengthOfKeyword } = config;

  return (
    currentIndex === indexStartOfKeyword + arrayLengthOfKeyword &&
    term.toLowerCase() === endOfKeyword &&
    completeKeywordArr.includes(term) &&
    indexEndOfKeyword === 0 &&
    !!indexStartOfKeyword
  );
};
