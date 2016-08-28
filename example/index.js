
import { Emulator } from '../src/emulator';
import './icono.css';
import './style.css';



class Example {

    get html() {
        return `
        <div>
            <canvas id='screen' width=512 height=256></canvas>
            <menu>
                <div id='program'></div>
                <div>
                    <span id='toggle'><i class='icono-play' id='control'></i></span>
                    <span><i class='icono-next' id='step'></i></span>
                    <label for='load' class='load-program'>
                        <span><i class='icono-terminal'></i></span>
                    </label>
                    <input id='load' type='file'></input>
                </div>
                <div>
                    <label for='refresh-rate'>Refresh Rate (ms)</label>
                    <input type='number' id='refresh-rate'></input>
                    <label for='ticks'>Ticks per step</label>
                    <input type='number' id='ticks'></input>
                </div>
            </menu>
        </div>
        `
    }

    constructor() {
        this.running = false;

        this.div = document.getElementById('hack_emulator');
        this.div.innerHTML = this.html;

        this.canvas = document.getElementById('screen');
        this.emulator = new Emulator(this.canvas);

        this.reader = new FileReader();
        this.reader.onload = (e) => this.loadProgram(e);

        this.toggleButton = document.getElementById('toggle');
        this.toggleIcon = document.getElementById('control');
        this.toggleButton.onclick = () => this.toggle();

        this.stepButton = document.getElementById('step');
        this.stepButton.onclick = () => this.step();

        this.loadButton = document.getElementById('load');
        this.loadButton.onchange = (e) => this.reader.readAsText(e.target.files[0]);
        this.programEl = document.getElementById('program');
        this.programEl.textContent = 'No program';

        this.refreshRate = document.getElementById('refresh-rate');
        this.refreshRate.value = this.emulator.refreshRate;
        this.refreshRate.onchange = (e) => this.changeRate(e);

        this.ticks = document.getElementById('ticks');
        this.ticks.value = this.emulator.ticksPerStep;
        this.ticks.onchange = (e) => this.changeTicks(e);
    }

    toggle() {
        if (this.running) {
            this.stop();
        } else {
            this.play();
        }
    }

    stop() {
        this.emulator.stop();
        this.running = false;
        this.toggleIcon.className = 'icono-play';
        this.toggleButton.blur();
    }

    play() {
        this.emulator.start();
        this.running = true;
        this.toggleIcon.className = 'icono-pause';
        this.toggleButton.blur();
    }

    step() {
        this.emulator.step(true);
    }

    loadProgram(e) {
        this.programEl.textContent = this.loadButton.value.split('\\').pop();
        this.emulator.loadProgram(e.target.result);
    }

    changeRate(e) {
        this.emulator.refreshRate = e.target.value;
    }

    changeTicks(e) {
        this.emulator.ticksPerStep = e.target.value;
    }
}

let example = new Example();
