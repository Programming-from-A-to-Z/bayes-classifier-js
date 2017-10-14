let classifier;
function setup() {
  noCanvas();

  classifier = new Classifier();

  classifier.train("I am happy.", "A");
  classifier.train("I am sad and I am very sad.", "B");
  classifier.train("I have mixed feelings.", "C");
  classifier.probabilities();

  let category = classifier.guess("Yesterday, I was very happy.");
  console.log(category);

}
