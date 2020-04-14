import * as P5 from 'p5'

let _: P5;

let rOuter = 180;
let rInner = 18;

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight, _.WEBGL);
        init();
    };

    function init(): void {
        _.frameRate(60);
        _.noStroke();
        _.smooth();

        rOuter = _.height / 8;
        rInner = _.height / 144;
    }

    function renderTorus() {
        _.push();
        _.fill("white");
        // _.noFill();
        // _.stroke("#f7beff");
        _.translate(-rOuter / 2, -_.height / 4, 0);
        _.rotateX(_.PI / 2);
        _.rotateZ(_.millis() / 1000);
        // _.emissiveMaterial();
        _.torus(rOuter, rInner);
        _.pop();
    }

    function renderSphere() {
        _.push();
        _.noFill();
        _.stroke("#f7beff");
        _.translate(-rOuter / 2, _.height / 7, 0);
        _.rotateY(_.millis() / 1000);
        _.sphere(rOuter);
        _.pop();
    }

    p.draw = () => {
        _.background(100);
        _.noStroke();
        renderTorus();
        renderSphere();
    };
});