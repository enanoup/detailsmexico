import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Producto } from '../interfaces/producto-interface';
import { PromolineProductSingle } from '../interfaces/promoline-interface';
import { InnovationProduct } from '../interfaces/innovation-interface';
import { ProductoService } from '../../services/producto.service';

import { environment } from '../../../environments/environment';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { LocalStorageService } from '../../services/local-storage.service';

let $ = (window as any)['jQuery'];

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit, AfterViewInit {

  productosNuevos: Producto[] = [];
  productosBestSeller: Producto[] = [];
  loading = false;
  spinner = false;

  form: any;
  name: string;
  email: string;

  referidosForm: any;
  nameFrom: string;
  emailFrom: string;

  nameRef: string;
  emailRef: string;

  // Configuración reCaptcha Google
  recaptcha: string;
  siteKey = environment.recaptcha_webkey;


  callToAction = '¡PIDE COTIZACIÓN!';

  imgPath = '../../assets/images/portadas/';

  // Aquí agregamos o quitamos los banners
  banners = {
    pc: [
      'KIT_PC.jpeg',
      'REGALOS_PC.jpeg',
      'TAZAS_PC.jpeg'
    ],
    celular: [
      'KIT_CEL.jpeg',
      'REGALOS_CEL.jpeg',
      'TAZAS_CEL.jpeg'
    ]
  };

  numDeBanners: any[] = Array (this.banners.pc.length);

  subscripcion: Subscription;

  constructor(private formBuilder: FormBuilder,
              private formService: FormsService,
              private storageService: LocalStorageService) {

    this.form = this.formBuilder.group({
      name: new FormControl(this.name, [Validators.required]),
      email: new FormControl(this.email, [Validators.required, Validators.email]),
      recaptcha: new FormControl(this.recaptcha, [Validators.required])
    });

    this.referidosForm = this.formBuilder.group({
      nameFrom: new FormControl (this.nameFrom, Validators.required),
      nameRef: new FormControl (this.nameRef, Validators.required),
      emailFrom: new FormControl(this.emailFrom, [Validators.required, Validators.email]),
      emailRef: new FormControl(this.emailRef, [Validators.required, Validators.email])
    });
   }

   resolvedCaptcha( response: any ) {
    this.recaptcha = response;
   }


   private activarCarruselesDeAparador() {

    $('.furniture--4').owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 4,
      navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>' ],
      dots: false,
      lazyLoad: true,
      responsive: {
          0: {
            items: 1
          },
          576: {
            items: 2
          },
          768: {
            items: 3
          },
          992: {
            items: 4
          },
          1920: {
            items: 4
          }
      }
    });

    $('.furniture--10').owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 4,
      navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>' ],
      dots: false,
      lazyLoad: true,
      responsive: {
          0: {
            items: 1
          },
          576: {
            items: 2
          },
          768: {
            items: 3
          },
          992: {
            items: 4
          },
          1920: {
            items: 4
          }
      }
    });
   }
  
  async ngAfterViewInit() {

  }

  resetRefForm() {
    this.referidosForm.reset();
  }

  onSubmitRefForm( customerData: any) {

    this.subscripcion = this.formService.sendEmailReferidosForm(
                customerData.nameFrom, customerData.emailFrom, customerData.nameRef, customerData.emailRef)
                .subscribe(() => {
                  swal.fire('Gracias por tu referido!',
                'Se te notificará sobre las nuevas promociones y regalos',
                'success').finally(this.referidosForm.reset());
                });
  }


  onSubmit(customerData: any) {

    this.subscripcion = this.formService.sendEmailMarketingForm(customerData.name, customerData.email, customerData.recaptcha)
            .subscribe(() => {
                swal.fire('¡Listo!',
                'Se te notificará sobre los nuevos lanzamientos y las mejores promociones',
                'success').finally(this.form.reset());
            });
  }


  async loadImages() {

    // Obtenemos los DIVS de los banners que se generaron con el ngFor
    const banners: any = document.querySelectorAll('.banner');

    // Obtenemos el ancho de lang serve pantalla
    const screenWidth = window.innerWidth;

    if ( banners ) {
      if ( screenWidth < 420) { // tamaño en pixeles
        for ( let i = 0; i < this.numDeBanners.length; i++) {
          banners[i].style.backgroundImage = `url('${ this.imgPath }${this.banners.celular[i]}')`;
        }
      } else {
        for ( let i = 0; i < this.numDeBanners.length; i++) {
          banners[i].style.backgroundImage = `url('${ this.imgPath }${this.banners.pc[i]}')`;
        }
      }
    }
  }

  triggerModal() {
    $('#bannerModal').modal({ show: false});

    setTimeout(() => {
      $('#bannerModal').modal('show');
    }, 3000);
  }


  loadAllProducts(): Promise<boolean> {

    return new Promise (resolve => {
      
      this.storageService.getNewAndBestsellerProducts().then ( newAndBestProducts => {
        
        if(newAndBestProducts) {
          for (let i = 0; i < newAndBestProducts.length; i++){
                if( i < 10 ) {
                  this.productosBestSeller.push(newAndBestProducts[i]);
                } else {
                  this.productosNuevos.push(newAndBestProducts[i]);
                }
          }  
        }
      });

      resolve (true);
    });
  }


  async ngOnInit() {  

    // Este código va a activar el banner de promociones
    // this.triggerModal();

  this.loading = await this.loadAllProducts();

  if(this.loading) {
     
      setTimeout(() => {
        // Colocamos un spinner mientras se cargan los productos del carrusel. 
        this.spinner = true;
        this.activarCarruselesDeAparador();
      }, 2000);
 
    }

    
    // Primero se tienen que cargar las imágenes, luego el carrusel. 
    await this.loadImages();
    // Activamos los carruseles
    this.activateSliderPrincipal();
    // Cargamos los elementos bestSeller y los nuevos productos
  }

  private activateSliderPrincipal() {
    // Activa el slider principal
    $('.slide__activation').owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      autoplay: true,
      autoplayTimeout: 8000,
      items: 2,
      navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>' ],
      dots: false,
      lazyLoad: true,
      responsive: {
      0: {
        items: 1
      },
      1920: {
        items: 1
      }
      }
    });
  }


}
