import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

// declare var google: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  contactForm: any;
  firstname: string;
  lastname: string;
  email: string;
  telefono: string;
  mensaje: string;

  // Google reCaptcha

  recaptcha: string;
  siteKey = environment.recaptcha_webkey;

  subscripcion: Subscription;

  constructor( private formBuilder: FormBuilder, private formService: FormsService) {

    this.contactForm = this.formBuilder.group({
        firstname: new FormControl(this.firstname, Validators.required ),
        lastname: new FormControl(this.lastname, Validators.required),
        email: new FormControl(this.email, [Validators.required, Validators.email]),
        telefono: new FormControl(this.telefono),
        mensaje: new FormControl(this.mensaje, [Validators.required]),
        recaptcha: new FormControl(this.recaptcha, [Validators.required])
      });
  }

  resolvedCaptcha( response: any ) {
      this.recaptcha = response;
  }

  onSubmit(customerData: any) {

    this.subscripcion = this.formService.sendContactForm(
        customerData.firstname, customerData.lastname, customerData.email,
        customerData.telefono, customerData.mensaje, customerData.recaptcha)
            .subscribe(() => {
                swal.fire(`Gracias ${ customerData.firstname }`,
                'Tu solicitud ha sido recibida, en breve estaremos en contacto contigo',
                'success').finally(this.contactForm.reset());
            });

  }

  ngOnInit() {

 /*
    IMPLEMENTACION DE GOOGLE MAPS
    const mapOptions = {
      // How zoomed in you want the map to start at (always required)
      zoom: 16,

      scrollwheel: false,

      // The latitude and longitude to center the map (always required)
      center: new google.maps.LatLng(19.513691, -99.266225), // New York

      // How you would like to style the map.
      // This is where you would paste any style found on Snazzy Maps.
       styles:
[

  {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
          {
              color: '#444444'
          }
      ]
  },
  {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
          {
              color: '#f2f2f2'
          }
      ]
  },
  {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
          {
              visibility: 'off'
          }
      ]
  },
  {
      featureType: 'road',
      elementType: 'all',
      stylers: [
          {
              saturation: -100
          },
          {
              lightness: 45
          }
      ]
  },
  {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
          {
              visibility: 'simplified'
          }
      ]
  },
  {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [
          {
              visibility: 'off'
          }
      ]
  },
  {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
          {
              visibility: 'off'
          }
      ]
  },
  {
      featureType: 'transit.station.bus',
      elementType: 'labels.icon',
      stylers: [
          {
              saturation: '-16'
          }
      ]
  },
  {
      featureType: 'water',
      elementType: 'all',
      stylers: [
          {
              color: '#04b7ff'
          },
          {
              visibility: 'on'
          }
      ]
  }
]

  };

  // Get the HTML DOM element that will contain your map
  // We are using a div with id="map" seen below in the <body>
    const mapElement = document.getElementById('googleMap');

  // Create the Google Map using our element and options defined above
    const map = new google.maps.Map(mapElement, mapOptions);

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(19.513691, -99.266225),
      map,
      title: 'Dcare!',
      // tslint:disable-next-line: max-line-length
      icon: 'http://www.detailsmexico.com/wp-content/uploads/2017/07/mapmark.png',
      animation: google.maps.Animation.BOUNCE

  });
  */

  }

  ngOnDestroy() {
    if ( this.subscripcion ) {
        this.subscripcion.unsubscribe();
      }
  }

}
