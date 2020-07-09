import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation, fadeAnimation } from './animations';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'details-webapp';
}
