

export class CPU {

    static get OPCODES() {
        return {
            LOAD_A: 'LOAD_A',
            0b1110101010: 'ZERO',
            0b1110111111: 'ONE',
            0b1110111010: 'NEG_ONE',
            0b1110001100: 'REG_D',
            0b1110110000: 'REG_A',
            0b1110001101: 'NOT_D',
            0b1110110001: 'NOT_A',
            0b1110001111: 'NEG_D',
            0b1110110011: 'NEG_A',
            0b1110011111: 'ADD_1D',
            0b1110110111: 'ADD_1A',
            0b1110001110: 'SUB_1D',
            0b1110110010: 'SUB_1A',
            0b1110000010: 'ADD_AD',
            0b1110010011: 'SUB_AD',
            0b1110000111: 'SUB_DA',
            0b1110000000: 'AND_AD',
            0b1110010101: 'OR_AD',
            0b1111110000: 'REG_M',
            0b1111110001: 'NOT_M',
            0b1111110011: 'NEG_M',
            0b1111110111: 'ADD_1M',
            0b1111110010: 'SUB_1M',
            0b1111000010: 'ADD_MD',
            0b1111010011: 'SUB_MD',
            0b1111000111: 'SUB_DM',
            0b1111000000: 'AND_MD',
            0b1111010101: 'OR_MD'
        };
    }

    constructor(mmu) {
        // The memory instance that holds the code to run.
        this._mmu = mmu;
        this.reset();
    }

    reset() {
        // Hack CPU has 2 registers A and D.
        // The M register isn't a real register, but uses the value
        // in the A register to specify a memery address.
        // Then there is also the program counter.
        this._reg = {
            a: 0,
            d: 0,
            pc: 0
        };

        // The current instruction.
        this._ins = 0x0;
        this._clock = { ticks: 0 };
    }

    // Registers

    get A() {
        return this._reg.a;
    }

    set A(word) {
        return this._reg.a = word;
    }

    get D() {
        return this._reg.d;
    }

    set D(word) {
        return this._reg.d = word;
    }

    get M() {
        return this._mmu.readWord(this.A);
    }

    set M(word) {
        return this._mmu.writeWord(this.A, word);
    }

    get PC() {
        return this._reg.pc;
    }

    set PC(word) {
        return this._reg.pc = word;
    }

    get clock() {
        return this._clock;
    }

    // Instruction bits

    get opCode() {
        // For C instructions, shift to grab the leftmost 10 bits, otherwise
        // use the hardcoded A instruction value.
        if (this._ins >= 0x8000) {
            return CPU.OPCODES[this._ins >> 6];
        } else {
            return CPU.OPCODES.LOAD_A;
        }
    }

    get dest() {
        // For C instructions, mask off the first 10 bits (the op code portion)
        // as well as the last 3 bits (the jump portion). This leaves the
        // 3 bits corresponding to the 3 possbile destination registers.
        // For A instructions, set the A register bit.
        if (this._ins >= 0x8000) {
            return (this._ins >> 3) & 0b111;
        } else {
            return 0b100;
        }
    }

    get jump() {
        // For C instructions, mask off all but the rightmost 3 bits. These 3
        // bits determine which comparison operator to use when deciding whether
        // or not to jump to the address specified in the A register.
        // For A instructions, never jump.
        if (this._ins >= 0x8000) {
            return this._ins & 0b111;
        } else {
            return 0b000;
        }
    }

    tick() {
        // Read in the current instruction
        this._ins = this._mmu.readWordROM(this.PC);
        this._clock.ticks++;

        // Don't do anything if we are past the end of the ROM.
        if (this._ins < 0) return;

        // Dispatch the opcode to retrieve the current value
        let word = this[this.opCode]();

        // dest has three bits corresponding to the three registers A, D and M.
        // Store `word` in any destination with its bit set.
        let dest = this.dest;
        if (dest & 0b1) {
            this.M = word;
        }
        if (dest & 0b10) {
            this.D = word;
        }
        if (dest & 0b100) {
            this.A = word;
        }

        // jump has three bits corresponding to <, ==, and > operators.
        // The selected operator(s) compares the current value and 0, and
        // then we set the program counter accordingly.
        let jump = this.jump;
        if (((jump & 0b100) && word < 0) ||
            ((jump & 0b10) && word == 0) ||
            ((jump & 0b1) && word > 0)) {
                this.PC = this.A;
        } else {
            // If the jump comparison fails, just increment the counter.
            this.PC = this.PC + 1;
        }
    }

    // OPCODE definitions

    LOAD_A() {
        return this._ins & 0x7FFF;
    }

    ZERO() {
        return 0;
    }

    ONE() {
        return 1;
    }

    NEG_ONE() {
        return -1;
    }

    REG_D() {
        return this.D;
    }

    REG_A() {
        return this.A;
    }

    NOT_D() {
        return ~this.D;
    }

    NOT_A() {
        return ~this.A;
    }

    NEG_D() {
        return -this.D;
    }

    NEG_A() {
        return -this.A;
    }

    ADD_1D() {
        return this.D + 1;
    }

    ADD_1A() {
        return this.A + 1;
    }

    SUB_1D() {
        return this.D - 1;
    }

    SUB_1A() {
        return this.A - 1;
    }

    ADD_AD() {
        return this.D + this.A;
    }

    SUB_AD() {
        return this.D - this.A;
    }

    SUB_DA() {
        return this.A - this.D;
    }

    AND_AD() {
        return this.D & this.A;
    }

    OR_AD() {
        return this.D | this.A;
    }

    REG_M() {
        return this.M;
    }

    NOT_M() {
        return ~this.M;
    }

    NEG_M() {
        return -this.M;
    }

    ADD_1M() {
        return this.M + 1;
    }

    SUB_1M() {
        return this.M - 1;
    }

    ADD_MD() {
        return this.D + this.M;
    }

    SUB_MD() {
        return this.D - this.M;
    }

    SUB_DM() {
        return this.M - this.D;
    }

    AND_MD() {
        return this.D & this.M;
    }

    OR_MD() {
        return this.D | this.M;
    }
}
