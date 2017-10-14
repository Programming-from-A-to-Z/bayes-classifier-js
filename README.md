# bayes-classifier-js
A JavaScript library for Bayesisan classification

Initial API ideas:

```javascript
let classifier = new Classifier();

// Text to train, followed by category name
classifier.train("I am happy.", "happy");
classifier.train("I am sad and I am very sad.", "sad");
classifier.train("I have mixed feelings.", "mixed");

let results = classifier.guess("Yesterday, I was very happy, very very very happy.");
console.log(results);
```
