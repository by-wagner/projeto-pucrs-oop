// objetos.js
// Este arquivo define os objetos e documentos interativos do jogo, todos derivados da classe Objeto (definida em basicas.js).

import { Objeto } from "./basicas.js";
import { ScannerKao, CelulaK19, MascaraBiomecanica } from "./ferramentas.js";

// TerminalDescontaminacao: Inicialmente contaminado; pode ser descontaminado usando o ScannerKao.
export class TerminalDescontaminacao extends Objeto {
    constructor() {
        super(
            "terminal_descontaminacao",
            "O terminal está contaminado e inativo.",
            "O terminal foi descontaminado e agora está ativo!"
        );
    }
    // Se o jogador usar scanner_kao, o terminal é descontaminado.
    // Caso contrário, exibe uma mensagem de erro.
    usa(ferramenta) {
        if (ferramenta instanceof ScannerKao) {
            this.acaoOk = true;
            return true;
        } else {
            console.log("Ferramenta incorreta. Use scanner_kao para descontaminar o terminal.");
            return false;
        }
    }
}

// TerminalAnalise: Usado para energizar terminais; com o uso de celula_k19, gera a mascara_biomecanica.
export class TerminalAnalise extends Objeto {
    constructor() {
        super(
            "terminal_analise",
            "O terminal de análise está sem energia.",
            "O terminal foi energizado e gerou a mascara_biomecanica!"
        );
    }
    // Se o jogador usar celula_k19, o terminal é energizado.
    // Caso contrário, exibe uma mensagem de erro.
    usa(ferramenta) {
        if (ferramenta instanceof CelulaK19) {
            this.acaoOk = true;
            return true;
        } else {
            console.log("Ferramenta incorreta. Utilize celula_k19 para energizar o terminal.");
            return false;
        }
    }
}

// PainelKairol: Exige autenticação biométrica; ao ser ativado com a mascara_biomecanica, libera o chip_kamen.
export class PainelKairol extends Objeto {
    constructor() {
        super(
            "painel_kairol",
            "O painel requer autenticação biométrica.",
            "O painel foi autenticado e liberou o chip_kamen!"
        );
    }
    // Se o jogador usar a mascara_biomecanica, o painel autentica com sucesso.
    // Caso contrário, exibe uma mensagem de erro.
    usa(ferramenta) {
        if (ferramenta instanceof MascaraBiomecanica) {
            this.acaoOk = true;
            return true;
        } else {
            console.log("Autenticação falhou. Use a mascara_biomecanica para ativar o painel.");
            return false;
        }
    }
}

// DocumentoLDN: Fornece instruções para usar o scanner_kao.
export class DocumentoLDN extends Objeto {
    constructor() {
        super(
            "documento_ldn",
            "Um documento lacrado (LDN).",
            "Você já leu o documento_ldn."
        );
    }
    // Ao ser "usado", exibe a mensagem e marca o documento como lido.
    usa(ferramenta) {
        console.log("Documento LDN: 'Use scanner_kao para descontaminar terminais contaminados.'");
        this.acaoOk = true;
        return true;
    }
}

// RelatorioPRST: Fornece instruções para descontaminar o terminal.
export class RelatorioPRST extends Objeto {
    constructor() {
        super(
            "relatorio_prst",
            "Um relatório sobre PRST-EVE.",
            "Você já leu o relatorio_prst."
        );
    }
    // Ao ser "usado", exibe a mensagem e marca o relatório como lido.
    usa(ferramenta) {
        console.log("RelatorioPRST: 'Sincronize o scanner_kao no terminal_descontaminacao para remover contaminação.'");
        this.acaoOk = true;
        return true;
    }
}

// DocumentoPHSH: Fornece instruções para usar o celula_k19 no terminal de análise.
export class DocumentoPHSH extends Objeto {
    constructor() {
        super(
            "documento_phsh",
            "Um documento sobre energizar terminais.",
            "Você já leu o documento_phsh."
        );
    }
    // Exibe a mensagem e marca o documento como lido.
    usa(ferramenta) {
        console.log("DocumentoPHSH: 'Use celula_k19 no terminal_analise para criar a mascara_biomecanica.'");
        this.acaoOk = true;
        return true;
    }
}

// RelatorioA28: Fornece instruções para usar a mascara_biomecanica no painel.
export class RelatorioA28 extends Objeto {
    constructor() {
        super(
            "relatorio_a28",
            "Um relatório que fala de autenticação biométrica.",
            "Você já leu o relatorio_a28."
        );
    }
    // Exibe a mensagem e marca o relatório como lido.
    usa(ferramenta) {
        console.log("RelatorioA28: 'A mascara_biomecanica é necessária para ativar o painel_kairol e obter o chip_kamen.'");
        this.acaoOk = true;
        return true;
    }
}