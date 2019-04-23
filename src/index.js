import { fromEvent } from 'rxjs';
import { filter, map, delay, tap, bufferCount, distinctUntilChanged } from 'rxjs/operators';

const CARD_VALUE_ATTRIBUTE = 'data-card-value';

const boardEl = document.getElementById('board');

const onCardClick$ = fromEvent(boardEl, 'click');
const cardValue$ = onCardClick$.pipe(
  filter(e => e.target.className === 'card-front' || e.target.className === 'card-back'),
  map(e => e.path[2]), // hacky way to find the 'card' element. Figure out better way
  distinctUntilChanged() // so you don't double click the same element
);
const cardPairs$ = cardValue$.pipe(bufferCount(2));

cardValue$.subscribe(e => e.classList.toggle('active'));

cardPairs$.pipe(delay(500)).subscribe(([firstCard, secondCard]) => {
  if (firstCard.getAttribute(CARD_VALUE_ATTRIBUTE) === secondCard.getAttribute(CARD_VALUE_ATTRIBUTE)) {
    firstCard.style.visibility = 'hidden';
    secondCard.style.visibility = 'hidden';
  } else {
    firstCard.classList.toggle('active');
    secondCard.classList.toggle('active');
  }
});

const generateCardEl = code => {
  const card = document.createElement('div');
  card.setAttribute(CARD_VALUE_ATTRIBUTE, code);
  card.className = 'card';

  const cardContainer = document.createElement('div');
  cardContainer.setAttribute(CARD_VALUE_ATTRIBUTE, code);
  cardContainer.className = 'card-container';

  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';
  cardBack.innerHTML = code;

  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';
  cardFront.innerHTML = '?';

  cardContainer.appendChild(cardBack);
  cardContainer.appendChild(cardFront);

  card.appendChild(cardContainer);
  return card;
};

const appendCardToBoard = (card, board = boardEl) => {
  boardEl.appendChild(card);
};

// hardcode 9 for now
[1, 2, 3, 3, 2, 1].forEach(i => appendCardToBoard(generateCardEl(i)));
