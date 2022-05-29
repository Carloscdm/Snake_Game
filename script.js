
/**
 * TO DO:
 * -Poner imagenes a la serpiente
 * -Poner imagenes a la comida
 * -Hacer que la serpiente abra la boca al comer
 * -Poner un selector de nivel
 * -Mejorar el marcador
 * 
*/


/*
Se recojen los elementos del HTML para usarlos mas adelante
*/
const doc = document;

const board = doc.getElementById('board');
const scoreBoard = doc.getElementById('scoreBoard');
const startButton = doc.getElementById('start');
const gameOverSing = doc.getElementById('gameOver');
const btn_history = doc.getElementById('btn_history');

var ul = doc.getElementById("score-list");

/*
 * Datos de la ventana modal
 */
const modal = doc.querySelector(".modal-start");
const closeBtn = doc.querySelector(".close-btn");

const modalGO = doc.querySelector(".modal-gameover");
const closeBtnGO = doc.querySelector("#close-btn-GO");

const modalSC = doc.querySelector(".modal-score");
const closeBtnSC = doc.querySelector("#close-btn-SC");

/*
Ajustes de Gameplay
*/
const boardSize = 10;
const gameSpeed = 150;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

/*
Variables del juego
*/
let snake;
let score;
let direcction;
let boardSquares;
let emptySquares;
let moveInterval;

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((colum, columIndex) => {
            const squareValue = `${rowIndex}${columIndex}`;
            const squareElement = doc.createElement('div');

            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);

            board.appendChild(squareElement);

            emptySquares.push(squareValue);
        })
    })
}

/*
Controla el movimiento de la serpiente
*/
const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direcction]
    )
        .padStart(2, '0');

    const [row, colum] = newSquare.split('');

    if
        (
        newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direcction === 'ArrowRight' && colum == 0) ||
        (direcction === 'ArrowLeft' && colum == 9 ||
            boardSquares[row][colum] === squareTypes.snakeSquare)
    ) {
        gameOver();
    } else {
        snake.push(newSquare);

        if (boardSquares[row][colum] === squareTypes.foodSquare) {
            addFoot();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFoot = () => {
    score++;
    updateScore();
    createRandomFood();
}

/*
Registra la puntuación en el LocalStorage 
*/
const scoreNote = (name) => {
    //localStorage.clear();
    var hoy = new Date()
    var fecha = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    var fechaYHora = fecha + ' ' + hora;


    let local = {
        player: name,
        score: score,
        date: fechaYHora
    };

    let arr = JSON.parse(localStorage.getItem("score")) || [];
    console.log(arr);
    arr.push(local);

    localStorage.setItem("score", JSON.stringify(arr));
    //console.log(JSON.parse(localStorage.getItem("score")));

}

/*
Acciones cuando se acaba el juego 
*/
const gameOver = () => {
    gameOverSing.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;

    //Solo muestra la ventana de Game Over si el score es mayor a 0
    if(score>0){
        modalGO.classList.add("open-modal");
    }
    
}

const setDirection = newDirection => {
    direcction = newDirection;
}

const directionEvent = key => {

    switch (key.code) {
        case 'ArrowUp':
            direcction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direcction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direcction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direcction != 'ArrowLeft' && setDirection(key.code)
            break;
    }

}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];

    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}


/*
Rellena cada cuadrado del tablero
@params
square: posicion del cuadrado,
type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
*/
const drawSquare = (square, type) => {
    const [row, colum] = square.split('');
    boardSquares[row][colum] = squareTypes[type];

    const squareElement = doc.getElementById(square);

    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length - 4;
    direcction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}


/*
Realiza las acciones para iniciar el juego
*/
const startGame = () => {

    setGame();

    gameOverSing.style.display = 'none';
    startButton.disabled = true;

    drawSnake();

    updateScore();

    createRandomFood();

    doc.addEventListener('keydown', directionEvent);

    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}

//localStorage.clear();
modal.classList.add("open-modal");
setGame();

closeBtn.addEventListener("click", function () {
    modal.classList.remove("open-modal");
    //startGame();
});

closeBtnGO.addEventListener("click", function () {
    var nameScore = document.querySelector("#score-name").value;

    if (nameScore !== null && nameScore !== '') {
        scoreNote(nameScore);
    }

    modalGO.classList.remove("open-modal");
});

closeBtnSC.addEventListener("click", function () {
    modalSC.classList.remove("open-modal");
    ul.innerHTML = "";
});


const seeHistory = () => {
    let json = JSON.parse(localStorage.getItem("score"));
    try {
        //Ordena el json por el score
        json.sort((a, b) => b.score - a.score);

        for (var i in json) {
            if (json[i] != null) {
                var li = document.createElement("li");
                li.append(json[i].player + '...' + json[i].score + '...' + json[i].date);
                ul.append(li);
            }
        }
        modalSC.classList.add("open-modal");
    } catch (error) {
        console.log(error);
    }

}

//Evento cuando se pulsa el botón de start, ejecuta la función "startGame"
startButton.addEventListener('click', startGame);

btn_history.addEventListener('click', seeHistory);