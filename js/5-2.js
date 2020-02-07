/**
 * Starter file for 5-2.js - the second exercise of page 5 of Workbook 2
 */

// we do enable typescript type checking - see
// http://graphics.cs.wisc.edu/WP/cs559-sp2019/typed-js/
// and
// https://github.com/Microsoft/TypeScript/wiki/Type-Checking-JavaScript-Files
// @ts-check

/* Set options for jshint (my preferred linter)
 * disable the warning about using bracket rather than dot
 * even though dot is better
 * https://stackoverflow.com/questions/13192466/how-to-suppress-variable-is-better-written-in-dot-notation
 */
/* jshint -W069, esversion:6 */

window.onload = function () {
    // student puts their code here
    /** @type {HTMLCanvasElement} */
    let canvas = (/** @type {HTMLCanvasElement} */ document.getElementById("box2canvas"));
    let context = canvas.getContext('2d');

    let fworks = [];
    let expls = [];

    let mouseX = -10;
    let mouseY = -10;

    let lastWorkTime = 0;
    let interval = 3000;


    // when the mouse moves in the canvas, remember where it moves to
    canvas.onmousemove = function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        // unfortunately, X,Y is relative to the overall window -
        // we need the X,Y inside the canvas!
        // we know that event.target is a HTMLCanvasElement, so tell typescript
        let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
        mouseX -= box.left;
        mouseY -= box.top;
    };

    canvas.onmouseleave = function () {
        mouseX = -10;
        mouseY = -10;
    };

    canvas.onclick = function () {
        if ((mouseX > 0) && (mouseY > 0)) {
            let x = Math.random() * (400 - 0) + 0;
            let y = 400;
            let destX = mouseX;
            let destY = mouseY;
            let vx = (destX - x) / 100;
            let vy = (destY - y) / 100;
            let color = getRndColor();
            fworks.push({ "x": x, "y": y, "dx": mouseX, "dy": mouseY, "vx": vx, "vy": vy, "madeIt": false, "color": color });
        }
    };

    function makeRandomWork() {
        if (performance.now() - lastWorkTime > interval) {
            lastWorkTime = performance.now();
            let x = Math.random() * (400 - 0) + 0;
            let y = 400;
            let destX = Math.random() * (400 - 0) + 0;
            let destY = Math.random() * (400 - 0) + 0;
            let vx = (destX - x) / 100;
            let vy = (destY - y) / 100;
            let color = getRndColor();
            fworks.push({ "x": x, "y": y, "dx": destX, "dy": destY, "vx": vx, "vy": vy, "madeIt": false, "color": color });
        }
    }

    /* makes an explosion in a shape*/
    function makeShapedExpl(x, y, color) {
        let xDir = 1;
        for (let i = 0; i < 4; i++) {
            if (i == 1 || i == 3) {
                xDir = -1;
            } else {
                xDir = 1;
            }
            let yDir = 0;
            for (let j = 0; j < 10; j++) {
                expls.push({ "x": x, "y": y, "vx": xDir, "vy": yDir, "color": color, "size": 3 });
                yDir = yDir + (0.1 * xDir);
                xDir = xDir / 1.1;
            }
        }
    }
    function makeCircleWork(x ,y, color) {
        for (let i = 0; i < 36; i++) {
            context.save();
            context.rotate((Math.PI/180) * i * 10);
            expls.push({"x": x, "y": y, "vx": 1, "vy": 1, "color": color, "size": 4});
            context.restore();
        }
    }

    function drawWorks() {
        makeRandomWork();
        fworks.forEach(function (work) {
            if (!work.madeIt) {
                context.save();
                context.fillStyle = work.color;
                context.beginPath();
                context.arc(work.x, work.y, 5, 0, Math.PI * 2, false);
                context.fill();
                context.closePath();
                context.restore();
                work.x += work.vx;
                work.y += work.vy;
                // if firework has made it to dest, then halt its movement and populate its explosions
                if (work.y <= work.dy) {
                    work.madeIt = true;
                    work.vx = 0;
                    work.vy = 0;
                    let chooseShape = Math.random() * (10 - 0) + 0;
                    if (chooseShape > 3.5 && chooseShape < 6.0) {
                        makeShapedExpl(work.dx, work.dy, work.color);
                    } else {
                        // 10 - 20 projectiles for each firework
                        let numExplosions = Math.random() * (20 - 10) + 10;
                        for (let i = 0; i < numExplosions; i++) {
                            let vx = (Math.random() - 0.5) * 3;
                            let vy = (Math.random() - 0.5) * 3;
                            expls.push({ "x": work.dx, "y": work.dy, "vx": vx, "vy": vy, "color": work.color, "size": 3 });
                        }
                    }

                }
            }
        });
        // move explosions
        expls.forEach(function (ex) {
            ex.x -= ex.vx;
            ex.y -= ex.vy;
        });
        // filter explosions off the screen
        expls = expls.filter(dot => ((dot.y > 0) && (dot.x > 0) && (dot.x < canvas.width) && (dot.y < canvas.height))
        );
        // filter out explosions that have shrunk completely so they don't get big again
        expls = expls.filter(ex => (ex.size > 0));
        // draw explosions
        expls.forEach(function (ex) {
            context.save();
            context.fillStyle = ex.color;
            context.fillRect(ex.x, ex.y, ex.size, ex.size);
            ex.size -= 0.02;
            context.restore();
        });
    }
    // animation loop
    function animateWorks() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawWorks();
        window.requestAnimationFrame(animateWorks);
    }
    animateWorks();

    // gets a random color
    function getRndColor() {
        var r = 255 * Math.random() | 0,
            g = 255 * Math.random() | 0,
            b = 255 * Math.random() | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
};
