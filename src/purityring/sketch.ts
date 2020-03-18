import * as P5 from 'p5'

let _: P5;

// polygon array and number of verts
let poly = []
let n = 10 // feel free to play with this number :)

// canvas size variables
let w;
let h;


new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        init();
    };

    function init(): void {
        _.background(0);
        _.frameRate(60);

        _.strokeWeight(12)
        _.noFill()
        _.cursor(_.HAND)
        _.noStroke()
        n++ // add extra point for closing the polygon

        w = _.width;
        h = _.height;

        for (let i = 0; i < n; i++) {
            // populate regular polygon vertices given number of points n
            let a = {
                x: (w / 2) + 100 * _.sin(_.map(i, 0, n - 1, 0, _.TAU)),
                y: (h / 2) + 100 * _.cos(_.map(i, 0, n - 1, 0, _.TAU))
            }
            poly.push(a)
        }
    }

    p.draw = () => {
        // use default blend mode for background
        _.blendMode(_.BLEND)
        _.background(0, 0, 0)

        // use additive blend mode to separate color channels
        _.blendMode(_.ADD)
        _.stroke(255, 0, 0)
        drawPoly(1000, 1000)

        _.stroke(0, 255, 0)
        drawPoly(1200, 1500)

        _.stroke(0, 0, 255)
        drawPoly(2000, 1700)

    };

    function logMap(value, start1, stop1, start2, stop2) {
        // based off of linear regression + existing p5.map function
        start2 = _.log(start2)
        stop2 = _.log(stop2)

        return _.exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
    }

    function drawPoly(dx, dy) {
        // draws polygon given vertices in the poly[] array, adds mouse bias using params

        let g = 0
        if (_.mouseIsPressed)
            g = _.randomGaussian(0, _.sqrt(2))

        _.beginShape()
        for (let i = 0; i < n; i++) {
            let bias = _.dist(_.mouseX, _.mouseY, poly[i].x, poly[i].y)
            _.vertex(poly[i].x + dx / logMap(bias, w, 0, dx, 45) + g, poly[i].y + dy / logMap(bias, h, 0, dy, 45) + g)
        }
        _.endShape()
    }

});