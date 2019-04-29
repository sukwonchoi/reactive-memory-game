import { fromEvent, of, Subject, BehaviorSubject } from 'rxjs';
import { filter, map, tap, delay, bufferCount, distinctUntilChanged, scan, withLatestFrom } from 'rxjs/operators';
import { generateCardEl, appendCardToBoard } from './html-render';
import { shuffle, generateCardMetaData, removeAllChildNodes } from './card-util';
import { Card as CardElement } from './custom-elements/card';

interface CardMouseEvent extends MouseEvent {
  target: HTMLDivElement;
  path: HTMLElement[];
}

window.customElements.define('memory-card', CardElement);
const boardEl = document.getElementById('board')!;
const scoreEl = document.getElementById('score')!;

const uniqueCardsCount = 5;

const score$ = new BehaviorSubject(0);
const shuffledCards$ = new Subject<any>();
const shuffledCardElements$ = shuffledCards$.pipe(
  map((shuffledCards: number[]) =>
    shuffledCards.map((value, index) => {
      const card = document.createElement('memory-card') as CardElement;
      card.initializeComponent(value, index);
      return card;
    })
  )
);

const onCardClick$ = fromEvent<CardMouseEvent>(boardEl!, 'click');
const cardValue$ = onCardClick$.pipe(
  filter(e => {
    const target = e.target;
    return !!target && (target.className === 'card-front' || target.className === 'card-back');
  }),
  map(e => e.path[2] as CardElement), // hacky way to find the 'card' element. Figure out better way
  distinctUntilChanged() // so you don't double click the same element
);
const cardPairs$ = cardValue$.pipe(bufferCount(2));

cardValue$.subscribe(e => e.toggleActiveStatus());

cardPairs$
  .pipe(
    delay(800),
    tap(([firstCard, secondCard]) => {
      if (firstCard.value === secondCard.value) {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
      } else {
        firstCard.toggleActiveStatus();
        secondCard.toggleActiveStatus();
      }
    }),
    filter(([firstCard, secondCard]) => firstCard.value === secondCard.value),
    withLatestFrom(score$)
  )
  .subscribe(([_, score]) => {
    if (score === uniqueCardsCount - 1) {
      // basic reset logic
      score$.next(0);
      shuffledCards$.next(shuffle(generateCardMetaData(uniqueCardsCount)));
    } else {
      score$.next(++score);
    }
  });

score$.subscribe(score => (scoreEl.innerHTML = `${score}`));

shuffledCardElements$.subscribe(cards => {
  removeAllChildNodes(boardEl);
  cards.forEach(c => appendCardToBoard(c, boardEl));
});

shuffledCards$.next(shuffle(generateCardMetaData(uniqueCardsCount)));
