// postHumanGame.js
// Este arquivo define a subclasse de Engine que cria o cenário do jogo e exibe a narrativa inicial.

import { Engine } from "./basicas.js";
import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

import {
    ShelterLDN0,
    CorridorPRSTEVE,
    LabPHSH,
    ObservatoryNeXGen
} from "./salas.js";

export class postHumanGame extends Engine {
    // Campos para armazenar as salas criadas
    shelter;
    corridor;
    lab;
    observ;

    constructor() {
        // Chama o constructor da classe Engine
        super();
        // Cria o cenário do jogo: instanciando as salas e definindo suas conexões
        this.criaCenario();
    }

    // Cria as salas e estabelece as conexões entre elas
    criaCenario() {
        // Instancia as salas
        this.shelter = new ShelterLDN0(this);
        this.corridor = new CorridorPRSTEVE(this);
        this.lab = new LabPHSH(this);
        this.observ = new ObservatoryNeXGen(this);

        // Definindo as conexões conforme a lógica:
        // Shelter pode ir para Corridor e Lab
        this.shelter.portas.set(this.corridor.nome, this.corridor);
        this.shelter.portas.set(this.lab.nome, this.lab);

        // Corridor pode ir para Shelter e Lab
        this.corridor.portas.set(this.shelter.nome, this.shelter);
        this.corridor.portas.set(this.lab.nome, this.lab);

        // Lab pode ir para Shelter, Corridor e Observatory
        this.lab.portas.set(this.shelter.nome, this.shelter);
        this.lab.portas.set(this.corridor.nome, this.corridor);
        this.lab.portas.set(this.observ.nome, this.observ);

        // Observatory pode voltar para Lab
        this.observ.portas.set(this.lab.nome, this.lab);
    }

    // Exibe a narrativa inicial e inicia o loop de comandos do jogo
    joga() {
        // Exibe a introdução e o objetivo do jogo
        console.log("Bem-vindo a POST-HUMAN: Reconnection Protocol!");
        console.log("O mundo foi devastado pelo Fenômeno Kao...");
        console.log("Seu objetivo é reativar a Rede Kairol e encontrar o chip_kamen...\n");

        // Solicita o nome do jogador e exibe uma mensagem de boas-vindas
        let nomeJogador = prompt("Qual o seu nome? ");
        console.log("Olá, " + nomeJogador + "! Boa sorte na sua jornada!\n");
        console.log("Digite 'help' para ver os comandos disponíveis.\n");

        // Define a sala inicial (ShelterLDN0) e exibe sua descrição
        this.salaCorrente = this.shelter;
        console.log("\n-------------------------");
        console.log(this.salaCorrente.textoDescricao());

        // Inicia o loop principal de comandos definido na Engine
        super.joga();
    }
}