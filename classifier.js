// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

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

  // A function to validate a toke
  static validate(token) {
    // For now anything that doesn't have at least
    // one word character is no good
    return /\w+/.test(token);
  }

  // Increment a word for a category
  increment(token, category) {

    // Increase the token count
    this.categories[category].tokenCount++;

    let word = this.dict[token];

    // Is this a new word?
    if (word === undefined) {
      this.dict[token] = {
          word: token,
          [category]: { count: 1 }
        };
      // Track the key
      this.wordList.push(token);
    } else if (word[category] === undefined) {
      word[category] = {
          count: 1
        };
    } else {
      word[category].count++;
    }

  }

  // Get some data to train
  train(data, category) {

    if (this.categories[category] === undefined) {
      this.categories[category] = {
          docCount: 1,
          tokenCount: 0
        };
      this.categoryList.push(category);
    } else {
      this.categories[category].docCount++;
    }

    // Split into words
    let tokens = data.split(/\W+/);

    // For every word
    tokens.forEach(token => {
      token = token.toLowerCase();
      // Make sure it's ok
      if (Classifier.validate(token)) {
        // Increment it
        this.increment(token, category);
      }
    });

  }

  // Compute the probabilities
  probabilities() {

    // Calculate all the frequencies
    // word count / doc count
    this.wordList.forEach(key => {
      let word = this.dict[key];

      this.categoryList.forEach(category => {
        // If this word has no count for the category set it to 0
        // TODO: better place to do this or unecessary?
        if (word[category] === undefined) {
          word[category] = {
              count: 0
            };
        }
        // Average frequency per document
        let wordCat = word[category];
        let cat = this.categories[category];
        let freq = wordCat.count / cat.docCount;
        wordCat.freq = freq;
      });
    });

    this.wordList.forEach(key => {
      let word = this.dict[key];
      // Probability via Bayes rule
      this.categoryList.forEach(category => {
        // Add frequencies together
        // Starting at 0, p is the accumulator
        let sum = this.categoryList.reduce((p, cat) => {
            let freq = word[cat].freq;
            if (freq) {
              return p + freq;
            }
            return p;
          }, 0);
        let wordCat = word[category];
        // Constrain the probability
        // TODO: Is there a better way to handle this?
        let prob = wordCat.freq / sum;
        wordCat.prob = Math.max(0.01, Math.min(0.99, prob));
      });
    });
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

    tokens.forEach(token => {
      token = token.toLowerCase();
      if (Classifier.validate(token)) {
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
    });

    // Combined probabilities
    // http://www.paulgraham.com/naivebayes.html
    // Multiply the probabilities and add the results to sum
    // Starting with an empty object, product is the accumulator
    let sum = 0;
    let products = this.categoryList.reduce((product, category) => {
        product[category] = words.reduce((prob, word) => {
            // Multiply probabilities together
            return prob * word[category].prob;
          }, 1);
        sum += product[category];
        return product;
      }, {});

    // Apply formula
    let results = {};
    this.categoryList.forEach(category => {
      results[category] = {
          probability: products[category] / sum
        };
      // TODO: include the relevant words and their scores/probabilities in the results?
    });
    return results;
  }

}
