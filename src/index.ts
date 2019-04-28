import { fromEvent, of, Subject, BehaviorSubject } from 'rxjs';
import { filter, map, tap, delay, bufferCount, distinctUntilChanged, scan, withLatestFrom } from 'rxjs/operators';
import { generateCardEl, appendCardToBoard } from './html-render';
import { shuffle } from './card-util';
import { Card } from './custom-elements/card';

import './index.ts';

window.customElements.define('memory-card', Card);

const boardEl = document.getElementById('board');
const array = [1, 2, 3, 3, 2, 1, 4, 4];

const score$ = new BehaviorSubject(0);
const shuffledCards$ = new Subject<any>();
const shuffledCardElements$ = shuffledCards$.pipe(
  map((shuffledCards: number[]) =>
    shuffledCards.map((value, index) => {
      const card = document.createElement('memory-card') as Card;
      card.initializeComponent(value, index);
      return card;
    })
  )
);

const onCardClick$ = fromEvent<any>(boardEl!, 'click');
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
    withLatestFrom(shuffledCards$),
    tap(([[firstCard, secondCard], cards]) => {
      console.log({ firstCard, secondCard, cards });
      if (firstCard.value === secondCard.value) {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
      } else {
        firstCard.classList.toggle('active');
        secondCard.classList.toggle('active');
      }
    }),
    filter(([[firstCard, secondCard], cards]) => firstCard.value === secondCard.value),
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
