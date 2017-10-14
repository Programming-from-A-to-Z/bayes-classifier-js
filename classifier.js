// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// A function to validate a toke
function validate(token) {
  // For now anything that doesn't have at least
  // one word character is no good
  return /\w{1,}/.test(token);
}

// An object that does classification with us of words
class Classifier {

  constructor() {

    // Word objects
    // Category counts
    // Category probabilities
    this.dict = {};

    // Each category
    // total tokens
    // total documents
    this.categories = {};

    // An array of just the words and categories for sorting
    // This is redundant and could probably be removed
    this.wordList = [];
    this.categoryList = [];

  }
  // Increment a word for a category
  increment(token, category) {

    // Increase the token count
    this.categories[category].tokenCount++;

    // Is this a new word?
    if (this.dict[token] === undefined) {
      this.dict[token] = {};
      this.dict[token][category] = {};
      this.dict[token][category].count = 1;
      this.dict[token].word = token;
      // Track the key
      this.wordList.push(token);
    } else {
      if (this.dict[token][category] == undefined) {
        this.dict[token][category] = {};
        this.dict[token][category].count = 1;
      } else {
        this.dict[token][category].count++;
      }
    }

  }


  // Get some data to train
  train(data, category) {

    if (this.categories[category] === undefined) {
      this.categories[category] = {};
      this.categories[category].docCount = 1;
      this.categories[category].tokenCount = 0;
      this.categoryList.push(category);
    } else {
      this.categories[category].docCount++;
    }

    // Split into words
    let tokens = data.split(/\W+/);

    // For every word
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i].toLowerCase();
      // Make sure it's ok
      if (validate(token)) {
        // Increment it
        this.increment(token, category);
      }
    }

  }

  // Compute the probabilities
  probabilities() {

    // Calculate all the frequences
    // word count / doc count
    for (let i = 0; i < this.wordList.length; i++) {
      let key = this.wordList[i];
      let word = this.dict[key];

      for (let j = 0; j < this.categoryList.length; j++) {
        let category = this.categoryList[j];

        // If this word has no count for the category set it to 0
        // TODO: better place to do this or unecessary?
        if (word[category] === undefined) {
          word[category] = {};
          word[category].count = 0;
        }
        // Average frequency per document
        word[category].freq = word[category].count / this.categories[category].docCount;
      }
    }

    for (let i = 0; i < this.wordList.length; i++) {
      let key = this.wordList[i];
      let word = this.dict[key];
      // Probability via Bayes rule
      for (let j = 0; j < this.categoryList.length; j++) {
        let sum = 0;
        for (let k = 0; k < this.categoryList.length; k++) {
          let category = this.categoryList[k];
          let freq = word[category].freq;
          if (freq) {
            sum += word[category].freq;
          }
        }
        let category = this.categoryList[j];
        word[category].prob = word[category].freq / sum;
        // Nothing is certain
        // TODO: Is there a better way to handle this?
        if (word[category].prob < 0.01) word[category].prob = 0.01;
        if (word[category].prob > 0.99) word[category].prob = 0.99;
      }
    }
  }


  // Now we have some data we need to guess
  guess(data) {

    // All the tokens
    let tokens = data.split(/\W+/);

    // Now let's collect all the probability data
    let words = [];

    // TODO: If a word appears more than once should I add it just once or
    // the number of times it appears?
    // let hash = {};

    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i].toLowerCase();
      if (validate(token)) {
        // Collect the probability
        if (this.dict[token] !== undefined) { // && !hash[token]) {
          let word = this.dict[token];
          words.push(word);
        }
        // hash[token] = true;
      } else {
        // For an unknown word
        // We could just not include this (would be simpler)
        // Or we might decide that unknown words are likely to be a certain category?
        // word = {};
        // fill in probabilities
        // words.push(word);
      }
    }

    // Combined probabilities
    // http://www.paulgraham.com/naivebayes.html
    let products = {};
    for (let i = 0; i < this.categoryList.length; i++) {
      let category = this.categoryList[i];
      products[category] = 1;
    }

    // Multiply probabilities together
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      for (let j = 0; j < this.categoryList.length; j++) {
        let category = this.categoryList[j];
        products[category] *= word[category].prob;
      }
    }

    // Apply formula
    let sum = 0;
    for (let i = 0; i < this.categoryList.length; i++) {
      let category = this.categoryList[i];
      sum += products[category];
    }

    let results = {};
    for (let i = 0; i < this.categoryList.length; i++) {
      let category = this.categoryList[i];
      results[category] = {};
      results[category].probability = products[category] / sum;
      // TODO: include the relevant words and their scores/probabilities in the results?
    }
    return results;
  }
}
