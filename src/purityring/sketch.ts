import * as P5 from 'p5'

let _: P5;

let poly = [];
let numSides = 10;

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        init();
    };

    function init(): void {
        _.background(0);
        _.frameRate(60);

        _.strokeWeight(12);
        _.noFill();
        _.noStroke();
        numSides++;

        for (let i = 0; i < numSides; i++) {
            poly.push({
                x: (_.width / 2) + 100 * _.sin(_.map(i, 0, numSides - 1, 0, _.TAU)),
                y: (_.height / 2) + 100 * _.cos(_.map(i, 0, numSides - 1, 0, _.TAU))
            })
        }
    }

    p.draw = () => {
        // use default blend mode for background
        _.blendMode(_.BLEND);
        _.background(0);

        // use additive blend mode to separate color channels
        _.blendMode(_.ADD);
        _.stroke(255, 0, 0);
        drawPoly(1000, 1000);

        _.stroke(0, 255, 0);
        drawPoly(1200, 1500);

        _.stroke(0, 0, 255);
        drawPoly(2000, 1700);
    };

    // based off of linear regression + existing p5.map function
    function logMap(value: number, start1: number, stop1: number, start2: number, stop2: number) {
        start2 = _.log(start2);
        stop2 = _.log(stop2);
        return _.exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
    }

    type distortionFunction = (x: number, y: number) => number;

    // allow for simulated mouse positions
    function drawPoly(dx: number, dy: number, distortionFunction = (x: number, y: number) => {
        return _.dist(_.mouseX, _.mouseY, x, y);
    }) {
        _.beginShape();
        for (let i = 0; i < numSides; i++) {
            let distortion = distortionFunction(poly[i].x, poly[i].y);
            _.vertex(poly[i].x + dx / logMap(distortion, _.width, 0, dx, 45),
                poly[i].y + dy / logMap(distortion, _.height, 0, dy, 45))
        }
        _.endShape();
    }

});