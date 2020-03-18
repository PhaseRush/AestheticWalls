import * as P5 from 'p5'

new P5((p: P5) => {
    p.setup = () => {
        p.createCanvas(500, 500);
        p.rect(0, 0, 100, 100);
    };

    p.draw = () => {
    };
});

// function setup() {
//     createCanvas(500, 500);
//     rect(0, 0, 20, 20);
// }