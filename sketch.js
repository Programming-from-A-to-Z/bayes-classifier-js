let classifier;
let input, button, results;

function setup() {
  noCanvas();

  // Create classifier and train it
  classifier = new Classifier();
  classifier.train('I am happy and excited', 'positive');
  classifier.train('This is wonderful and amazing', 'positive');
  classifier.train('I am sad and disappointed', 'negative');
  classifier.train('This is terrible and awful', 'negative');

  // Create UI elements
  createP('Enter some text to classify:');
  input = createInput('I feel great today!');
  button = createButton('classify');
  button.mousePressed(classify);

  results = createDiv('');
  results.style('margin-top', '20px');
  results.style('font-family', 'monospace');
}

function classify() {
  let txt = input.value();
  if (txt) {
    let result = classifier.guess(txt);

    let output = 'Results:<br>';
    for (let category in result) {
      let percentage = (result[category].probability * 100).toFixed(1);
      output += category + ': ' + percentage + '%<br>';
    }

    results.html(output);
  }
}
