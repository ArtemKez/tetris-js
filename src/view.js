export default class View {
    static colors = {
        '1': 'cyan',
        '2': 'blue',
        '3': 'orange',
        '4': 'yellow',
        '5': 'green',
        '6': 'purple',
        '7': 'red'
    };

    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;
        this.element.appendChild(this.canvas);
    }

    render(state) {
        this.clearScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    renderPlayfield({playfield}) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            for (let x = 0; x < line.length; x++) {
                const block = playfield[y][x];

                if (block) {
                    this.renderBlock(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight, View.colors[block]);
                }
            }
        }
    }

    renderPanel({level, score, lines, nextPiece}) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '14px "Press Start 2P"';

        this.context.fillText(`Level: ${level}`, 0, 0)
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;

        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }
}
