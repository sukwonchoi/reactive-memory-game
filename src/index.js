import { fromEvent, of, Subject, BehaviorSubject } from 'rxjs';
import { filter, map, tap, delay, bufferCount, distinctUntilChanged, scan, withLatestFrom } from 'rxjs/operators';
import { generateCardEl, appendCardToBoard } from './html-render';
import { CARD_VALUE_ATTRIBUTE } from './constants';
import { shuffle } from './card-util';

const boardEl = document.getElementById('board');
const array = [1, 2, 3, 3, 2, 1];

const score$ = new BehaviorSubject(0);
const shuffledCards$ = new Subject();
const shuffledCardElements$ = shuffledCards$.pipe(map(shuffledCards => shuffledCards.map(generateCardEl)));

const onCardClick$ = fromEvent(boardEl, 'click');
const cardValue$ = onCardClick$.pipe(
  filter(e => e.target.className === 'card-front' || e.target.className === 'card-back'),
  map(e => e.path[2]), // hacky way to find the 'card' element. Figure out better way
  distinctUntilChanged() // so you don't double click the same element
);
const cardPairs$ = cardValue$.pipe(bufferCount(2));

cardValue$.subscribe(e => e.classList.toggle('active'));

cardPairs$
  .pipe(
    delay(500),
    tap(([firstCard, secondCard]) => {
      if (firstCard.getAttribute(CARD_VALUE_ATTRIBUTE) === secondCard.getAttribute(CARD_VALUE_ATTRIBUTE)) {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
      } else {
        firstCard.classList.toggle('active');
        secondCard.classList.toggle('active');
      }
    }),
    filter(
      ([firstCard, secondCard]) =>
        firstCard.getAttribute(CARD_VALUE_ATTRIBUTE) === secondCard.getAttribute(CARD_VALUE_ATTRIBUTE)
    ),
    withLatestFrom(score$)
  )
  .subscribe(([_, score]) => {
    if (score === 2) {
      // basic reset logic
      score$.next(0);
      shuffledCards$.next(shuffle(array));
    } else {
      score$.next(++score);
    }
  });

shuffledCardElements$.subscribe(cards => cards.forEach(c => appendCardToBoard(c, boardEl)));

shuffledCards$.next(shuffle(array));
