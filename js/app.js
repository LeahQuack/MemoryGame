/*SPECIAL THANKS TO MATTHEW CRANFORD & MIKE WALES FOR THE WALKTHRU.
 *First big project - I never would have figured all of this out.
 *Things make more sense with JavaScript, having done this project.
 *
 * Create a list that holds all of your cards
 */

//Tells where to get the deck from
//Tells where the cards are
//Toggled card becomes array
const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8;

//Takes NodeList and uses Array.from to create an array from NodeList
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  //references original objects to change node order
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();

//Tells the game what to do when card is clicked
deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (isClickValid(clickTarget)) {
    if (clockOff) {
      startClock();
      clockOff = false;
    }
  }
  if (clickTarget.classList.contains('card') &&
    toggledCards.length < 2) {
    toggleCard(clickTarget);
    addToggleCard(clickTarget);
    if (toggledCards.length === 2) {
      checkForMatch(clickTarget);
      addMove();
      checkScore();
    }
    if (matched === TOTAL_PAIRS) {
      gameOver();
    }
  }
});

function gameOver() {
  stopClock();
  writeModalStats();
  toggleModal();
}

//Code for clock
//Starting the clock
function startClock() {
  clockId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

//Properly displaying time with mins and secs
function displayTime() {
  const clock = document.querySelector(".clock");
  clock.innerHTML = time;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`
  }
}

//Stopping the clock
function stopClock() {
  clearInterval(clockId);
}

//Flipping cards
function toggleCard(clickTarget) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

function toggleCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
  console.log(toggledCards);
}

//Checks to make sure when clicked: it is a card, they both match and //only two are opened at a time
function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  )
};

//If they don't match, timeout flips them back over.
function checkForMatch() {
  if (toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    matched++;
  } else {
    setTimeout(() => {
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 500);
  }
};

//checks the number of moves to determine if a star should be hidden
function checkScore() {
  if (moves === 16 || moves === 24) {
    hideStar();
  }
}

//counts the number of moves
function addMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

//as moves are used, stars are hidden to decrease score
function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

//document.querySelector('.modal_replay').addEventListener('click', replayGame);

//document.querySelector('.restart').addEventListener('click', resetGame);


//Toggles the modal
function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}

function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  const stars = getStars();

  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++;
    }
  }
  return starCount;
}

//Resetting the game
function replayGame() {
  resetGame();
  toggleModal();
}

function resetGame() {
  resetClockandTime();
  resetMoves();
  resetStars();
  resetCards();
  resetMatched();
  shuffleDeck();
}

function resetClockandTime() {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

function resetCards() {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    card.className = 'card';
  }
}

function resetMatched() {
  matched = 0;
}



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var allCards = document.querySelectorAll('.card');
var openCards = [];
