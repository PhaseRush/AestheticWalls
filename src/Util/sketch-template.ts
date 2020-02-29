// This file is a blank sketch template

import * as P5 from 'p5'

let _: P5;

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        init();
    };

    function init(): void {
        _.background(0);
        _.frameRate(60);
        _.noStroke();
        _.smooth();
    }

    p.draw = () => {
    };
});