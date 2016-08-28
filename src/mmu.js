

// There are two memory chips in the Hack computer, a ROM for instructions
// and a RAM for data. Each chip has 0x8000 addressable slots,
// each 16 bits wide. The MMU also takes a GPU and KB chip instance and
// maps them to the appropriate address ranges.
export class MMU {

    constructor(gpu, kb) {
        this._gpu = gpu;
        this._kb = kb;
        this._rom = [];
        this.reset();
    }

    reset() {
        this._ram = [];
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
        // Load the instruction at addr, or -1 if no instruction is defined.
        // -1 is not part of the Hack spec, but it is used here so the CPU
        // can sit in a NOOP loop if the end of the program is reached.
        if (addr < 0x8000) {
            return this._rom[addr] === undefined ? -1 : this._rom[addr];
        } else {
            throw new Error(`Memory Access Violation: ${addr}`);
        }
    }

    readWord(addr) {
        // The screen is mapped to addresses 0x4000 - 0x5FFF, and the keyboard
        // is mapped directly at address 0x6000. 0x6001 - 0x7FFF are
        // normal RAM.
        if (addr < 0x4000 || (addr > 0x6000 && addr < 0x8000)) {
            return this._ram[addr] || 0;
        } else if (addr < 0x6000) {
            // Adjust the address because the gPU doesn't know about the mapped
            // address range.
            this._gpu.readWord(addr - 0x4000);
        } else if (addr == 0x6000) {
            return this._kb.readWord();
        } else {
            throw new Error(`Memory Access Violation: ${addr}`);
        }
    }

    writeWord(addr, word) {
        if (addr < 0x4000 || (addr > 0x6000 && addr < 0x8000)) {
            return this._ram[addr] = word;
        } else if (addr < 0x6000) {
            // Adjust the address because the gPU doesn't know about the mapped
            // address range.
            this._gpu.writeWord(addr - 0x4000, word);
        } else if (addr == 0x6000) {
            return this._kb.writeWord(word);
        } else {
            throw new Error(`Memory Access Violation: ${addr}`);
        }
    }
}
