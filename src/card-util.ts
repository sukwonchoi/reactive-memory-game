export const generateCardMetaData = (uniqueCount: number) => {
  const cardsMetaData = Array.from({ length: uniqueCount * 2 });
  return cardsMetaData.map((val, index) => (index - (index % 2)) / 2);
};

export const removeAllChildNodes = (element: HTMLElement) => {
  while (element.hasChildNodes() && element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

export const shuffle = cards => {
  cards.forEach((val, i) => {
    const rand = Math.floor(Math.random() * i);
    const temp = val;
    cards[i] = cards[rand];
    cards[rand] = temp;
  });

  return cards;
};
