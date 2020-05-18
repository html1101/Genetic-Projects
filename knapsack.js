//I'm gonna take another shot at genetic algorithms.
//But this time, I'm gonna use them to....
/*Bum, bum, bum.....
Actually solve things!!!!!
Okay, few key points:
1) I'm gonna spend a month camping with Daddy.
Oh no.
2) Daddy gives me a backpack which can hold 30 kg.
3) I have some items, each labelled with their weights
and their survival points.
4) I need to maximize the survival points I can carry.
Otherwise, KKKKKKKK-DEAD.
*/
//[item, weight, survival_points]
var details = [
    ["sleeping bag", 15, 15],
    ["rope", 3, 7],
    ["pocket knife", 2, 10],
    ["torch", 5, 5],
    ["bottle", 9, 8],
    ["glucose", 20, 17]
];
//1) Define our population, consisting of chromosomes
//2) So 1 - following item is taken
//0 - item is dropped
var max = 24;
//BOOM.
/* 
I understand. I understand it all!
We're gonna create chromosomes. For now, we're
Gonna use the ones on the website(https://www.analyticsvidhya.com/blog/2017/07/introduction-to-genetic-algorithm/).
*/
var chromosomes = [
    "100110",
    "001110",
    "010100",
    "011001"
];
var times = 0;
for(var i = 0; i < chromosomes.length; i++) {
    chromosomes[i] = [chromosomes[i].split("")];
    chromosomes[i][1] = (fitness(chromosomes[i][0]));
}
//Now we need to calculate how many survival points 
function run() {
var fitness_tests = [];
var weight_tests = [];
var add = 0;
for(var i = 0; i < chromosomes.length; i++) {
    fitness_tests.push(chromosomes[i][1]);
    weight_tests.push(weight(chromosomes[i][0]));
}
for(var i = 0; i < fitness_tests.length; i++) {
    add += fitness_tests[i];
}
var divisions = fitness_tests.slice();
divisions[0] = divisions[0]/add;
for(var i = 1; i < divisions.length; i++) {
    divisions[i] = divisions[i]/add + divisions[i-1];
}
//Now create two fixed points on our roulette wheel.
/*
This selection method is all and well, but it's not very good.
Problem is, our children HAVE to be better than the parent chromosomes, because they replace them.
Pick the red stone, and you can try a whole new way which will actually get you the right answer.
Pick the blue stone, and you can go back to your I-don't-wanna-do-it-so-I'll-try-a-hack-around methods.
I'm Sarah.
I'm different.
I'm picking the red stone.
Let's do this.
No.
I'm gonna do it.....
*/
var parent_a = Math.random();
var parent_b = Math.random();
for(var i = 0; i < divisions.length; i++) {
    if(parent_a < divisions[i]) {
        //This is the parent.
        parent_a = [fitness_tests[i], chromosomes[i][0]];
    }
    if(parent_b < divisions[i]) {
        //This is the parent.
        parent_b = [fitness_tests[i], chromosomes[i][0]];
    }
}
var childa = crossover(parent_a, parent_b)[0];
var childb = crossover(parent_a, parent_b)[1];
var testa = weight(childa);
var testb = weight(childb);
chromosomes = chromosomes.sort(function(a,b) {
    return a[1] - b[1];
});
console.log(chromosomes);
if(testa === true && testb === true) {
    chromosomes.splice(0, 2);
    //Check whether the children are worthy.
    chromosomes.push([childa, fitness(childa)]);
    chromosomes.push([childb, fitness(childb)]);
}
console.log(chromosomes);
/*var check_for_better = 0;
for(var i = 0; i < chromosomes.length; i++) {
    for(var ii = 0; ii < chromosomes[i][0].length; ii++) {
        if(chromosomes[i][0][ii] == "0") {
            chromosomes[i][0][ii] = "1";
            var testa = weight(chromosomes[i][0]);
            if(testa == false) {
                //Neeeevermind....
                chromosomes[i][0][ii] = "0";
                check_for_better++;
            }
        }
    }
}*/
var same = 0;
for(var i = 1; i < chromosomes.length; i++) {
    if(chromosomes[i-1][1] == chromosomes[i][1]) {
        same++;
    }
    else {
        same = 0;
    }
}
if(same >= chromosomes.length-3) {
    times++;
}
else {
    times = 0;
}
if(times % 50 == 0) {
var content = "";
for(var i = 0; i < times; i++) {
    content += "=";
}
//console.log('\033c');
}
if(times >= 50) {
    results(chromosomes);
    clearInterval(f);
}
}
var f = setInterval(run, 1);

function crossover(a, b) {
    a = a[1];
    b = b[1];
    //Only 1 split for now.
    var childa = [a.slice(0, a.length/2), b.slice(b.length/2, b.length)];
    var childb = [b.slice(0, b.length/2), a.slice(a.length/2, a.length)];
    childa = [].concat.apply([], childa);
    childb = [].concat.apply([], childb);
    var mutation_rate = 0.3;
    var rando = Math.random();
    if(rando <= mutation_rate) {
        var remem = Math.floor(Math.random()*childa.length);
        var choose = childa[remem];
        if(choose == "0") {
            choose = "1";
        }
        else {
            choose = "0";
        }
        childa[remem] = choose;
    }
    //Mutation makes it harder because if we got a current good score and something changes,
    //We have to start all over again.
    //So either small mutation rate or none at all.
    return [childa, childb];
};
function fitness(culprit) {
    var survival_points = 0;
    for(var i = 0; i < culprit.length; i++) {
        survival_points += Number(culprit[i]) * details[i][2];
    }
    return survival_points;
}
function weight(culprit) {
    var survival_points = 0;
    for(var i = 0; i < culprit.length; i++) {
        survival_points += Number(culprit[i]) * details[i][1];
    }
    return survival_points <= max;
}
function calc_weight(culprit) {
    var survival_points = 0;
    for(var i = 0; i < culprit.length; i++) {
        survival_points += Number(culprit[i]) * details[i][1];
    }
    return survival_points;
}

function results(ch) {
    for(var ii = 0; ii < ch[0][0].length; ii++) {
        console.log(Number(ch[0][0][ii])*details[ii][1] + " kg of " + details[ii][0]);
    }
    console.log("With a grand total survival score of " + ch[0][1] + ", and a weight of " + calc_weight(ch[0][0]));
}