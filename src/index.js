import { fromEvent } from 'rxjs';

fromEvent(document.getElementById('click-me'), 'click').subscribe(() => {
  alert('clicked');
});
