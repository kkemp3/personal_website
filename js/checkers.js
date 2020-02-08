window.onload = function() {
    let canvas = (/** @type {HTMLCanvasElement} */ document.getElementById("check"));
    let context = canvas.getContext('2d');

    let board = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (board < 2 || board > 7) {
                board.push({"x":(i + 20)* 10, "y":(j + 20)* 10, "hasChecker":true, "selected":false})
            } else {
                board.push({"x":(i + 20)* 10, "y":(j + 20)* 10, "hasChecker":false, "selected":false})
            }
        }
    }

}