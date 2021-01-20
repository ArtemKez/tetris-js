export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200,
    }

    constructor() {
        this.reset();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    getState() {
        const playfield = this.createPlayfield();
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];

            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playfield,
            isGameOver: this.topOut
        };
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.playfield = this.createPlayfield();
        this.activePiece = this.createPiece();
        this.nextPiece = this.createPiece();
    }

    createPlayfield() {
        const playfield = [];

        for (let y = 0; y < 20; y++) {
            playfield[y] = [];

            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
            }
        }
        return playfield;
    }

    createPiece() {
        const index = Math.floor(Math.random() * 7)
        const type = 'IJLOSTZ'[index];
        const piece = {};

        switch (type) {
            case 'I':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'J':
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2],
                ];
                break;
            case 'L':
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0],
                ];
                break;
            case 'O':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0]

                ];
                break;
            case 'S':
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0],
                ];
                break;
            case 'T':
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0],
                ];
                break;
            case 'Z':
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7],
                ];
                break;
            default:
                throw new Error('неизвестный тип фигуры')
        }
        piece.x = Math.floor((10 - piece.blocks[0].length) / 2)
        piece.y = -1;
        return piece;
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        if (this.topOut) return;

        this.activePiece.y += 1;

        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();
            const clearLines = this.clearLines();
            this.ubdateScore(clearLines);
            this.updatePieces();
        }
        if (this.hasCollision()) {
            this.topOut = true;
        }
    }

    rotatePiece() {
        if (!this.hasCollision()) {
            this.rotateBlocks();
        }
    }

    rotateBlocks() {
        const blocks = this.cloneArray(this.activePiece.blocks);
        const length = blocks.length;
        const x = Math.floor(length / 2);
        const y = length - 1;

        if (this.activePiece.y < 0 || this.activePiece.y > (20 - blocks.length)) {
            return;
        }

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j];
                blocks[i][j] = blocks[y - j][i];
                blocks[y - j][i] = blocks[y - i][y - j];
                blocks[y - i][y - j] = blocks[j][y - i];
                blocks[j][y - i] = temp;
            }
        }

        for (let row = this.activePiece.y, i = 0; row < this.activePiece.y + blocks.length; row++, i++) {
            for (let col = this.activePiece.x, j = 0; col < this.activePiece.x + blocks.length; col++, j++) {
                let val = this.playfield[row][col]
                if (!val || this.activePiece.blocks[i][j] || !blocks[i][j]) {
                    continue;
                }
                return;
            }
        }
        this.activePiece.blocks = blocks;
        if (this.activePiece.x < 0) {
            this.activePiece.x = 0
        } else if (this.activePiece.x > this.playfield[0].length - this.activePiece.blocks.length) {
            this.activePiece.x = this.playfield[0].length - this.activePiece.blocks.length
        }
    }

    cloneArray(arr) {
        const new_arr = [];
        for (let i = 0; i < arr.length; i++) {
            new_arr.push([...arr[i]]);
        }
        return new_arr;
    }

    hasCollision() {
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x] &&
                    (
                        this.playfield[pieceY + y] === undefined
                        || this.playfield[pieceY + y][pieceX + x] === undefined
                        || this.playfield[pieceY + y][pieceX + x])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockPiece() {
        const {y: pieceY, x: pieceX, blocks} = this.activePiece

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
    }

    clearLines() {
        const rows = 20;
        const columns = 10;
        let lines = [];

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0

            for (let x = 0; x < columns; x++) {
                if (this.playfield[y][x]) {
                    numberOfBlocks += 1;
                }
            }
            if (numberOfBlocks === 0) {
                break;
            } else if (numberOfBlocks < columns) {
                continue;
            } else if (numberOfBlocks === columns) {
                lines.unshift(y);
            }
        }
        for (let index of lines) {
            this.playfield.splice(index, 1);
            this.playfield.unshift(new Array(columns).fill(0));
        }
        return lines.length;
    }

    ubdateScore(cleardLines) {
        if (cleardLines > 0) {
            this.score += Game.points[cleardLines] * (this.level + 1);
            this.lines += cleardLines;
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }
}