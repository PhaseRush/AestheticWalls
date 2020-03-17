import * as P5 from 'p5'

let _: P5;

let poly = [];
const numSides = 100;


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

        const halfWidth = (_.width / 2);
        const halfHeight = (_.height / 2);
        for (let i = 0; i < numSides; i++) {
            const mapped = _.map(i, 0, numSides - 1, 0, _.TAU);
            poly.push({
                x: halfWidth + 100 * _.sin(mapped),
                y: halfHeight + 100 * _.cos(mapped)
            })
        }
    }

    p.draw = () => {
        _.blendMode(_.BLEND);
        _.background(0);

        _.blendMode(_.ADD);

        _.stroke("0xFF0000");
        renderPoly(1000, 1000);

        _.stroke("0x00FF00");
        renderPoly(1200, 1500);

        _.stroke("0x0000FF");
        renderPoly(2000, 1700);
    };

    function renderPoly(dx: number, dy: number): void {
        const g = 0; // mutate this somehow

        _.beginShape();
        for (let i = 0; i < numSides; i++) {
            const distort = 0; // mutate this
            _.vertex(poly[i].x + dx / logMap(distort, _.width, 0, dx, 45) + g,
                poly[i].y + dy / logMap(distort, _.height, 0, dy, 45) + g);
        }
        _.endShape();
    }

    function logMap(value, start1, stop1, start2, stop2) {
        start2 = _.log(start2);
        stop2 = _.log(stop2);
        return _.exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
    }
});