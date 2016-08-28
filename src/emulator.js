
import { CPU } from './cpu';
import { MMU } from './mmu';
import { GPU } from './gpu';
import { KB } from './kb';


// The Emulator class wires all of the individual pieces together and
// provides controls for starting and stopping execution.
export class Emulator {

    constructor(canvas) {
        // Wire up the memory maps and then hand the memory unit to the
        // CPU.
        this._gpu = new GPU(canvas);
        this._kb = new KB();
        this._mmu = new MMU(this._gpu, this._kb);
        this._cpu = new CPU(this._mmu);

        // Set the number of CPU ticks per run. Tweak this to suit your
        // environment.
        this._timer = null;
        this._ticks = 100000;
        this._stepper = this.step.bind(this);

        // Set the number of ms to wait before a full repaint of the screen
        this._refreshMS = 100;
        this._renderer = this.render.bind(this);
        this._lastRender = 0;

        // Register keyboard handlers
        window.onkeydown = (e) => this.onKeyDown(e);
        window.onkeyup = () => this.onKeyUp();
    }

    get ticksPerStep() {
        return this._ticks;
    }

    set ticksPerStep(ticks) {
        this._ticks = ticks;
    }

    get refreshRate() {
        return this._refreshMS;
    }

    set refreshRate(ms) {
        this._refreshMS = ms;
    }

    loadProgram(code) {
        // Load a Hack program line by line into the ROM for execution
        this.stop();
        this._cpu.reset();
        this._mmu.load(code);
    }

    start() {
        // Clear the stop flag
        this._stop = false;

        // Start the CPU loop and the screen renderer
        this._timer = setTimeout(this._stepper, 0);
        requestAnimationFrame(this._renderer);
    }

    stop() {
        // Set the stop flag
        this._stop = true;

        // Stop running the CPU
        clearInterval(this._timer);
        this._timer = null;
    }

    render(ms) {
        // Rendering on the full canvas on every frame could be expensive,
        // so only render every refreshMS milliseconds.
        if ((ms - this._lastRender) > this._refreshMS) {
            this._gpu.render();
            this._lastRender = ms;
        }
        // Render again
        if (!this._stop) requestAnimationFrame(this._renderer);
    }

    step(force) {
        // Run through this._ticks CPU cycles. We need to stop looping and
        // use setTimeout every once in a while to make sure that our event
        // handlers have a chance to run to register keypresses, etc.
        for (let i = 0; i < this._ticks; i++) {
            if (!this._stop || force) this._cpu.tick();
        }
        if (force) {
            this.render(this._lastRender + this._refreshMS + 1);
        } else {
            this._timer = setTimeout(this._stepper, 0);
        }
    }

    onKeyDown(e) {
        this._kb.writeWord(e.keyCode);
    }

    onKeyUp() {
        this._kb.writeWord(0);
    }


}
