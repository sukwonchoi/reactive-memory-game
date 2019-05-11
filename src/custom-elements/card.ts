// import { SA } from '../assets';

import * as cardBackUrl from '../assets/card-back.png';
import * as SA from '../assets/SA.png';
import * as HK from '../assets/HK.png';
import * as CJ from '../assets/CJ.png';

const cards = [SA, HK, CJ];
export class CardElement extends HTMLElement {
  value?: number;
  index?: number;
  constructor() {
    super();
  }

  initializeComponent(value: number, index: number) {
    this.className = 'card';
    this.value = value;
    this.index = index;
    this.render();
  }

  toggleActiveStatus() {
    this.classList.toggle('active');
  }

  getCard() {}

  render() {
    this.innerHTML = `
    <div class="card-container">
      <div class="card-back">
      <img class="card-img" src="${this.value != null ? cards[this.value] : null}" />
      </div>
      <div class="card-front">
        <img class="card-img" src="${cardBackUrl.default}" />
      </div>
    </div>`;
  }
}
