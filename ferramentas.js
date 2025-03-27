// ferramentas.js
// Este arquivo define as ferramentas específicas do jogo, que herdam da classe Ferramenta (definida em basicas.js).

import { Ferramenta } from "./basicas.js";

// ScannerKao: Utilizado para descontaminar terminais contaminados.
// Possui um número limitado de usos.
export class ScannerKao extends Ferramenta {
    #usos; // Número de usos restantes

    constructor() {
        super("scanner_kao");
        this.#usos = 3;
    }

    // O método usar decrementa o número de usos e retorna true se houver usos restantes.
    usar() {
        if (this.#usos > 0) {
            this.#usos--;
            return true;
        }
        return false;
    }

    // Retorna informações da ferramenta, para exibição no inventário.
    info() {
        return `${this.nome} (usos restantes: ${this.#usos})`;
    }
}

// CelulaK19: Usada para energizar terminais; possui número limitado de cargas.
export class CelulaK19 extends Ferramenta {
    #cargas; // Número de cargas disponíveis

    constructor() {
        super("celula_k19");
        this.#cargas = 2;
    }

    // Decrementa o número de cargas e retorna true se houver cargas disponíveis.
    usar() {
        if (this.#cargas > 0) {
            this.#cargas--;
            return true;
        }
        return false;
    }

    // Retorna informações da ferramenta, para exibição no inventário.
    info() {
        return `${this.nome} (cargas: ${this.#cargas})`;
    }
}

// MascaraBiomecanica: Ferramenta criada a partir da interação no terminal de análise.
// Não possui limite de uso.
export class MascaraBiomecanica extends Ferramenta {
    constructor() {
        super("mascara_biomecanica");
    }

    // Sempre retorna true, pois não tem limite de uso.
    usar() {
        return true;
    }
}

// ChipKamen: Item final que, quando obtido, conclui o jogo.
export class ChipKamen extends Ferramenta {
    constructor() {
        super("chip_kamen");
    }

    // Retorna true (pode ser utilizado para finalizar o jogo).
    usar() {
        return true;
    }
}