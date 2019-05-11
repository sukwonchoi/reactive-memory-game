import { fromEvent, of, Subject, BehaviorSubject, pipe } from 'rxjs';
import {
  filter,
  map,
  tap,
  delay,
  bufferCount,
  distinctUntilChanged,
  scan,
  withLatestFrom,
  switchMap
} from 'rxjs/operators';
import { generateCardEl, appendCardToBoard } from './html-render';
import { shuffle, generateCardMetaData, removeAllChildNodes } from './card-util';
import { CardElement } from './custom-elements/card';

interface CardMouseEvent extends MouseEvent {
  target: HTMLDivElement;
  path: HTMLElement[];
}

interface GameConfig {
  count: number;
}

window.customElements.define('memory-card', CardElement);

// html DOM elements
const boardEl = document.getElementById('board')!;
const scoreEl = document.getElementById('score')!;
const startButtonEl = document.getElementById('start')!;
const restartButtonEl = document.getElementById('restart')!;

const onCardClick$ = fromEvent<CardMouseEvent>(boardEl!, 'click');
const restartButtonClicked$ = fromEvent<CardMouseEvent>(restartButtonEl!, 'click');
const startButtonClicked$ = fromEvent<CardMouseEvent>(startButtonEl!, 'click');

// Subjects
const start$ = new Subject<GameConfig>();
const clearBoard$ = new Subject();
const uniqueCardCount$ = new BehaviorSubject(3);
const score$ = new BehaviorSubject(0);

startButtonClicked$.pipe(withLatestFrom(uniqueCardCount$)).subscribe(([_, count]) => start$.next({ count }));
restartButtonClicked$.pipe(withLatestFrom(uniqueCardCount$)).subscribe(([_, count]) => start$.next({ count }));

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

const cardValue$ = onCardClick$.pipe(
  filter(e => {
    const target = e.target;
    return !!target && target.className === 'card-img';
  }),
  map(e => e.path[3] as CardElement), // hacky way to find the 'card' element. Figure out better way
  distinctUntilChanged() // so you don't double click the same element
);
cardValue$.subscribe(e => e.toggleActiveStatus());
const cardPairs$ = cardValue$.pipe(bufferCount(2));

// add all game state initialization logic in here.
// should be called by start, or restart actions.
const initializeGameState = (config: GameConfig) => {
  score$.next(0);
  shuffledCards$.next(shuffle(generateCardMetaData(config.count)));
};

start$
  .pipe(
    switchMap(config => {
      initializeGameState(config);
      return cardPairs$.pipe(
        tap(() => (boardEl.style.pointerEvents = 'none')),
        delay(800),
        tap(([firstCard, secondCard]) => {
          boardEl.style.pointerEvents = 'auto';
          if (firstCard.value === secondCard.value) {
            firstCard.style.visibility = 'hidden';
            secondCard.style.visibility = 'hidden';
          } else {
            firstCard.toggleActiveStatus();
            secondCard.toggleActiveStatus();
          }
        }),
        filter(([firstCard, secondCard]) => firstCard.value === secondCard.value)
      );
    }),
    withLatestFrom(score$, start$)
  )
  .subscribe(([_, score, config]) => {
    if (score === config.count - 1) {
      // basic reset logic
      start$.next(config);
    } else {
      score$.next(++score);
    }
  });

score$.subscribe(score => (scoreEl.innerHTML = `${score}`));

shuffledCardElements$.subscribe(cards => {
  removeAllChildNodes(boardEl);
  cards.forEach(c => appendCardToBoard(c, boardEl));
});
