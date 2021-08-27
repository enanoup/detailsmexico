import { Component, OnInit, Output, AfterViewInit } from '@angular/core';
// import { slideInAnimation } from './animations';
import { LocalStorageService } from './services/local-storage.service';
import { InnovationService } from './services/innovation.service';
import { Producto } from './pages/interfaces/producto-interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  /*
  animations: [
    slideInAnimation
  ]
  */
})

export class AppComponent implements OnInit, AfterViewInit{
  title = 'details-webapp';

    async ngAfterViewInit() {
     
    }
   async ngOnInit() {
  }
}
