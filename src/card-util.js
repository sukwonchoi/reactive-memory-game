export const shuffle = cards => {
  cards.forEach((val, i) => {
    const rand = Math.floor(Math.random() * i);
    const temp = val;
    cards[i] = cards[rand];
    cards[rand] = temp;
  });

  return cards;
};
