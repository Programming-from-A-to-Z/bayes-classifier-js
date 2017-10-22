let classifier = new Classifier();

function setup() {
    noCanvas();

    let input_sentence = select('#sentence');
    let input_categorie = select('#categorie');
    let valid_train = select('#validate_train');
    let guess = select('#guess');



    // input_sentence.changed(test_form);
    // input_categorie.changed(test_form);

    valid_train.mouseClicked(add_train);
    guess.mouseClicked(classifier_gess);
    

    // Text to train, followed by category name
    // classifier.train("I am happy.", "happy");
    // classifier.train("I am sad and I am very sad.", "sad");
    // classifier.train("I have mixed feelings.", "mixed");
    // classifier.probabilities();

    // let results = classifier.guess("Yesterday, I was very very happy, so happy.");
    // console.log(results);
}
function add_train(){
    let input_sentence = select('#sentence');
    let input_categorie = select('#categorie');
    let list = select('#data');

    if (input_categorie.value() != "" && input_sentence.value() != "") {
        classifier.train(input_sentence.value(), input_categorie.value());

        elem = createElement('li', input_sentence.value() + " : " + input_categorie.value());
        list.child(elem);

        input_sentence.value("");
        input_categorie.value("");
        
    }

}

function classifier_gess(){
    let input_sentence = select('#sentence_gess');
    let res_liste = select('#res_liste');

    if (input_sentence.value() != ""){
        classifier.probabilities();
        let res = classifier.guess(input_sentence.value());
        console.log(res);
        
        let max = 0;
        let id = "";
        let cpt = 1;

        for(let prob in res){
            elem = createElement('li', prob + ' : ' + res[prob]['probability']);
            elem.id('res'+ cpt);
            res_liste.child(elem);
            if (res[prob]['probability'] > max){
                max = res[prob]['probability'];
                id = "res"+cpt;
            }
            cpt ++;
        }

        let elem_res = select('#' + id);
        elem_res.class('green');

    }
}

function test_form(){
    let input_sentence = select('#sentence');
    let input_categorie = select('#categorie');
    let list_res = select('#validate_train');
    console.log('coucou');
    if(input_categorie.value() != "" && input_sentence.value() != ""){
    console.log('bou');

    valid_train.attribute('disabled', 'false');
    }
}