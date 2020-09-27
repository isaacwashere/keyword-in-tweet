# Keyword In Tweet

![](https://img.shields.io/npm/v/keyword-in-tweet?color=red&style=for-the-badge) ![](https://img.shields.io/npm/types/keyword-in-tweet?style=for-the-badge) ![](https://img.shields.io/npm/l/keyword-in-tweet?style=for-the-badge&color=red) ![](https://img.shields.io/bundlephobia/min/keyword-in-tweet?color=green&style=for-the-badge)

## Contents

[About](#about)  
[Installation](#installation)  
[Usage](#usage)
[Examples](#more-examples)

### About

- This package checks to see if the keyword you provided (irrespective of case) is in a tweet's text
  - Case is ignored
  - If the keyword contains a character that is considered, provided that character is not a reserved character
    - Reserved characters are: `"@", "#", ", '`
  - Link-ignoring (currently) only occurs with links that include `http`

### Installation

```shell
npm install keyword-in-tweet
```

### Usage

```js
import { KeywordInTweet } from 'keyword-in-tweet';

const myTweet = {
  text: '@Person hey there!',
};
const myKeyWord = 'hey';

// KeywordInTweet would return true
const isMyKeywordPresent = KeywordInTweet(myTweet.text, myKeyword);
```

### More Examples

Here are a few more examples:

Example A: With the following example, `KeywordInTweet` would return true

```js
import { KeywordInTweet } from 'keyword-in-tweet';

const myTweet = {
  text: '@Person !hey! there, #HeyItsTime! @PersonTwo @HeyYou Hey',
};
const myKeyWord = 'hey';

const isMyKeywordPresent = KeywordInTweet(myTweet.text, myKeyword);
```

Example B: With the following example, `KeywordInTweet` would return false since the exact word, in that format is not in the tweet

```js
import { KeywordInTweet } from 'keyword-in-tweet';

const myTweet = {
  text: '@Person !hey! there, #HeyItsTime! @PersonTwo @HeyYou',
};
const myKeyWord = 'hey';

const isMyKeywordPresent = KeywordInTweet(myTweet.text, myKeyword);
```
