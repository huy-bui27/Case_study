/*** CONSTANT ***/
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_MAPPING = [
    '#680000',
    '#D2691E',
    '#66FF66',
    '#FFFF99',
    '#66FFFF',
    '#990066',
    '#FFE4E1',
    'white',
];

const BRICK_LAYOUT = [
    [
        [
            [1, 7, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 1],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 1, 7],
            [7, 1, 7],
            [1, 1, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [7, 1, 7],
            [7, 1, 1],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 1],
            [1, 1, 1],
            [7, 7, 7],
        ],
    ],
    [
        [
            [1, 7, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 1, 1],
            [1, 1, 7],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 7, 7],
            [7, 1, 1],
            [1, 1, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [1, 1, 7],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 7, 1],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 7],
            [7, 1, 1],
        ],
    ],
    [
        [
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
        ],
        [
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
        ],
    ],
    [
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
    ],
    [
        [
            [7, 1, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 1, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
    ],
];

const KEY_CODES = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
};

const WHITE_COLOR_ID = 7;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

let difficulty = 'normal'; // Mặc định là 'bình thường'

const difficultySettings = {
    easy: 1500,    // Tốc độ rơi cho mức dễ
    normal: 1000,  // Tốc độ rơi cho mức bình thường
    hard: 500      // Tốc độ rơi cho mức khó
};

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
        this.score = 0;
        this.highScore = 0; // Thêm biến lưu trữ kỷ lục
        this.gameOver = false;
        this.isPlaying = false;

        this.clearAudio = new Audio('./sounds/clear.wav');
    }

    reset() {
        this.score = 0;
        document.getElementById('score').innerHTML = 0; // Đặt điểm số về 0
        this.grid = this.generateWhiteBoard();
        this.gameOver = false;
        this.drawBoard();
    }

    generateWhiteBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_COLOR_ID));
    }

    drawCell(xAxis, yAxis, colorId) {
        // xAxis => 1 yAxis => 1
        this.ctx.fillStyle =
            COLOR_MAPPING[colorId] || COLOR_MAPPING[WHITE_COLOR_ID];
        this.ctx.fillRect(
            xAxis * BLOCK_SIZE,
            yAxis * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
        this.ctx.fillStyle = 'black';
        this.ctx.strokeRect(
            xAxis * BLOCK_SIZE,
            yAxis * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
    }

    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }

    handleCompleteRows() {
        const latestGrid = board.grid.filter((row) => { // row => []
            return row.some(col => col === WHITE_COLOR_ID);
        });

        const newScore = ROWS - latestGrid.length; // => newScore = tong cong hang da hoan thanh
        const newRows = Array.from({ length: newScore }, () => Array(COLS).fill(WHITE_COLOR_ID));

        if (newScore) {
            board.grid = [...newRows, ...latestGrid];
            this.handleScore(newScore * 10);

            this.clearAudio.play();
            console.log({latestGrid});
        }
    }

    handleScore(newScore) {
        this.score+= newScore;
        document.getElementById('score').innerHTML = this.score;
// //Cập nhật điểm số cao nhất
        if (this.score > this.highScore) {
            this.highScore = this.score;
            document.getElementById('high-score').innerHTML = this.highScore; // Cập nhật hiển thị kỷ lục
        }
    }

    handleGameOver() {
        this.gameOver = true;
        this.isPlaying = false;
        // alert('GAME OVER!!!');
        Swal.fire({
            title: 'Game Over!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

class Brick {
    constructor(id) {
        this.id = id;
        this.layout = BRICK_LAYOUT[id];
        this.activeIndex = 0;
        this.colPos = 3;
        this.rowPos = -2;
    }

    draw() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, this.id);
                }
            }
        }
    }

    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID);
                }
            }
        }
    }

    moveLeft() {
        if (
            !this.checkCollision(
                this.rowPos,
                this.colPos - 1,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.colPos--;
            this.draw();
        }
    }

    moveRight() {
        if (
            !this.checkCollision(
                this.rowPos,
                this.colPos + 1,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }

    moveDown() {
        if (
            !this.checkCollision(
                this.rowPos + 1,
                this.colPos,
                this.layout[this.activeIndex]
            )
        ) {
            this.clear();
            this.rowPos++;
            this.draw();

            return;
        }

        this.handleLanded();
        generateNewBrick();
    }

    rotate() {
        if (
            !this.checkCollision(
                this.rowPos,
                this.colPos,
                this.layout[(this.activeIndex + 1) % 4]
            )
        ) {
            this.clear();
            this.activeIndex = (this.activeIndex + 1) % 4;
            this.draw();
        }
    }

    checkCollision(nextRow, nextCol, nextLayout) {
        // if (nextCol < 0) return true;

        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if (nextLayout[row][col] !== WHITE_COLOR_ID && nextRow >= 0) {
                    if (
                        col + nextCol < 0 ||
                        col + nextCol >= COLS ||
                        row + nextRow >= ROWS ||
                        board.grid[row+nextRow][col+nextCol] !== WHITE_COLOR_ID
                    )
                        return true;
                }
            }
        }

        return false;
    }

    handleLanded() {
        if (this.rowPos <= 0) {
            board.handleGameOver();
            return;
        }

        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id;
                }
            }
        }


        board.handleCompleteRows();
        board.drawBoard();
    }
}

function generateNewBrick() {
    brick = new Brick(Math.floor(Math.random() * 10) % BRICK_LAYOUT.length); // tao ra 1 id bat ki nam tu 0 -> 6
}

board = new Board(ctx);
board.drawBoard();

document.getElementById('play').addEventListener('click', () => {
    board.reset();

    board.isPlaying = true;

    generateNewBrick();

    const refresh = setInterval(() => {
        if (!board.gameOver) {
            brick.moveDown();
        } else {
            clearInterval(refresh);
        }
    }, difficultySettings[difficulty]);// Sử dụng mức độ khó
})
document.getElementById('reset').addEventListener('click', () => {
    board.reset(); // Reset bảng
    brick = null; // Đặt brick thành null để tránh lỗi
    clearInterval(refresh); // Dừng vòng lặp nếu đang chơi
    document.getElementById('score').innerHTML = 0; // Đặt điểm số về 0
});

document.addEventListener('keydown', (e) => {
    if (!board.gameOver && board.isPlaying) {
        console.log({ e });
        switch (e.code) {
            case KEY_CODES.LEFT:
                brick.moveLeft();
                break;
            case KEY_CODES.RIGHT:
                brick.moveRight();
                break;
            case KEY_CODES.DOWN:
                brick.moveDown();
                break;
            case KEY_CODES.UP:
                brick.rotate();
                break;
            default:
                break;
        }
    }
});

// brick.moveLeft();
// brick.moveDown();
// brick.moveRight();
// board.drawCell(1, 1, 1);

console.table(board.grid);
