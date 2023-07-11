// pegar o elemento canvas e colocar na variavel canvas
const canvas = document.getElementById("gameCanvas");
// pegar o contexto 2D do canvas e colocar na variavel context
const context = canvas.getContext("2d");

// tamanho da imagem
const tamanhoImagem = 32;
// largura do canvas(tela do jogo)  
const larguraCanvas = canvas.width;
// altura do canvas(tela do jogo)
const alturaCanvas = canvas.height;

// parametros da pacman quando o jogo inicia
const pacman = {
    x: 160,
    y: 160,
    dx: tamanhoImagem,
    dy: 0,
    celulas: [],
    tamanhoMaximo: 1,
};

// parametros iniciais do alvo
const alvo = {
    x: 320,
    y: 320,
};

// carrega a imagem fantasma
const image = new Image()
image.src = './images/ghost.png'

// carrega a imagem pacman
var imagePac = new Image()
imagePac.src = './images/pac.png'

// gera um número aleatório entre min e max
// Função que recebe dois parâmetros.
function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// inicializa o jogo
// declaração e uso de 1 função sem retorno
function loop() {
    // o numero é a velocidade do jogo
    setTimeout(atualizarJogo, 100);
}

// Atualiza a tela do jogo a cada 100 milisegundos
function atualizarJogo() {
    // chama a função do canvas para atualizar o jogo
    requestAnimationFrame(loop);
    limparCanvas();
    atualizarPacman();
    desenharPacman();
    desenharAlvo();
}

// Limpa a tela do canvas
function limparCanvas() {
    context.clearRect(0, 0, larguraCanvas, alturaCanvas);
}
//declaração e uso de 1 função sem parâmetro
function atualizarPacman() {
    // move a pacman adicionando uma célula na frente dela e removendo a última célula
    pacman.celulas.unshift({ x: pacman.x, y: pacman.y });

    // remove células da pacman se ela estiver maior que o tamanho máximo
    if (pacman.celulas.length > pacman.tamanhoMaximo) {
        // remove a última célula
        pacman.celulas.pop();
    }

    moverPacman();
    verificarSePacmanEncontrouAlvo();
}

// move o pacman
function moverPacman() {

    // adiciona a direção direita ou esquerda atual posição da pacman
    pacman.x += pacman.dx;
    // adiciona a direção para cima ou para baixo atual posição da pacman
    pacman.y += pacman.dy;

    // verifica se a pacman saiu do canvas
    if (pacman.x < 0) {
        // se saiu pela esquerda, volta pela direita
        pacman.x = larguraCanvas - tamanhoImagem;
    } else if (pacman.x >= larguraCanvas) {
        // se saiu pela direita, volta pela esquerda
        pacman.x = 0;
    }

    // verifica se a pacman saiu do canvas
    if (pacman.y < 0) {
        // se saiu por cima, volta por baixo
        pacman.y = alturaCanvas - tamanhoImagem;
    } else if (pacman.y >= alturaCanvas) {
        // se saiu por baixo, volta por cima
        pacman.y = 0;
    }
}

// verifica se o pacman encontrou o alvo
function verificarSePacmanEncontrouAlvo() {
    pacman.celulas.forEach(function (cell, index) {
        // verifica se a pacman encontrou o alvo
        if (cell.x === alvo.x && cell.y === alvo.y) {
            // aumenta o tamanho da pacman
            pacman.tamanhoMaximo++;
            // gera uma nova posição para o alvo
            gerarPosicaoAleatoriaParaAlvo();
        }

        // verifica se a pacman colidiu com ela mesma
        for (let i = index + 1; i < pacman.celulas.length; i++) {
            if (cell.x === pacman.celulas[i].x && cell.y === pacman.celulas[i].y) {
                // reseta o jogo
                resetarJogo();
            }
        }
    });
}

// desenha o pacman
function desenharPacman() {
    for (let i = 0; i < pacman.celulas.length; i++) {
        if (i === 0) {
            context.drawImage(
                imagePac,
                pacman.celulas[i].x,
                pacman.celulas[i].y,
                tamanhoImagem,
                tamanhoImagem
            )
            continue;
        }

        context.drawImage(
            image,
            pacman.celulas[i].x,
            pacman.celulas[i].y,
            tamanhoImagem,
            tamanhoImagem
        )
    }
}
// desenha o alvo
function desenharAlvo() {
    context.drawImage(
        image,
        alvo.x,
        alvo.y,
        tamanhoImagem - 1,
        tamanhoImagem - 1
    )
}

// gera uma posição aleatória para o alvo
function gerarPosicaoAleatoriaParaAlvo() {
    // gera uma posição horizontal  aleatória para o alvo
    alvo.x = gerarNumeroAleatorio(0, larguraCanvas / tamanhoImagem) * tamanhoImagem;
    // gera uma posição vertical aleatória para o alvo
    alvo.y = gerarNumeroAleatorio(0, alturaCanvas / tamanhoImagem) * tamanhoImagem;
}

//declaração e uso de 1 função com retorno
function gerarNumeroAleatorio(min, max) {
    // gera um número aleatório entre min e max
    return Math.floor(Math.random() * (max - min)) + min;
}

// reseta o jogo quando a pacman colidir com ela mesma
function resetarJogo() {
    pacman.x = 160;
    pacman.y = 160;
    pacman.celulas = [];
    pacman.tamanhoMaximo = 1;
    pacman.dx = tamanhoImagem;
    pacman.dy = 0;
    imagePac.src = './images/pac.png'
    gerarPosicaoAletariaParaAlvo();
}

// adiciona os eventos dos botões
document.addEventListener("keydown", function (e) {
    const { key } = e;
    // verifica se a tecla pressionada foi seta para cima
    const foiParaCima = key === "ArrowUp";
    // verifica se a tecla pressionada foi seta para esquerda
    const foiParaEsquerda = key === "ArrowLeft";
    // verifica se a tecla pressionada foi seta para direita
    const foiParaDireita = key === "ArrowRight";
    // verifica se a tecla pressionada foi seta para baixo
    const foiParaBaixo = key === "ArrowDown";

    if (foiParaEsquerda && pacman.dx === 0) {
        // se a pacman foi para esquerda e não estiver indo para direita
        // muda a direção para esquerda
        pacman.dx = -tamanhoImagem;
        // não muda a direção vertical
        pacman.dy = 0;
        imagePac.src = './images/pacEsquerda.png'
    } else if (foiParaCima && pacman.dy === 0) {
        // se a pacman foi para cima e não estiver indo para baixo 
        // muda a direção para cima
        pacman.dy = -tamanhoImagem;
        // não muda a direção horizontal
        pacman.dx = 0;
        imagePac.src = './images/pacCima.png'
    } else if (foiParaDireita && pacman.dx === 0) {
        // se a pacman foi para direita e não estiver indo para esquerda
        // muda a direção para direita
        pacman.dx = tamanhoImagem;
        // não muda a direção vertical
        pacman.dy = 0;
        imagePac.src = './images/pac.png'
    } else if (foiParaBaixo && pacman.dy === 0) {
        // se a pacman foi para baixo e não estiver indo para cima
        // muda a direção para baixo
        pacman.dy = tamanhoImagem;
        // não muda a direção horizontal
        pacman.dx = 0;
        imagePac.src = './images/pacBaixo.png'
    }
});

loop();