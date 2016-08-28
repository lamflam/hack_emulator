

// The Hack sreen is 512 pixels wide by 256 pixels high. Each pixel
// is represented by a single bit, however you can not write a single
// bit at a time. Instead, there are 0x2000 addressable 16-bit slots
// so writing happens 16 bits at a time.
//
// The actual screen uses a 2d canvas so each pixel is represented by
// a 4 element rgba array as part of an ImageData object. The object is
// updated on a write, but the screen is only repainted when render is called.
export class GPU {

    static get rows() {
        return 256;
    }

    static get cols() {
        return 512;
    }

    constructor(canvas) {
        this._ram = [];
        if (canvas) {
            canvas.height = GPU.rows;
            canvas.width = GPU.cols;
            this._ctx = canvas.getContext("2d");
            this._img = this._ctx.createImageData(GPU.cols, GPU.rows);
            this.reset();
        }
    }

    reset() {
        for (let i = 0; i < (GPU.cols * GPU.rows) / 16; i++) {
            this.writeWord(i, 0);
        }
        this.render();
    }

    render() {
        // Redraws the entire screen with whatever is currently in the memory
        // buffer.
        this._ctx.putImageData(this._img, 0, 0);
    }

    readWord(addr) {
        return this._ram[addr] || 0;
    }

    writeWord(addr, word) {
        this._ram[addr] = word;
        if (this._ctx) {
            // Each addr consistents of 16 pixels each represented as 4 elements
            // in the array, so the starting offset is addr * 16 * 4.
            let base = addr * 16 * 4;

            // Check each bit of this value and set the corresponding pixel
            for (let i = 0, mask = 1; i < 16; i++, mask << 1) {
                let val = (word & mask) ? 0 : 255;
                let o = base + (i * 4);
                this._img.data[o] = val;
                this._img.data[o+1] = val;
                this._img.data[o+2] = val;
                this._img.data[o+3] = 255;
            }
        }
    }
}
