import * as P5 from 'p5'

/*
Change this to what you want
 */
const config = {
    whiteOnBlack: true,
    whiteDvd: "https://raw.githubusercontent.com/PhaseRush/AestheticWalls/master/src/dvd/dvd_white.png",
    blackDvd: "https://raw.githubusercontent.com/PhaseRush/AestheticWalls/master/src/dvd/dvd_black.png"
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
        dvd = _.loadImage(config.whiteOnBlack ? config.whiteDvd : config.blackDvd)

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
        update()
    };
});