export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.view.renderStartScreen();
    }

    ubdate() {
        this.game.movePieceDown();
        this.ubdateView();
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.ubdateView();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.ubdateView();
    }

    reset() {
        this.game.reset();
        this.play();
    }

    ubdateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.view.renderEndScreen(state)
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScreen(state);
        }
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.ubdate();
            }, speed > 0 ? speed : 100);
        }

    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    handleKeyDown(event) {
        const state = this.game.getState();

        switch (event.keyCode) {
            case 13:
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 37:
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 38:
                this.game.rotatePiece();
                this.updateView();
                break;
            case 39:
                this.game.movePieceRight();
                this.updateView();
                break;
            case 40:
                this.game.movePieceDown();
                this.updateView();
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40:
                this.startTimer();
                break;
        }
    }
}