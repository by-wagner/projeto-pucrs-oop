// salas.js
// Este arquivo define as salas do jogo, suas interações e conexões.
// Cada sala é uma subclasse da classe Sala (definida em basicas.js) e possui objetos e ferramentas específicos.

import { Sala } from "./basicas.js";
import { ScannerKao, CelulaK19, MascaraBiomecanica, ChipKamen } from "./ferramentas.js";
import {
    TerminalDescontaminacao,
    TerminalAnalise,
    PainelKairol,
    DocumentoLDN,
    RelatorioPRST,
    DocumentoPHSH,
    RelatorioA28
} from "./objetos.js";

// -------------------------
// Classe ShelterLDN0
// Sala inicial: contém um documento (DocumentoLDN) e o scanner_kao disponível.
export class ShelterLDN0 extends Sala {
    constructor(engine) {
        super("shelter_ldn0", engine);
        // Adiciona o documento LDN à sala para fornecer instruções iniciais
        let docLDN = new DocumentoLDN();
        this.objetos.set(docLDN.nome, docLDN);
        // Adiciona o scanner_kao como ferramenta disponível
        let scanner = new ScannerKao();
        this.ferramentas.set(scanner.nome, scanner);
    }

    // Não há interações especiais nesta sala, portanto, o método usa retorna false.
    usa(ferramenta, objeto) {
        return false;
    }
}

// -------------------------
// Classe CorridorPRSTEVE
// Sala que contém um terminal contaminado e um relatório (RelatorioPRST).
// A ferramenta "celula_k19" só aparece após descontaminar o terminal com o scanner_kao.
export class CorridorPRSTEVE extends Sala {
    constructor(engine) {
        super("corridor_prst_eve", engine);
        // Adiciona o terminal contaminado à sala
        let terminalDesc = new TerminalDescontaminacao();
        this.objetos.set(terminalDesc.nome, terminalDesc);
        // Adiciona o relatório sobre PRST para orientar a ação
        let relPRST = new RelatorioPRST();
        this.objetos.set(relPRST.nome, relPRST);
        // Inicialmente, a ferramenta celula_k19 não é adicionada aqui
    }

    // Método usa: se o jogador usar scanner_kao no terminal contaminado,
    // o terminal é descontaminado e a celula_k19 é disponibilizada na sala.
    usa(ferramenta, objeto) {
        // Verifica se o jogador possui a ferramenta e se o objeto existe na sala
        if (!this.engine.mochila.tem(ferramenta)) return false;
        if (!this.objetos.has(objeto)) return false;

        let obj = this.objetos.get(objeto);
        let ferr = this.engine.mochila.pega(ferramenta);

        // Se a ferramenta usada for scanner_kao e o objeto for o terminal contaminado
        if (ferr instanceof ScannerKao && obj.nome === "terminal_descontaminacao") {
            let ok = obj.usa(ferr);
            if (ok) {
                console.log("Terminal descontaminado! Agora você encontra a 'celula_k19' disponível!");
                // Cria e adiciona a celula_k19 à lista de ferramentas da sala
                let celula = new CelulaK19();
                this.ferramentas.set(celula.nome, celula);
                // Reimprime a descrição da sala para que o jogador visualize a nova ferramenta
                console.log("\n-------------------------");
                console.log(this.textoDescricao());
                return true;
            }
            return false;
        }

        // Para outras interações, utiliza o método padrão do objeto
        return obj.usa(ferr);
    }
}

// -------------------------
// Classe LabPHSH
// Sala com um terminal de análise e um documento (DocumentoPHSH).
// Se o jogador usar celula_k19 no terminal de análise, gera a mascara_biomecanica.
export class LabPHSH extends Sala {
    constructor(engine) {
        super("lab_phsh", engine);
        // Adiciona o terminal de análise à sala
        let termAnalise = new TerminalAnalise();
        this.objetos.set(termAnalise.nome, termAnalise);
        // Adiciona o documento PHSH para instruir sobre a energização do terminal
        let docPHSH = new DocumentoPHSH();
        this.objetos.set(docPHSH.nome, docPHSH);
    }

    // Método usa: se o jogador utilizar celula_k19 no terminal de análise, o terminal é energizado
    // e gera a mascara_biomecanica, que é adicionada à mochila.
    usa(ferramenta, objeto) {
        if (!this.engine.mochila.tem(ferramenta)) return false;
        if (!this.objetos.has(objeto)) return false;

        let obj = this.objetos.get(objeto);
        let ferr = this.engine.mochila.pega(ferramenta);
        let ok = obj.usa(ferr);
        if (ok && obj.nome === "terminal_analise" && obj.acaoOk) {
            console.log("Uma mascara_biomecanica foi criada e adicionada à mochila!");
            let mascara = new MascaraBiomecanica();
            this.engine.mochila.guarda(mascara);
        }
        return ok;
    }
}

// -------------------------
// Classe ObservatoryNeXGen
// Sala com um painel (PainelKairol) que requer a mascara_biomecanica para ser autenticado e liberar o chip_kamen.
// Ao ativar o painel corretamente, o chip_kamen é adicionado à mochila e o jogo é finalizado.
export class ObservatoryNeXGen extends Sala {
    constructor(engine) {
        super("observatory_nexgen", engine);
        // Adiciona o painel Kairol à sala
        let painel = new PainelKairol();
        this.objetos.set(painel.nome, painel);
        // Adiciona o relatório A28 para instruir sobre a autenticação
        let relA28 = new RelatorioA28();
        this.objetos.set(relA28.nome, relA28);
    }

    // Método usa: se o jogador utilizar a mascara_biomecanica no painel, o painel autentica e libera o chip_kamen.
    usa(ferramenta, objeto) {
        if (!this.engine.mochila.tem(ferramenta)) return false;
        if (!this.objetos.has(objeto)) return false;

        let obj = this.objetos.get(objeto);
        let ferr = this.engine.mochila.pega(ferramenta);
        let ok = obj.usa(ferr);
        if (ok && obj.nome === "painel_kairol" && obj.acaoOk) {
            console.log("O painel_kairol liberou um chip_kamen!");
            let chip = new ChipKamen();
            this.engine.mochila.guarda(chip);
            this.engine.indicaFimDeJogo();
            console.log("Parabéns, você obteve o chip_kamen e completou o jogo!");
        }
        return ok;
    }
}