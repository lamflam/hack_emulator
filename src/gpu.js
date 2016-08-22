
export class GPU {

    static get rows() {
        return 256;
    }

    static get cols() {
        return 512;
    }

    constructor(canvas) {
        if (canvas) {
            canvas.height = GPU.rows;
            canvas.width = GPU.cols;
            this._ctx = canvas.getContext("2d");

            this._black = this._ctx.createImageData(1,1);
            this._black.data[0] = 0;
            this._black.data[1] = 0;
            this._black.data[2] = 0;
            this._black.data[3] = 255;

            this._white = this._ctx.createImageData(1,1);
            this._white.data[0] = 255;
            this._white.data[1] = 255;
            this._white.data[2] = 255;
            this._white.data[3] = 255;
        }

    }

    setPixel(row, col, on) {
        if (this._ctx) {
            this._ctx.putImageData(on ? this._black : this._white, col, row);
        }
    }

    render(addr, word) {
        if (this._ctx) {
            let row = Math.floor(addr / (GPU.cols / 16));
            let col = (addr % (GPU.cols / 16)) * 16;
            for (let i = 0, mask = 1; i < 16; i++, mask << 1) {
                this.setPixel(row, col + i, word & mask);
            }
        }
    }
}
