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

let $ = (window as any)['jQuery'];

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit, AfterViewInit {

  productosNuevos: Producto[] = [];
  productosBestSeller: Producto[] = [];
  promolineProducto: PromolineProductSingle;

  innovationProducts: InnovationProduct[] = [];
  detailsProducts: Producto[] = [];
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
      'DIA_DEL_PADRE_PC.jpg',
      'GEL_ANTIBACTERIAL_PC.jpg',
      'RECOMIENDA_Y_GANA_PC.jpg',
      'TAPETES_PC.jpg',
      'TRABAJA_EN_CASA_PC.jpg',
      'VICTORINOX_PC.jpg'
    ],
    celular: [
      'DIA_DEL_PADRE_CELULAR.jpg',
      'GEL_ANTIBACTERIAL_CELULAR.jpg',
      'RECOMIENDA_Y_GANA_CELULAR.jpg',
      'TAPETES_CELULAR.jpg',
      'TRABAJA_EN_CASA_CELULAR.jpg',
      'VICTORINOX_CELULAR.jpg'
    ]
  };

  numDeBanners: any[] = Array (this.banners.pc.length);

  subscripcion: Subscription;

  constructor(private productoService: ProductoService, private formBuilder: FormBuilder,
              private formService: FormsService) {

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

  async ngAfterViewInit() {


    setTimeout(() => {

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

  }, 1000);

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

    /*
    let img1 = '';
    let img2 = '';
    let img3 = '';

    const banner1: any = document.getElementById('banner1');
    const banner2: any = document.getElementById('banner2');
    // const banner3: any = document.getElementById('banner3');

    const screenWidth = window.innerWidth;

    if ( screenWidth < 420 ) {
      img1 = '../../assets/images/portadas/BANNER-MOVIL-640X815.jpg';
      img2 = '../../assets/images/portadas/REFERIDOS01.jpg';
      img3 = '';
    } else {
        // desktop image
      img1 = '../../assets/images/portadas/BANNER-VITORINOX.jpg';
      img2 = '../../assets/images/portadas/REFERIDOS01.jpg';
      img3 = '';
    }

    const bgValue1 = 'url(' + img1 + ')';
    const bgValue2 = 'url(' + img2 + ')';
    const bgValue3 = 'url(' + img3 + ')';

    banner1.style.backgroundImage = bgValue1;
    banner2.style.backgroundImage = bgValue2;
    // banner3.style.backgroundImage = bgValue3;
    */
  }

  triggerModal() {
    $('#bannerModal').modal({ show: false});

    setTimeout(() => {
      $('#bannerModal').modal('show');
    }, 3000);
  }

  async ngOnInit() {


    this.triggerModal();

    await this.productoService.getNewAndBestsellerProducts().then ( productosResolve  => {

      productosResolve.forEach( producto => {
        if (producto.masVendido) {
          this.productosBestSeller.push(producto);
        } else {
          this.productosNuevos.push( producto );
        }
      });

    });

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
