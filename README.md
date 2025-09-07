# Naive Bayes Text Classifier

A simple JavaScript implementation of a Naive Bayes classifier for text classification.

## Quick Start

```javascript
// Create a classifier
let classifier = new Classifier();

// Train it with examples
classifier.train('I am happy', 'positive');
classifier.train('I am sad and disappointed', 'negative');
classifier.train('This is okay', 'neutral');

// Classify new text
let results = classifier.guess('I feel great today!');
console.log(results);
// → { positive: { probability: 0.85 }, negative: { probability: 0.10 }, neutral: { probability: 0.05 } }
```

## Naive Bayes

Naive Bayes uses **Bayes' theorem** to calculate the probability that a text belongs to each category.

The notation: **P(A|B)** means "the probability of A given that B is true". For example:

- P(rain|cloudy) = "probability of rain given that it's cloudy"
- P(positive|"happy") = "probability text is positive given it contains the word 'happy'"

Bayes' theorem says:

```
P(category|text) = P(text|category) × P(category) / P(text)
```

In plain English: "How likely is this category, given this text?" equals "How likely is this text in this category?" times "How common is this category overall?"

The "naive" assumption is that words are independent of each other, so:

```
P(text|category) = P(word1|category) × P(word2|category) × P(word3|category) × ...
```

## Laplace Smoothing

What happens if the classifier sees a word it's never encountered before? Without smoothing, P(word|category) = 0, which makes the entire probability 0 (since we're multiplying).

**Laplace smoothing** solves this by pretending every possible word appears at least once:

- Add +1 to every word count (even words we've never seen)
- Add +vocabulary_size to the total word count for each category

**Example:** Category "positive" has seen 100 words, vocabulary has 1000 unique words total.

- Word "amazing" appeared 5 times: P("amazing"|positive) = (5 + 1) / (100 + 1000) = 6/1100
- Word "zxqwerty" never seen: P("zxqwerty"|positive) = (0 + 1) / (100 + 1000) = 1/1100

This way, no word gets exactly 0 probability, but rare and unseen words get low probabilities.

## Resources

- [Bayes theorem, the geometry of changing beliefs](https://youtu.be/HZGCoVF3YvM) by 3Blue1Brown
- [Explaining Bayesian Problems Using Visualizations](https://youtu.be/D8VZqxcu0I0) by Luana Micallef -
- [A Plan for Spam](http://www.paulgraham.com/spam.html) by Paul Graham
- [Naive Bayes Classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier)
- [Bayes' Theorem](https://en.wikipedia.org/wiki/Bayes%27_theorem) - The mathematical foundation
- [Laplace Smoothing](https://en.wikipedia.org/wiki/Additive_smoothing) - Handling zero probabilities
