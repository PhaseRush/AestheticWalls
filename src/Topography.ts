// import * as p5 from 'p5'
//
// const topography = function (p: p5) {
//
//     p.setup = () => {
//
//     };
//     p.draw = () => {
//
//     };
// };
//
// new p5(topography);

let x = 100;
let y = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0);
    fill(120);
    rect(x, y, 50, 50);
}