import * as P5 from 'p5'

let _: P5;

let samplesPerFrame = 4;
let numFrames = 100;
let shutterAngle = 1.5;
let n = 999;
let points;

function setup_() {
    points = new Array(n)
        .fill(0)
        .map((d, i) => ({
            cos: _.cos(_.TWO_PI * i / n),
            sin: _.sin(_.TWO_PI * i / n),
            idx: i / n,
            size: _.random(1, 5),
            offset: _.random(10)
        }));

    points.forEach(pt => {
        pt.rads = {};
        time.forEach(t => pt.rads[t] = 150 + 80 * _.sin(_.TWO_PI * t + pt.offset));
    })
}

let vs = `
    precision highp float;

    attribute vec3 aPosition;
    
    void main() { 
        gl_Position = vec4(aPosition, 1.0); 
    }
`;

let fs = `
    precision highp float;

    uniform vec2 resolution;
    uniform float time;

		${
    new Array(samplesPerFrame)
        .fill(0)
        .map((d, i) => `uniform sampler2D tex${i};`)
        .join('')}

    void main() {
		vec2 pos = gl_FragCoord.xy / resolution.xy;
		vec4 c = vec4(0);
		${
    new Array(samplesPerFrame)
        .fill(0)
        .map((d, i) => `c += texture2D(tex${i}, pos);`)
        .join('')}
        
        c /= float(${samplesPerFrame});
        gl_FragColor = c;
    }
`;

let shaders;
const textures = new Array(samplesPerFrame);
let time = [];
let w2, h2;
let radius, x, y;

function render(tex, t) {
    tex.background(0);
    tex.stroke(255, 200);

    points.forEach(pt => {
        tex.strokeWeight(pt.size);
        x = w2 + pt.rads[t] * pt.cos;
        y = h2 + pt.rads[t] * pt.sin;
        tex.stroke(_.color(pt.idx, 1, 1))
        tex.point(x, y);
    });
    for (let i = 0; i < points.length; i++) {
        if (points[i].idx > 1) points[i].idx = 0;
        else points[i].idx += (n/100) / n;
    }
}

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight, _.WEBGL);
        init();
        _.colorMode(_.HSB, 1)

        console.clear();

        for (let j = 0; j < numFrames; j++) {
            for (let i = 0; i < samplesPerFrame; i++) {
                time.push(_.map(j + i * shutterAngle / samplesPerFrame, 0, numFrames, 0, 1));
            }
        }

        setup_();
        _.pixelDensity(1);
        w2 = _.width / 2;
        h2 = _.height / 2;

        shaders = _.createShader(vs, fs);
        console.log(vs)
        console.log(fs)
        _.shader(shaders);
        shaders.setUniform('resolution', [_.width, _.height]);

        for (let i = 0; i < samplesPerFrame; i++) {
            textures[i] = _.createGraphics(_.width, _.height, _.WEBGL);
            shaders.setUniform(`tex${i}`, textures[i]);
        }
    };

    function init(): void {
        _.background(0);
        _.frameRate(60);
        _.noStroke();
        _.smooth();
    }

    p.draw = () => {
        for (let i = 0; i < samplesPerFrame; i++) {
            textures[i].push();
            textures[i].translate(-w2, -h2);
            render(textures[i], time[i + ((_.frameCount - 1) % numFrames) * samplesPerFrame]);
            textures[i].pop();
        }

        _.quad(-1, -1, -1, 1, 1, 1, 1, -1);
    };
});