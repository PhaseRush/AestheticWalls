import * as p5 from 'p5'

const rotBox = function (p: p5) {
    const strokeMod = 150;
    const transX = 3000;
    const transY = 300;
    const transZBase = 1000;
    const squareSideBase = 1000;


    let wheelModifier = 1.0;
    let modifier = 1.0;
    let C;

    p.setup = () => {
        p.createCanvas(p.displayWidth, p.displayHeight, p.WEBGL);
        p.strokeWeight(strokeMod * 2);
        C = 0;
    };
    p.draw = () => {
        const R = p.PI / 12 * modifier;
        p.clear();
        C++;
        p.rotateZ(R);
        p.rotateX(-R);
        p.rotateY(-R);
        p.translate(transX, transY, transZBase + (C % 8) * 100 / 8);
        for (let i = 0; i < 64; i++) {
            p.stroke(i * 8 * wheelModifier - C % 8);
            for (let j = 0; j < 15; j++) {
                p.square(-j * squareSideBase - (C * 3) % squareSideBase, 0, 750);
            }
            p.translate(0, 0, -100);
        }
    };
};

new p5(rotBox);