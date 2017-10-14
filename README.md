# bayes-classifier-js
A JavaScript library for Bayesisan classification

Initial API ideas:

```javascript
let classifier = new Classifier();

classifier.train("I am happy.", "A");
classifier.train("I am sad and I am very sad.", "B");
classifier.train("I have mixed feelings.", "C");

let results = classifier.guess("Yesterday, I was very happy.");
console.log(results);
```
