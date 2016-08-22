
import { CPU } from './cpu';
import { MMU } from './mmu';
import { GPU } from './gpu';

export class Emulator {

    constructor(canvas) {
        this._gpu = new GPU(canvas);
        this._mmu = new MMU(this._gpu);
        this._cpu = new CPU(this._mmu);
        this._timer = null;
        this._ticks = 131000;
        window.onkeydown = (e) => {
            this._mmu.writeWord(0x6000, e.keyCode);
        }
        window.onkeyup = () => {
            this._mmu.writeWord(0x6000, 0);
        }
    }

    loadProgram(code) {
        this._mmu.load(code);
    }

    start() {
        this._stop = false;
        this._timer = setTimeout(this._runner, 0);
    }

    stop() {
        clearInterval(this._timer);
        this._timer = null;
    }

    run() {
        this._timer = setInterval(() => { this.step(); }, 0)
    }

    step() {
        for (let i = 0; i < this._ticks; i++) {
            this._cpu.tick();
        }
    }
}
