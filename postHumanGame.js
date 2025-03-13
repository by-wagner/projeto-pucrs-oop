// postHumanGame.js
import {Engine} from "./basicas.js";
import promptSync from "prompt-sync";

const prompt = promptSync({sigint: true});

import {
    ShelterLDN0,
    CorridorPRSTEVE,
    LabPHSH,
    ObservatoryNeXGen
} from "./salas.js";

export class postHumanGame extends Engine {
    shelter;
    corridor;
    lab;
    observ;

    constructor() {
        super();
        this.criaCenario();
    }

    criaCenario() {
        this.shelter = new ShelterLDN0(this);
        this.corridor = new CorridorPRSTEVE(this);
        this.lab = new LabPHSH(this);
        this.observ = new ObservatoryNeXGen(this);

        // Lógica: Shelter <-> Corridor, Shelter <-> Lab, Corridor <-> Lab, Lab <-> Observatory
        this.shelter.portas.set(this.corridor.nome, this.corridor);
        this.shelter.portas.set(this.lab.nome, this.lab);

        this.corridor.portas.set(this.shelter.nome, this.shelter);
        this.corridor.portas.set(this.lab.nome, this.lab);

        this.lab.portas.set(this.shelter.nome, this.shelter);
        this.lab.portas.set(this.corridor.nome, this.corridor);
        this.lab.portas.set(this.observ.nome, this.observ);

        this.observ.portas.set(this.lab.nome, this.lab);
    }

    joga() {
        console.log("Bem-vindo a POST-HUMAN: Reconnection Protocol!");
        console.log("O mundo foi devastado pelo Fenômeno Kao...");
        console.log("Seu objetivo é reativar a Rede Kairol e encontrar o chip_kamen...\n");

        let nomeJogador = prompt("Qual o seu nome? ");
        console.log("Olá, " + nomeJogador + "! Boa sorte na sua jornada!\n");
        console.log("Digite 'help' para ver os comandos disponíveis.\n");

        // Define a sala inicial e imprime
        this.salaCorrente = this.shelter;

        console.log("\n-------------------------");
        console.log(this.salaCorrente.textoDescricao());

        super.joga();
    }
}