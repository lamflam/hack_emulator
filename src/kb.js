
// The keyboard is a very simple and only has a single address/value.
export class KB {

    constructor() {
        this._key = 0;
    }

    readWord() {
        return this._key;
    }

    writeWord(word) {
        return this._key = word;
    }
}
