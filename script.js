const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const loadingMessage = document.getElementById('loadingMessage'); // Referencia al mensaje de carga

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
  [4, 2, 1, 1],
  [4, 3, 1, 2],
  [3, 5, 1, 1],
  [5, 5, 1, 1],
  [3, 3, 1, 1],
  [5, 3, 1, 1]
];

let selectWord;
let usedLetters;
let mistakes;
let hits;

const addLetter = letter => {
  const letterElement = document.createElement('span');
  letterElement.innerHTML = letter.toUpperCase();
  usedLettersElement.appendChild(letterElement);
};

const addBodyPart = bodyPart => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
  addBodyPart(bodyParts[mistakes]);
  mistakes++;
  if (mistakes === bodyParts.length) endGame();
  console.log('ey');
};

const endGame = () => {
  document.removeEventListener('keydown', letterEvent);
  startButton.style.display = 'block';
  console.log('fin del juego');
};

const correctLetter = letter => {
  const { children } = wordContainer;
  for (let i = 0; i < children.length; i++) {
    if (children[i].innerHTML === letter) {
      children[i].classList.toggle('hidden');
      children[i].style.display = 'inline';
      children[i].style = 'color:white';
      hits++;
    }
  }
  if (hits === selectWord.length) endGame();
};

const letterInput = letter => {
  if (selectWord.includes(letter)) {
    correctLetter(letter);
  } else {
    wrongLetter();
  }
  console.log('bien');
  addLetter(letter);
};

const letterEvent = event => {
  let newLetter = event.key.toUpperCase();
  console.log('no error 7');
  if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
    letterInput(newLetter);
    console.log('no error 8');
  }
};

const drawWord = () => {
  selectWord.forEach(letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    letterElement.classList.add('letter');
    letterElement.classList.add('hidden');
    wordContainer.appendChild(letterElement);
    console.log('no error 6.5');
  });
};

const selectRandomWord = async () => {
  try {
    const response = await fetch('php/obtener_palabra.php');
    console.log('Respuesta del servidor:', response); // Verifica la respuesta
    if (!response.ok) throw new Error('Error al obtener la palabra');

    const data = await response.json();
    console.log('Datos recibidos:', data); // Verifica los datos recibidos

    if (data.error) throw new Error(data.error);
    console.log('no hubo error');

    const word = data.palabra.toUpperCase();
    console.log('no hubo error 2');
    if (word.length < 3) throw new Error('La palabra es demasiado corta');

    selectWord = word.split('');
  } catch (error) {
    console.error('Error al obtener la palabra:', error);
    alert(error.message);
    throw error;
  }
};

const drawHangMan = () => {
  ctx.canvas.width = 120;
  ctx.canvas.height = 160;
  ctx.scale(20, 20);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#d95d39';
  ctx.fillRect(0, 7, 4, 1);
  ctx.fillRect(1, 0, 1, 8);
  ctx.fillRect(2, 0, 3, 1);
  ctx.fillRect(4, 1, 1, 1);
};

const startGame = async () => {
  usedLetters = [];
  mistakes = 0;
  hits = 0;
  wordContainer.innerHTML = '';
  usedLettersElement.innerHTML = '';
  startButton.style.display = 'none';
  loadingMessage.style.display = 'block';
  console.log('Empezo juego');

  try {
    await selectRandomWord();
    drawWord();
    console.log('no error 3');
    document.addEventListener('keydown', letterEvent);
    console.log('no error 4');
    loadingMessage.style.display = 'none';
    console.log('no error 5'); 
  } catch (error) {
    console.error('Error al iniciar el juego:', error);
    startButton.style.display = 'block';
    loadingMessage.style.display = 'none';
  }
  console.log('no error 6');
};

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  startButton.textContent = 'Cargando...';

  console.log('Cargando');


  startGame()
    .then(() => {
      startButton.style.display = 'none';
    })
    .catch(() => {
      startButton.disabled = false;
      startButton.textContent = 'Iniciar Juego';
    });
});