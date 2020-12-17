export default class View {
    constructor(element, widht, height, rows, columns) {
        this.element = element;
        this.widht = widht;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.widht;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.blockWidht = this.widht / columns;
        this.blockHeight = this.height / rows;

        this.element.appendChild(this.canvas);
    }

    renderPlayfield(playfield) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y]

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                if (block) {
                    this.context.fillStyle = 'red';
                    this.context.strokeStyle = 'black';
                    this.context.lineWidth = 2;

                    this.context.fillRect(x * this.blockWidht, y * this.blockHeight, this.blockWidht, this.blockHeight);
                }
            }
        }
    }
}