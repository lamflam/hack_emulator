
// The keyboard is a very simple and only has a single address/value.
export class KB {

    get map() {
        return {
            13: 128,
            8:  129,
            37: 130,
            38: 131,
            39: 132,
            40: 133,
            36: 134,
            35: 135,
            33: 136,
            24: 137,
            45: 138,
            46: 139,
            27: 140,
            112: 141,
            113: 142,
            114: 143,
            115: 144,
            116: 145,
            117: 146,
            118: 147,
            119: 148,
            120: 149,
            121: 150,
            122: 151,
            123: 152
        }
    }

    constructor() {
        this.reset();
    }

    reset() {
        this._key = 0;
    }

    readWord() {
        return this._key;
    }

    writeWord(word) {
        return this._key = this.map[word] || word;
    }
}
