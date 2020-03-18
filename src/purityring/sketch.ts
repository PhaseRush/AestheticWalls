import * as P5 from 'p5'
import {DoublePendulum} from "../doublependulum/DoublePendulum";
import {frameEpsilon, SimplePoint2D} from "../Util/Util";

let _: P5;

let poly: SimplePoint2D[] = [];
let numSides = 100;
let pendulum: DoublePendulum;

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        init();
    };

    function initPendulum() {
        const r1 = _.height / 6;
        const r2 = _.height / 3;
        const m1 = 20;
        const m2 = 10;
        const a1 = _.PI / _.randomGaussian(2, 0.4) * _.random([1, -1]);
        const a2 = _.PI / _.randomGaussian(2, 0.4) * _.random([1, -1]);
        const a_v1 = 0;
        const a_v2 = 0;
        const cx = _.width / 2;
        const cy = _.height / 4;
        const nodeColor = _.color("0xFFFFFF");
        const historyColour = _.color("0xFFFFFF");

        pendulum = new DoublePendulum(
            _, 1, r1, r2, m1, m2, a1, a2, a_v1, a_v2, cx, cy, nodeColor, historyColour, 255,
            true, false, false
        );
    }

    function restoreRingSettings() {
        _.strokeWeight(12);
        _.noFill();
        _.noStroke();
    }

    function init(): void {
        _.background(0);
        _.frameRate(60);

        restoreRingSettings();
        numSides++;

        for (let i = 0; i < numSides; i++) {
            poly.push({
                x: (_.width / 2) + (_.height / 5) * _.sin(_.map(i, 0, numSides - 1, 0, _.TAU)),
                y: (_.height / 2) + (_.height / 5) * _.cos(_.map(i, 0, numSides - 1, 0, _.TAU))
            })
        }
        initPendulum();
    }

    p.draw = () => {
        // use default blend mode for background
        _.blendMode(_.BLEND);
        _.background(0);

        if (_.frameCount % (_.frameRate() * 180) < frameEpsilon) { // every 3 minutes
            initPendulum();
        }

        pendulum.update();

        const pendulumTip: SimplePoint2D = pendulum.getTip();

        function pendulumDistance(x: number, y: number): number {
            return _.dist(pendulumTip.x, pendulumTip.y, x, y) / 4;
        }


        // use additive blend mode to separate color channels
        restoreRingSettings();
        _.blendMode(_.ADD);
        _.stroke(255, 0, 0);
        drawPoly(1000, 1000, pendulumDistance);

        _.stroke(0, 255, 0);
        drawPoly(2000, 2000, pendulumDistance);

        _.stroke(0, 0, 255);
        drawPoly(3000, 3000, pendulumDistance);
    };

    // based off of linear regression + existing p5.map function
    function logMap(value: number, start1: number, stop1: number, start2: number, stop2: number) {
        start2 = _.log(start2);
        stop2 = _.log(stop2);
        return _.exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
    }

    type distortionFunctionType = (x: number, y: number) => number;

    // allow for simulated mouse positions
    function drawPoly(dx: number, dy: number, distortionFunction: distortionFunctionType = (x: number, y: number) => {
        return _.dist(_.mouseX, _.mouseY, x, y);
    }) {
        _.beginShape();
        poly.forEach(gon => {
            let distortion = distortionFunction(gon.x, gon.y);
            _.vertex(gon.x + dx / logMap(distortion, _.width, 0, dx, 45),
                gon.y + dy / logMap(distortion, _.height, 0, dy, 45))
        });
        _.endShape();
    }

});