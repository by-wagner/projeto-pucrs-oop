// basicas.js
import promptsync from "prompt-sync";

// -------------------------
// Ferramenta
export class Ferramenta {
    #nome;

    constructor(nome) {
        this.#nome = nome;
    }

    get nome() {
        return this.#nome;
    }

    usar() {
        return true;
    }

    info() {
        return this.#nome;
    }
}

// -------------------------
// Mochila
export class Mochila {
    #ferramentas;

    constructor() {
        this.#ferramentas = [];
    }

    guarda(ferramenta) {
        if (!(ferramenta instanceof Ferramenta)) {
            throw new Error("Não é uma Ferramenta válida");
        }
        this.#ferramentas.push(ferramenta);
    }

    pega(nomeFerramenta) {
        return this.#ferramentas.find(f => f.nome === nomeFerramenta);
    }

    tem(nomeFerramenta) {
        return this.#ferramentas.some(f => f.nome === nomeFerramenta);
    }

    inventario() {
        return this.#ferramentas
            .map(f => (typeof f.info === "function" ? f.info() : f.nome))
            .join(", ");
    }
}

// -------------------------
// Objeto
export class Objeto {
    #nome;
    #descricaoAntesAcao;
    #descricaoDepoisAcao;
    #acaoOk;

    constructor(nome, descAntes, descDepois) {
        this.#nome = nome;
        this.#descricaoAntesAcao = descAntes;
        this.#descricaoDepoisAcao = descDepois;
        this.#acaoOk = false;
    }

    get nome() {
        return this.#nome;
    }

    get acaoOk() {
        return this.#acaoOk;
    }

    set acaoOk(val) {
        this.#acaoOk = val;
    }

    get descricao() {
        if (!this.#acaoOk) {
            return this.#descricaoAntesAcao;
        }
        return this.#descricaoDepoisAcao;
    }

    usa(ferramenta, objeto) {
        return false;
    }
}

// -------------------------
// Sala
export class Sala {
    #nome;
    #objetos;
    #ferramentas;
    #portas;
    #engine;

    constructor(nome, engine) {
        this.#nome = nome;
        this.#objetos = new Map();
        this.#ferramentas = new Map();
        this.#portas = new Map();
        this.#engine = engine;
    }

    get nome() {
        return this.#nome;
    }

    get objetos() {
        return this.#objetos;
    }

    get ferramentas() {
        return this.#ferramentas;
    }

    get portas() {
        return this.#portas;
    }

    get engine() {
        return this.#engine;
    }

