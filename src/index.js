import { fromEvent } from 'rxjs';

const boardEl = document.getElementById('board');

fromEvent(boardEl, 'click', 'div.card').subscribe(e => {
  console.log(e.target);
});

const generateCardEl = code => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = code;
  card.setAttribute('value', code);
  return card;
};

const appendCardToBoard = (card, board = boardEl) => {
  boardEl.appendChild(card);
};

// hardcode 9 for now
[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => appendCardToBoard(generateCardEl(i)));
