// ferramentas.js
import {Ferramenta} from "./basicas.js";

export class ScannerKao extends Ferramenta {
    #usos;

    constructor() {
        super("scanner_kao");
        this.#usos = 3;
    }

    usar() {
        if (this.#usos > 0) {
            this.#usos--;
            return true;
        }
        return false;
    }

    info() {
        return `${this.nome} (usos restantes: ${this.#usos})`;
    }
}

export class CelulaK19 extends Ferramenta {
    #cargas;

    constructor() {
        super("celula_k19");
        this.#cargas = 2;
    }

    usar() {
        if (this.#cargas > 0) {
            this.#cargas--;
            return true;
        }
        return false;
    }

    info() {
        return `${this.nome} (cargas: ${this.#cargas})`;
    }
}

export class MascaraBiomecanica extends Ferramenta {
    constructor() {
        super("mascara_biomecanica");
    }

    usar() {
        return true;
    }
}

export class ChipKamen extends Ferramenta {
    constructor() {
        super("chip_kamen");
    }

    usar() {
        return true;
    }
}