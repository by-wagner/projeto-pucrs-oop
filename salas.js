// salas.js
import {Sala} from "./basicas.js";
import {ScannerKao, CelulaK19, MascaraBiomecanica, ChipKamen} from "./ferramentas.js";
import {
    TerminalDescontaminacao,
    TerminalAnalise,
    PainelKairol,
    DocumentoLDN,
    RelatorioPRST,
    DocumentoPHSH,
    RelatorioA28
} from "./objetos.js";

export class ShelterLDN0 extends Sala {
    constructor(engine) {
        super("shelter_ldn0", engine);
        let docLDN = new DocumentoLDN();
        this.objetos.set(docLDN.nome, docLDN);

        let scanner = new ScannerKao();
        this.ferramentas.set(scanner.nome, scanner);
    }

    usa(ferramenta, objeto) {
        return false;
    }
}

export class CorridorPRSTEVE extends Sala {
    constructor(engine) {
        super("corridor_prst_eve", engine);

        // Terminal contaminado
        let terminalDesc = new TerminalDescontaminacao();
        this.objetos.set(terminalDesc.nome, terminalDesc);

        // Relatório sobre PRST
        let relPRST = new RelatorioPRST();
        this.objetos.set(relPRST.nome, relPRST);

        // Remove a celula_k19 do construtor (ela não aparece ainda)
    }

    usa(ferramenta, objeto) {
        // 1) Verifica se o jogador tem a ferramenta
        if (!this.engine.mochila.tem(ferramenta)) return false;
        // 2) Verifica se existe esse objeto na sala
        if (!this.objetos.has(objeto)) return false;

        let obj = this.objetos.get(objeto);
        let ferr = this.engine.mochila.pega(ferramenta);

        // Se o jogador usar scanner_kao em terminal_descontaminacao
        if (ferr instanceof ScannerKao && obj.nome === "terminal_descontaminacao") {
            let ok = obj.usa(ferr);
            if (ok) {
                console.log("Terminal descontaminado! Agora você encontra a 'celula_k19' disponível!");

                // Agora a celula_k19 aparece na sala
                let celula = new CelulaK19();
                this.ferramentas.set(celula.nome, celula);

                // Reimprime a sala para mostrar a nova ferramenta
                console.log("\n-------------------------");
                console.log(this.textoDescricao());

                return true;
            }
            return false;
        }

        return obj.usa(ferr);
    }
}

export class LabPHSH extends Sala {
    constructor(engine) {
        super("lab_phsh", engine);
        let termAnalise = new TerminalAnalise();
        this.objetos.set(termAnalise.nome, termAnalise);

        let docPHSH = new DocumentoPHSH();
        this.objetos.set(docPHSH.nome, docPHSH);
    }

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

export class ObservatoryNeXGen extends Sala {
    constructor(engine) {
        super("observatory_nexgen", engine);
        let painel = new PainelKairol();
        this.objetos.set(painel.nome, painel);

        let relA28 = new RelatorioA28();
        this.objetos.set(relA28.nome, relA28);
    }

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