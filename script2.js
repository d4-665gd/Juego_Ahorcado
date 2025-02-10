const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const loadingMessage = document.getElementById('loadingMessage'); // Referencia al mensaje de carga

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 120;
ctx.canvas.height = 160;
ctx.scale(20,20);

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
let palabrasadivinadas = 0;

const addLetter = letter => {
  const letterElement = document.createElement('span');
  letterElement.innerHTML = letter.toUpperCase();
  usedLettersElement.appendChild(letterElement);
};

const addBodyPart = () => {
    if (mistakes < bodyParts.length) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(...bodyParts[mistakes]);
      console.log('Dibujando parte del cuerpo:', mistakes);
    }
  };
  

  const wrongLetter = () => {
    if (mistakes < bodyParts.length) {
      addBodyPart(); // Dibujar la parte del cuerpo correspondiente al error
      mistakes++; // Incrementar el contador de errores
      console.log('Errores cometidos:', mistakes); // Depuración
    }
    if (mistakes === bodyParts.length) {
      endGame(); // Llamar a endGame sin parámetro (ganador = false por defecto)
    }
  };

  const endGame = (ganador = false) => {
    document.removeEventListener('keydown', letterEvent); // Desactivar eventos de teclado
    startButton.style.display = 'block'; // Mostrar el botón de inicio
  
    if (ganador) {
      startButton.textContent = 'SIGUIENTE';
      palabrasadivinadas++; // Mensaje si el jugador ganó
      startButton.disabled = false; // Habilitar el botón para reiniciar el juego
    } else {
      startButton.textContent = `PERDEDOR - Adivinaste ${palabrasadivinadas} palabras`; // Mensaje si el jugador perdió
      startButton.disabled = true; // Deshabilitar el botón
    }
  
    console.log('Fin del juego'); // Depuración
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
    if (hits === selectWord.length) {
      endGame(true); // Llamar a endGame con ganador = true
    }
  };
  
  const letterInput = letter => {
    // Agregar la letra a la lista de letras usadas
    usedLetters.push(letter);
    console.log('Letras usadas:', usedLetters); // Verificar las letras usadas
  
    // Verificar si la letra está en la palabra seleccionada
    if (selectWord.includes(letter)) {
      correctLetter(letter); // Si es correcta, procesarla
    } else {
        wrongLetter(); // Si es incorrecta, contar como error
        console.log('Letra incorrecta:', letter); // Depuración
      }
  };
  
  const letterEvent = event => {
    let newLetter = event.key.toUpperCase();
    console.log('Letra ingresada:', newLetter); // Verificar la letra ingresada
  
    // Verificar si es una letra válida y no ha sido usada
    if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
      letterInput(newLetter); // Procesar la letra
      console.log('Letra procesada:', newLetter); // Verificar que la letra se procesó
    } else {
      console.log('Letra ya usada o no válida:', newLetter); // Verificar letras no válidas o repetidas
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    ctx.fillStyle = '#d95d39'; // Color de la estructura del ahorcado
  
    // Dibujar la base del ahorcado
    ctx.fillRect(0, 7, 4, 1); // Base horizontal
    ctx.fillRect(1, 0, 1, 8); // base vertical
    ctx.fillRect(2, 0, 3, 1); // Travesaño superior
    ctx.fillRect(4, 1, 1, 1); // Soporte diagonal
  };

  const startGame = async () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
   // palabrasadivinadas = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    startButton.style.display = 'none';
    startButton.textContent = 'Cargando...'; // Reiniciar el texto del botón
    startButton.disabled = false;
    loadingMessage.style.display = 'block';
    console.log('Empezó el juego');
  
    try {
      await selectRandomWord();
      drawHangMan(); // Dibujar la estructura del ahorcado al inicio
      drawWord();
      document.addEventListener('keydown', letterEvent);
      loadingMessage.style.display = 'none';
    } catch (error) {
      console.error('Error al iniciar el juego:', error);
      startButton.style.display = 'block';
      startButton.textContent = 'Iniciar Juego';       // Reiniciar el texto del botón en caso de error
      startButton.disabled = false; 
      loadingMessage.style.display = 'none';
    }
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