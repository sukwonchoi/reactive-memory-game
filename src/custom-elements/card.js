export class Card extends HTMLElement {
  constructor() {
    super();
  }

  initializeComponent(value, index) {
    this.className = 'card';
    this.value = value;
    this.index = index;
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="card-container">
      <div class="card-back">${this.value}</div>
      <div class="card-front">?</div>
    </div>`;
  }
}
