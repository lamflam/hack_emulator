
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
                    <span id='toggle' title='Play'>
                        <i class='icono-play disabled' id='control'></i>
                    </span>
                    <span title='Step'>
                        <i class='icono-next disabled' id='step'></i>
                    </span>
                    <span title='Reset'>
                        <i class='icono-stop disabled' id='reset'></i>
                    </span>
                    <label for='load' class='load-program'>
                        <span title='Load Program'>
                            <i class='icono-terminal' id='terminal'></i>
                        </span>
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

        this.resetButton = document.getElementById('reset');
        this.resetButton.onclick = () => this.reset();

        this.loadButton = document.getElementById('load');
        this.loadButton.onchange = (e) => this.reader.readAsText(e.target.files[0]);
        this.terminal = document.getElementById('terminal');
        this.programEl = document.getElementById('program');
        this.programEl.textContent = 'Click the terminal icon to load a program.';

        this.refreshRate = document.getElementById('refresh-rate');
        this.refreshRate.value = this.emulator.refreshRate;
        this.refreshRate.onchange = (e) => this.changeRate(e);
        this.refreshRate.onkeydown = (e) => e.stopPropagation();
        this.refreshRate.onkeyup = (e) => e.stopPropagation();

        this.ticks = document.getElementById('ticks');
        this.ticks.value = this.emulator.ticksPerStep;
        this.ticks.onchange = (e) => this.changeTicks(e);
        this.ticks.onkeydown = (e) => e.stopPropagation();
        this.ticks.onkeyup = (e) => e.stopPropagation();
    }

    toggle() {
        if (this.running) {
            this.stop();
        } else {
            this.play();
        }
    }

    reset() {
        this.stop();
        this.stepButton.classList.add('disabled');
        this.emulator.reset();
    }

    stop() {
        this.emulator.stop();
        this.running = false;
        this.toggleIcon.className = 'icono-play';
        this.toggleButton.blur();
        this.stepButton.classList.remove('disabled');
        this.terminal.classList.remove('disabled');
    }

    play() {
        this.emulator.start();
        this.running = true;
        this.toggleIcon.className = 'icono-pause';
        this.toggleButton.blur();
        this.stepButton.classList.add('disabled');
        this.terminal.classList.add('disabled');
    }

    step() {
        if (!this.stepButton.classList.contains('disabled')) {
            this.emulator.step(true);
        }
    }

    loadProgram(e) {
        if (!this.terminal.classList.contains('disabled')) {
            this.programEl.textContent = this.loadButton.value.split('\\').pop();
            this.emulator.loadProgram(e.target.result);
            this.reset();
            this.toggleIcon.classList.remove('disabled');
            this.resetButton.classList.remove('disabled');
        }
    }

    changeRate(e) {
        this.emulator.refreshRate = e.target.value;
    }

    changeTicks(e) {
        this.emulator.ticksPerStep = e.target.value;
    }
}

let example = new Example();
