// objetos.js
import {Objeto} from "./basicas.js";
import {ScannerKao, CelulaK19, MascaraBiomecanica} from "./ferramentas.js";

export class TerminalDescontaminacao extends Objeto {
    constructor() {
        super(
            "terminal_descontaminacao",
            "O terminal está contaminado e inativo.",
            "O terminal foi descontaminado e agora está ativo!"
        );
    }

    usa(ferramenta) {
        if (ferramenta instanceof ScannerKao) {
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class TerminalAnalise extends Objeto {
    constructor() {
        super(
            "terminal_analise",
            "O terminal de análise está sem energia.",
            "O terminal foi energizado e gerou a mascara_biomecanica!"
        );
    }

    usa(ferramenta) {
        if (ferramenta instanceof CelulaK19) {
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class PainelKairol extends Objeto {
    constructor() {
        super(
            "painel_kairol",
            "O painel requer autenticação biométrica.",
            "O painel foi autenticado e liberou o chip_kamen!"
        );
    }

    usa(ferramenta) {
        if (ferramenta instanceof MascaraBiomecanica) {
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

// Documentos
export class DocumentoLDN extends Objeto {
    constructor() {
        super(
            "documento_ldn",
            "Um documento lacrado (LDN).",
            "Você já leu o documento_ldn."
        );
    }

    usa(ferramenta) {
        console.log("Documento LDN: 'Use scanner_kao para descontaminar terminais contaminados.'");
        this.acaoOk = true;
        return true;
    }
}

export class RelatorioPRST extends Objeto {
    constructor() {
        super(
            "relatorio_prst",
            "Um relatório sobre PRST-EVE.",
            "Você já leu o relatorio_prst."
        );
    }

    usa(ferramenta) {
        console.log("RelatorioPRST: 'Sincronize o scanner_kao no terminal_descontaminacao para remover contaminação.'");
        this.acaoOk = true;
        return true;
    }
}

export class DocumentoPHSH extends Objeto {
    constructor() {
        super(
            "documento_phsh",
            "Um documento sobre energizar terminais.",
            "Você já leu o documento_phsh."
        );
    }

    usa(ferramenta) {
        console.log("DocumentoPHSH: 'Use celula_k19 no terminal_analise para criar a mascara_biomecanica.'");
        this.acaoOk = true;
        return true;
    }
}

export class RelatorioA28 extends Objeto {
    constructor() {
        super(
            "relatorio_a28",
            "Um relatório que fala de autenticação biométrica.",
            "Você já leu o relatorio_a28."
        );
    }

    usa(ferramenta) {
        console.log("RelatorioA28: 'A mascara_biomecanica é necessária para ativar o painel_kairol e obter o chip_kamen.'");
        this.acaoOk = true;
        return true;
    }
}