const strokeWeight = 150;
const transX = 3000;
const transY = 300;
const transZBase = 1000;
const squareSideBase = 1000;


let wheelModifier = 1.0;
let modifier = 1.0;

setup = _ => {
    createCanvas(displayWidth, displayHeight, WEBGL);
    strokeWeight(strokeWeight*2);
    C = 0;
};
draw = _ => {
    const R = PI / 12 * modifier;
    clear();
    C++;
    rotateZ(R);
    rotateX(-R);
    rotateY(-R);
    translate(transX, transY, transZBase + (C % 8) * 100 / 8);
    for (let i = 0; i < 64; i++) {
        stroke(i * 8 * wheelModifier - C % 8);
        for (j = 0; j < 15; j++) {
            square(-j * squareSideBase - (C * 3) % squareSideBase, 0, 750);
        }
        translate(0, 0, -100);
    }
};

function mouseWheel(event) {
  // wheelModifier += event.delta/1000.0;
  // modifier += event.delta/1000.0;
}