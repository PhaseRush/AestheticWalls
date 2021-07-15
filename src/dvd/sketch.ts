import * as P5 from 'p5'

/*
Change this to what you want
 */
const config = {
    whiteOnBlack: true,
    // imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DVD_logo.svg/320px-DVD_logo.svg.png"
    imagePath: `./assets/`
}


let _: P5;
let dvd: P5.Image
let refreshColor
let x, y, dx, dy;

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        init();
    };

    function init(): void {
        _.background(config.whiteOnBlack ? 255 : 0);
        refreshColor = config.whiteOnBlack ? `rgba(0%, 0%, 0%, 0.5)` : `rgba(100%, 100%, 100%, 0.5)`
        _.frameRate(165);
        _.noStroke();
        _.smooth();
        dvd = _.loadImage(config.imagePath + (config.whiteOnBlack ? "dvd_white.png" : "dvd_black.png"))

        x = 0
        y = 0
        dx = 10
        dy = 10
    }

    function update() {
        x += dx
        y += dy

        if (x + dvd.width > _.displayWidth || x < 0) dx *= -1
        if (y + dvd.height > _.displayHeight || y < 0) dy *= -1
    }

    p.draw = () => {
        _.background(refreshColor);
        _.image(dvd, x, y)

        // if (config.whiteOnBlack) {
        //     for (let x1 = x; x1 < dvd.width; x1++) {
        //         for (let y1 = 0; y1 < dvd.height; y1++) {
        //             let colour = _.get(x1, y1)
        //             _.set(x1, y1, [colour.map(value => 1 - value)].pop().push(100))
        //         }
        //     }
        // }

        update()
    };
});