    objetosDisponiveis() {
        let arr = [...this.#objetos.values()];
        return arr.map(o => o.nome + ":" + o.descricao);
    }

    ferramentasDisponiveis() {
        let arr = [...this.#ferramentas.values()];
        return arr.map(f => f.nome);
    }

    portasDisponiveis() {
        let arr = [...this.#portas.values()];
        // Ordena alfabeticamente
        arr.sort((a, b) => a.nome.localeCompare(b.nome));
        return arr.map(s => s.nome);
    }

    pega(nomeFerramenta) {
        let ferr = this.#ferramentas.get(nomeFerramenta);
        if (ferr) {
            this.#engine.mochila.guarda(ferr);
            this.#ferramentas.delete(nomeFerramenta);
            return true;
        }
        return false;
    }

    sai(nomeSala) {
        // Retorna a sala (objeto) que corresponde a esse nome
        return this.#portas.get(nomeSala);
    }

    textoDescricao() {
        let desc = "Você está no " + this.#nome + "\n";

        let arrObjs = [...this.#objetos.values()];
        if (arrObjs.length === 0) {
            desc += "Não há objetos na sala\n";
        } else {
            desc += "Objetos: " + this.objetosDisponiveis().join(", ") + "\n";
        }

        let arrFerr = [...this.#ferramentas.values()];
        if (arrFerr.length === 0) {
            desc += "Não há ferramentas na sala\n";
        } else {
            desc += "Ferramentas: " + this.ferramentasDisponiveis().join(", ") + "\n";
        }

        let portas = this.portasDisponiveis();
        if (portas.length === 0) {
            desc += "Portas: Nenhuma\n";
        } else {
            desc += "Portas: " + portas.join(", ") + "\n";
        }

        return desc;
    }

    usa(ferramenta, objeto) {
        return false;
    }

    ler(nomeObj) {
        if (!this.#objetos.has(nomeObj)) return false;
        let obj = this.#objetos.get(nomeObj);
        obj.usa(null);
        return true;
    }
}

// -------------------------
// Engine
export class Engine {
    #mochila;
    #salaCorrente;
    #salaAnterior;
    #fim;

    constructor() {
        this.#mochila = new Mochila();
        this.#salaCorrente = null;
        this.#salaAnterior = null;
        this.#fim = false;
    }

    get mochila() {
        return this.#mochila;
    }

    get salaCorrente() {
        return this.#salaCorrente;
    }

    set salaCorrente(sala) {
        // Não imprime nada aqui, para evitar duplicação
        if (this.#salaCorrente) {
            this.#salaAnterior = this.#salaCorrente;
        }
        this.#salaCorrente = sala;
    }

    indicaFimDeJogo() {
        this.#fim = true;
    }

    criaCenario() {
        // Subclasse define
    }

    mostraAjuda() {
        console.log(`
Comandos disponíveis:
  pega <ferramenta>
  usa <ferramenta> <objeto>
  inventario
  entra <nome_da_sala>
  sai <nome_da_sala>
  ler <nome_do_objeto>
  voltar (retorna à sala anterior)
  fim
  help
`);
    }

    joga() {
        const prompt = promptsync({sigint: true});

        while (!this.#fim) {
            let acao = prompt("O que voce deseja fazer? ");
            let tokens = acao.split(" ");

            switch (tokens[0]) {
                case "fim":
                    console.log("Jogo encerrado!");
                    this.#fim = true;
                    break;

                case "help":
                    this.mostraAjuda();
                    break;

                case "pega":
                    if (!this.#salaCorrente) {
                        console.log("Você não está em nenhuma sala!");
                        break;
                    }
                    if (tokens.length < 2) {
                        console.log("Uso: pega <ferramenta>");
                    } else {
                        let ferr = tokens[1];
                        if (this.#salaCorrente.pega(ferr)) {
                            console.log(`Ok! ${ferr} guardado!`);
                        } else {
                            console.log(`Ferramenta ${ferr} não encontrada.`);
                        }
                    }
                    break;

                case "inventario":
                    console.log("Ferramentas na mochila: " + this.#mochila.inventario());
                    break;

                case "usa":
                    if (!this.#salaCorrente) {
                        console.log("Você não está em nenhuma sala!");
                        break;
                    }
                    if (tokens.length < 3) {
                        console.log("Uso: usa <ferramenta> <objeto>");
                    } else {
                        let ferr = tokens[1];
                        let obj = tokens[2];
                        if (this.#salaCorrente.usa(ferr, obj)) {
                            console.log("Feito!!");
                            if (this.#fim) {
                                console.log("Parabéns, você venceu!");
                            }
                        } else {
                            console.log(`Não é possível usar ${ferr} sobre ${obj} nesta sala.`);
                        }
                    }
                    break;

                case "entra":
                case "sai":
                    if (!this.#salaCorrente) {
                        console.log("Você não está em nenhuma sala!");
                        break;
                    }
                    if (tokens.length < 2) {
                        console.log(`Uso: ${tokens[0]} <nome_da_sala>`);
                    } else {
                        let nomeSala = tokens[1];
                        let novaSala = this.#salaCorrente.sai(nomeSala);
                        if (!novaSala) {
                            console.log("Sala desconhecida ...");
                        } else {
                            this.salaCorrente = novaSala;
                            console.log("\n-------------------------");
                            console.log(this.#salaCorrente.textoDescricao());
                        }
                    }
                    break;

                case "ler":
                    if (!this.#salaCorrente) {
                        console.log("Você não está em nenhuma sala!");
                        break;
                    }
                    if (tokens.length < 2) {
                        console.log("Uso: ler <nome_do_objeto>");
                    } else {
                        let nomeObj = tokens[1];
                        if (this.#salaCorrente.ler(nomeObj)) {
                            console.log(`Você leu ${nomeObj}`);
                        } else {
                            console.log(`Não foi possível ler ${nomeObj}`);
                        }
                    }
                    break;

                case "voltar":
                    if (this.#salaAnterior) {
                        this.salaCorrente = this.#salaAnterior;
                        console.log("\n-------------------------");
                        console.log(this.#salaCorrente.textoDescricao());
                    } else {
                        console.log("Você ainda não tem para onde voltar.");
                    }
                    break;

                default:
                    console.log(`Comando desconhecido: ${tokens[0]}`);
                    break;
            }
        }
    }
}