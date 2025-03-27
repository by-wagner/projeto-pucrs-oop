// basicas.js
import promptsync from "prompt-sync";

// -------------------------
// Classe Ferramenta
// Representa uma ferramenta básica usada no jogo.
export class Ferramenta {
    #nome; // Nome da ferramenta (campo privado)

    constructor(nome) {
        this.#nome = nome;
    }

    // Retorna o nome da ferramenta
    get nome() {
        return this.#nome;
    }

    // Método usar: retorna true por padrão. Deve ser sobrescrito em subclasses quando necessário.
    usar() {
        return true;
    }

    // Retorna informações da ferramenta (usado no inventário)
    info() {
        return this.#nome;
    }
}

// -------------------------
// Classe Mochila
// Gerencia as ferramentas coletadas pelo jogador.
export class Mochila {
    #ferramentas; // Array privado para armazenar as ferramentas

    constructor() {
        this.#ferramentas = [];
    }

    // Adiciona uma ferramenta à mochila
    guarda(ferramenta) {
        if (!(ferramenta instanceof Ferramenta)) {
            throw new Error("Não é uma Ferramenta válida");
        }
        this.#ferramentas.push(ferramenta);
    }

    // Retorna a ferramenta com o nome especificado
    pega(nomeFerramenta) {
        return this.#ferramentas.find(f => f.nome === nomeFerramenta);
    }

    // Verifica se a ferramenta com o nome especificado existe na mochila
    tem(nomeFerramenta) {
        return this.#ferramentas.some(f => f.nome === nomeFerramenta);
    }

    // Retorna uma string com informações de todas as ferramentas da mochila
    inventario() {
        return this.#ferramentas
            .map(f => (typeof f.info === "function" ? f.info() : f.nome))
            .join(", ");
    }
}

// -------------------------
// Classe Objeto
// Representa um objeto ou documento interativo do jogo.
export class Objeto {
    #nome;                 // Nome do objeto
    #descricaoAntesAcao;   // Descrição antes de interagir com o objeto
    #descricaoDepoisAcao;  // Descrição após a interação
    #acaoOk;               // Indica se a ação esperada já ocorreu (true ou false)

    constructor(nome, descAntes, descDepois) {
        this.#nome = nome;
        this.#descricaoAntesAcao = descAntes;
        this.#descricaoDepoisAcao = descDepois;
        this.#acaoOk = false;
    }

    // Retorna o nome do objeto
    get nome() {
        return this.#nome;
    }

    // Getter e setter para o estado da ação
    get acaoOk() {
        return this.#acaoOk;
    }
    set acaoOk(val) {
        this.#acaoOk = val;
    }

    // Retorna a descrição atual do objeto, de acordo com o estado da ação
    get descricao() {
        return !this.#acaoOk ? this.#descricaoAntesAcao : this.#descricaoDepoisAcao;
    }

    // Método usar padrão; deve ser sobrescrito em subclasses para definir interações específicas
    usa(ferramenta, objeto) {
        return false;
    }
}

// -------------------------
// Classe Sala
// Representa um ambiente do jogo com objetos, ferramentas e portas para outras salas.
export class Sala {
    #nome;         // Nome da sala
    #objetos;      // Map de objetos presentes na sala
    #ferramentas;  // Map de ferramentas presentes na sala
    #portas;       // Map de portas (conexões para outras salas)
    #engine;       // Referência à engine do jogo

    constructor(nome, engine) {
        this.#nome = nome;
        this.#objetos = new Map();
        this.#ferramentas = new Map();
        this.#portas = new Map();
        this.#engine = engine;
    }

    // Retorna o nome da sala
    get nome() {
        return this.#nome;
    }

    // Getters para objetos, ferramentas e portas
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

    // Retorna uma lista de objetos disponíveis (com nome e descrição)
    objetosDisponiveis() {
        let arr = [...this.#objetos.values()];
        return arr.map(o => o.nome + ":" + o.descricao);
    }

    // Retorna uma lista dos nomes das ferramentas disponíveis
    ferramentasDisponiveis() {
        let arr = [...this.#ferramentas.values()];
        return arr.map(f => f.nome);
    }

    // Retorna uma lista ordenada dos nomes das salas conectadas (portas)
    portasDisponiveis() {
        let arr = [...this.#portas.values()];
        arr.sort((a, b) => a.nome.localeCompare(b.nome));
        return arr.map(s => s.nome);
    }

    // Permite que o jogador pegue uma ferramenta presente na sala e a guarde na mochila
    pega(nomeFerramenta) {
        let ferr = this.#ferramentas.get(nomeFerramenta);
        if (ferr) {
            this.#engine.mochila.guarda(ferr);
            this.#ferramentas.delete(nomeFerramenta);
            return true;
        }
        return false;
    }

    // Retorna a sala conectada cujo nome foi especificado
    sai(nomeSala) {
        return this.#portas.get(nomeSala);
    }

    // Retorna uma string com a descrição completa da sala (incluindo objetos, ferramentas e portas)
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

    // Método para usar uma ferramenta em um objeto (padrão; pode ser sobrescrito nas subclasses)
    usa(ferramenta, objeto) {
        return false;
    }

    // Método para "ler" um objeto (por exemplo, um documento)
    ler(nomeObj) {
        if (!this.#objetos.has(nomeObj)) return false;
        let obj = this.#objetos.get(nomeObj);
        obj.usa(null); // Simula a leitura, que pode alterar o estado do objeto
        return true;
    }
}

// -------------------------
// Classe Engine
// Responsável por gerenciar o jogo: controle de salas, inventário e o loop principal de comandos.
export class Engine {
    #mochila;        // Mochila do jogador
    #salaCorrente;   // Sala atual do jogador
    #salaAnterior;   // Sala anterior (para o comando "voltar")
    #fim;            // Flag que indica o fim do jogo

    constructor() {
        this.#mochila = new Mochila();
        this.#salaCorrente = null;
        this.#salaAnterior = null;
        this.#fim = false;
        // A subclasse chamará criaCenario() no seu constructor após o super()
    }

    // Retorna a mochila
    get mochila() {
        return this.#mochila;
    }

    // Retorna a sala atual
    get salaCorrente() {
        return this.#salaCorrente;
    }

    // Define a sala atual e atualiza a salaAnterior
    set salaCorrente(sala) {
        if (this.#salaCorrente) {
            this.#salaAnterior = this.#salaCorrente;
        }
        this.#salaCorrente = sala;
    }

    // Indica que o jogo terminou
    indicaFimDeJogo() {
        this.#fim = true;
    }

    // Método a ser sobrescrito pela subclasse para criar o cenário do jogo
    criaCenario() {
        // Subclasse define
    }

    // Exibe os comandos disponíveis para o jogador
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

    // Loop principal do jogo: lê comandos do jogador e executa as ações correspondentes
    joga() {
        const prompt = promptsync({ sigint: true });

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

                // Comandos "entra" e "sai" para mudar de sala; ambos usam a mesma lógica:
                // O jogador digita o nome da sala para a qual deseja ir.
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