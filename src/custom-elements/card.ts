export class Card extends HTMLElement {
  value: any;
  index: any;
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

  render() {
    this.innerHTML = `
    <div class="card-container">
      <div class="card-back">${this.value}</div>
      <div class="card-front">?</div>
    </div>`;
  }
}
