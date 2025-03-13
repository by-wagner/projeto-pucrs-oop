# POST-HUMAN: Reconnection Protocol

**POST-HUMAN: Reconnection Protocol** é um jogo de aventura textual criado para a disciplina de **Programação Orientada a Objetos** (PUCRS). Nele, o jogador deve explorar ambientes devastados pelo Fenômeno Kao, ler documentos, coletar ferramentas e resolver enigmas para reativar a Rede Kairol e proteger a humanidade das Ecos.

---

## Objetivo

- **Reativar a Rede Kairol**
- **Encontrar o ChipKamen**
- **Tornar a humanidade invisível às Ecos**

---

## Como Executar

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Clone este repositório ou baixe os arquivos.
3. Abra o terminal na pasta do projeto.
4. Instale as dependências:
   ```bash npm install```
5. Execute o jogo:
   ```node index.js```

---

## Comandos Disponíveis

- **pega <ferramenta>**
  - Guarda uma ferramenta da sala na mochila.

- **usa <ferramenta> <objeto>**
  - Usa a ferramenta em um objeto para resolver puzzles.

- **inventario**
  - Lista as ferramentas atualmente na mochila.

- **entra <nome_da_sala> ou sai <nome_da_sala>**
  - Move o jogador para outra sala conectada.

- **ler <nome_do_objeto>**
  - Lê o conteúdo de um documento/relatório.

- **voltar**
  - Retorna à sala anterior.

- **help**
  - Lista todos os comandos disponíveis.

- **fim**
  - Encerra o jogo imediatamente.

---

## Estrutura do Projeto

- index.js
- basicas.js
- ferramentas.js
- objetos.js
- postHumanGame.js
- salas.js

---

## Licença e Créditos

Este projeto foi desenvolvido como parte de um trabalho acadêmico na PUCRS, na disciplina de Programação Orientada a Objetos ministrada pelos professores Bernardo Copstein e Júlio Machado.
