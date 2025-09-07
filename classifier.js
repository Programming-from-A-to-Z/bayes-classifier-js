// Simple Naive Bayes Text Classifier
//
// Bayes' theorem: P(A|B) = P(B|A) * P(A) / P(B)
// For classification: P(category|text) = P(text|category) * P(category) / P(text)
//
// The "naive" assumption: words are independent of each other
// So: P(text|category) = P(word1|category) * P(word2|category) * ...

class Classifier {
  constructor() {
    // Dictionary to store word counts per category
    // Structure: { word: { category1: count, category2: count, ... } }
    // Example: { "happy": { "positive": 5, "negative": 1 } }
    this.wordCounts = {};

    // Store category statistics
    // Structure: { category: { documentCount: N, wordCount: N } }
    // documentCount: how many texts for this category
    // wordCount: total words across all texts for this category
    this.categories = {};

    // Total number of documents across all categories
    this.totalDocuments = 0;

    // Total unique words (vocabulary size)
    // Used for Laplace smoothing to handle unseen words
    this.vocabularySize = 0;
  }

  // Add a word to the vocabulary for a specific category
  // This is called during training to build our word frequency database
  addWord(word, category) {
    // First time seeing this word? Add it to vocabulary
    if (!this.wordCounts[word]) {
      this.wordCounts[word] = {};
      this.vocabularySize++;
    }

    // Initialize count for this word in this category if needed
    if (!this.wordCounts[word][category]) {
      this.wordCounts[word][category] = 0;
    }

    // Increment: how many times this word appears in this category
    this.wordCounts[word][category]++;

    // Also increment total word count for this category
    this.categories[category].wordCount++;
  }

  // Train the classifier with a text sample and its category
  train(text, category) {
    // Initialize category if first time seeing it
    if (!this.categories[category]) {
      this.categories[category] = {
        documentCount: 0,
        wordCount: 0,
      };
    }

    // Increment document count for this category
    this.categories[category].documentCount++;
    this.totalDocuments++;

    // Split text into words and process each one
    let words = text.toLowerCase().split(/\W+/);

    for (let word of words) {
      if (validateWord(word)) {
        this.addWord(word, category);
      }
    }
  }

  // Calculate P(word|category)
  // How likely is this word given the category?
  wordProbability(word, category) {
    // How many times did this word appear in this category?
    // Is this a word we've seen?
    let wordCount = 0;
    if (this.wordCounts[word] && this.wordCounts[word][category]) {
      wordCount = this.wordCounts[word][category];
    }

    // Total words in this category
    let categoryWordCount = this.categories[category].wordCount;

    // LAPLACE SMOOTHING (add-one smoothing):
    // We add 1 to this word's count to prevent zero probabilities
    // But we also add vocabularySize to denominator since we are essentially
    // adding 1 count for every possible word

    // Example: Category has 500 real words, vocabulary has 1000 unique words
    //   P("amazing") = (0 + 1) / (500 + 1000) = 1/1500 (unseen word)
    //   P("happy") = (10 + 1) / (500 + 1000) = 11/1500 (seen 10 times)
    //   All 1000 word probabilities will sum to exactly 1.0 ✓
    return (wordCount + 1) / (categoryWordCount + this.vocabularySize);
  }

  // Calculate P(category) - the prior probability of each category
  // This is how common each category is in our training data
  categoryProbability(category) {
    return this.categories[category].documentCount / this.totalDocuments;
  }

  // Classify new text using Naive Bayes theorem
  // Returns probability that the text belongs to each category
  guess(text) {
    // Clean and split the input text into words
    let words = text.toLowerCase().split(/\W+/);
    // Only validated words
    words = words.filter((word) => validateWord(word));

    let results = {};

    // Calculate probability for each category we've trained on
    let categories = Object.keys(this.categories);

    for (let category of categories) {
      // Start with the prior probability P(category)
      // How common is this category in our training data?
      let probability = this.categoryProbability(category);

      // For each word, multiply by P(word|category)
      // This assumes words are independent (the "naive" assumption)
      for (let word of words) {
        probability *= this.wordProbability(word, category);
      }

      results[category] = { probability: probability };
    }

    // NORMALIZATION: Make all probabilities sum to 1
    // This converts raw scores to proper probabilities
    let probabilitySum = 0;
    for (let category of categories) {
      probabilitySum += results[category].probability;
    }
    for (let category of categories) {
      results[category].probability /= probabilitySum;
    }
    return results;
  }
}

// Check if a word token is valid (contains letters/numbers)
// Filters out punctuation and empty strings
function validateWord(token) {
  return /\w+/.test(token);
}
