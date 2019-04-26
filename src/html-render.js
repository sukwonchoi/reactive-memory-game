import { CARD_VALUE_ATTRIBUTE } from './constants';

export const generateCardEl = (code, index) => {
  const card = document.createElement('div');
  card.setAttribute(CARD_VALUE_ATTRIBUTE, index);
  card.className = 'card';

  const cardContainer = document.createElement('div');
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

export const appendCardToBoard = (card, board) => {
  board.appendChild(card);
};
