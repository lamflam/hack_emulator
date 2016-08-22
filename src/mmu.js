
export class MMU {

    constructor(gpu) {
        this._rom = [];
        this._ram = [];
        this._gpu = gpu;
    }

    load(code) {
        // Code should be a string where each line contains
        // 16 1s and 0s representing the instruction.
        this._rom = [];
        code.split('\n').forEach((ins, i) => {
            this._rom[i] = parseInt(ins, 2);
        });
    }

    readWordROM(addr) {
        return this._rom[addr] === undefined ? -1 : this._rom[addr];
    }

    readWord(addr) {
        if (addr <= 0x6000) {
            return this._ram[addr] || 0;
        } else {
            throw new Error(`Memory Access Violation: ${addr}`);
        }
    }

    writeWord(addr, word) {
        if (addr < 0x4000) {
            return this._ram[addr] = word;
        } else if (addr < 0x6000) {
            this._ram[addr] = word;
            this._gpu.render(addr - 0x4000, word);
        } else if (addr == 0x6000) {
            return this._ram[addr] = word;
        } else {
            throw new Error(`Memory Access Violation: ${addr}`);
        }
    }
}
