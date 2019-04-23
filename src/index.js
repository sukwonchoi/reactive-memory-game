import { fromEvent } from 'rxjs';
import { filter, map, delay, tap, bufferCount, distinctUntilChanged } from 'rxjs/operators';
import { generateCardEl, appendCardToBoard } from './html-render';
import { CARD_VALUE_ATTRIBUTE } from './constants';
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

[1, 2, 3, 3, 2, 1].forEach(i => appendCardToBoard(generateCardEl(i), boardEl));
