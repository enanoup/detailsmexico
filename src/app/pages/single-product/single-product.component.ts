import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Producto, Url } from '../interfaces/producto-interface';
import { ProductoService } from '../../services/producto.service';
import swal from 'sweetalert2';
import { LocalStorageService } from '../../services/local-storage.service';

let $ = (window as any)['jQuery'];

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})

export class SingleProductComponent implements OnInit, AfterViewInit {

    singleProduct: Producto = null;
    cantidad = 1; // Esta mapeado con ngModel y es el valor mínimo que aparece

    bestSellerProducts: Producto[] = [];
    newProducts: Producto[] = [];

  constructor(private route: ActivatedRoute,
              private shoppingService: ShoppingCartService,
              private productoService: ProductoService,
              private storageService: LocalStorageService) {}


    loadFotorama(urls: Url[]) {

      const imgs = [];

      urls.forEach( url => {
          const obj = {
            img: url.url,
            thumb: url.url
          };
          imgs.push(obj);
      });

      // Revisar el API de Fotorama ahí viene todo
      const fotoramaDiv = $('.fotorama').fotorama();
      const fotorama = fotoramaDiv.data('fotorama');

      fotorama.load(imgs);
    }

    agregaProductoAlCarrito(producto: Producto) {

      if ( this.cantidad <= producto.cantidad) {
        this.shoppingService.grabarShoppingCart(producto, this.cantidad);

        setTimeout(() => {
          this.shoppingService.sendProductAddCart(true);
        }, 500);
      } else {
        swal.fire('Lo Sentimos',
        `Solo hay disponibles <strong>${ producto.cantidad }</strong>
        artículos de <br/><strong style="color: #921018;">${ producto.nombre }</strong>`,
        'error');
      }

    }

    getBestAndNewProducts() : Promise<boolean> {
          
      return new Promise ( resolve => {

        this.storageService.getNewAndBestsellerProducts().then( responseProducts => {
          if(responseProducts) {
            for( let i=0; i<responseProducts.length; i++){
              if(i < 10){
                this.bestSellerProducts.push(responseProducts[i]);
              } else {
                this.newProducts.push(responseProducts[i]);
              }
            }
          }
        });
      resolve (true);
      });

    }

    async ngOnInit() {

    // Este producto viene del resolver para que cargue el prod antes de renderizar la pagina

    this.singleProduct = this.route.snapshot.data.producto;
 
    await this.getBestAndNewProducts();

    this.route.params.subscribe ( param => {
      this.route.snapshot = param.sku;
    });

    // Por alguna razón hay que esperar a que carguen bien los productos
    setTimeout(() => {
      this.loadFotorama(this.singleProduct.urls);
    }, 2000);
   
    }

  ngAfterViewInit() {

    setTimeout(() => {

      // Activa el plugin para inciar el carrousel de productos
      $('.productcategory__slide--2').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        autoplay: true,
        autoplayTimeout: 5000,
        items: 3,
        navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>' ],
        dots: false,
        lazyLoad: true,
        responsive: {
            0: {
              items: 2
            },
            576: {
              items: 2
            },
            768: {
              items: 3
            },
            1920: {
              items: 4
            }
        }
      });

    }, 500);
  }

}
