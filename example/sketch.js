function setup() {
  noCanvas();

  let classifier = new Classifier();

  classifier.train("I am happy.", "A");
  classifier.train("I am sad.", "B");
  classifier.train("I have mixed feelings.", "C");

  let category = classifier.guess("Yesterday, I was happy.");
  console.log(category);

}
