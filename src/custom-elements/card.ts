export class Card<T = number> extends HTMLElement {
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
      <div class="card-back">${this.value}</div>
      <div class="card-front">?</div>
    </div>`;
  }
}
