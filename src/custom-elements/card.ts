// import { SA } from '../assets';

import * as cardBackUrl from '../assets/card-back.png';

export class CardElement<T = number> extends HTMLElement {
  value?: T;
  index?: number;
  constructor() {
    super();
  }

  initializeComponent(value: T, index: number) {
    this.className = 'card';
    this.value = value;
    this.index = index;
    this.render();
  }

  toggleActiveStatus() {
    this.classList.toggle('active');
  }

  render() {
    this.innerHTML = `
    <div class="card-container">
      <div class="card-back">
        ${this.value}
      </div>
      <div class="card-front">
        <img class="card-img" src="${cardBackUrl.default}" />
      </div>
    </div>`;
  }
}
