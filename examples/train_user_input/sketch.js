let classifier = new Classifier();
let results = [];

function setup() {
  noCanvas();

  let input_sentence = select('#sentence');
  let input_category = select('#category');
  let valid_train = select('#validate_train');
  let guess = select('#guess');


  valid_train.mousePressed(add_train);
  guess.mousePressed(classifier_guess);
}

function add_train() {
  let input_sentence = select('#sentence');
  let input_category = select('#category');
  let list = select('#data');

  if (input_category.value() != "" && input_sentence.value() != "") {
    classifier.train(input_sentence.value(), input_category.value());

    elem = createElement('li', input_sentence.value() + " : " + input_category.value());
    list.child(elem);

    input_sentence.value("");
    input_category.value("");
  }

}

function classifier_guess() {
  for (let i = 0; i < results.length; i++) {
    results[i].remove();
  }

  let input_sentence = select('#sentence_guess');
  let res_list = select('#res_list');

  if (input_sentence.value() != "") {
    classifier.probabilities();
    let res = classifier.guess(input_sentence.value());
    console.log(res);

    let max = 0;
    let max_elem;

    for (let prob in res) {
      elem = createElement('li', prob + ' : ' + res[prob]['probability']);
      res_list.child(elem);
      results.push(elem);
      if (res[prob].probability > max) {
        max = res[prob].probability;
        max_elem = elem;
      }
    }
    max_elem.class('winner');

  }
}

function test_form() {
  let input_sentence = select('#sentence');
  let input_category = select('#category');
  let list_res = select('#validate_train');
  console.log('coucou');
  if (input_category.value() != "" && input_sentence.value() != "") {
    console.log('bou');
    valid_train.attribute('disabled', 'false');
  }
}
